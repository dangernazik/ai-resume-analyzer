"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UploadZone from "@/components/upload-zone";
import ResultsCard from "@/components/results-card";
import { AnalysisResult } from "@/types";
import { toast } from "sonner";
import ResultsSkeleton from "@/components/results-skeleton";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [language, setLanguage] = useState<"uk" | "en" | "auto">("auto");

  const canSubmit = file && jobDescription.trim().length > 20;

  async function handleAnalyze() {
    if (!canSubmit || !file) return;
    setIsLoading(true);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("file", file);
      formData.append("jobDescription", jobDescription);
      formData.append("language", language);

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error ?? "Щось пішло не так");
        return;
      }

      setResult(data);
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      toast.error("Помилка з'єднання");   
    } finally {
      setIsLoading(false);
    }
  }

  return (
<main className="min-h-screen py-12 px-6" style={{
  background: "radial-gradient(ellipse 80% 50% at 20% 0%, rgba(6, 182, 212, 0.15) 0%, transparent 60%), radial-gradient(ellipse 60% 40% at 80% 100%, rgba(99, 102, 241, 0.15) 0%, transparent 60%), #0f172a"
}}>
      <div className="max-w-6xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-white">
            AI Resume Analyzer
          </h1>
          <p className="text-slate-400">
            Завантаж резюме, вкажи вакансію — отримай детальний аналіз від AI
          </p>
        </div>

        {/* Two columns */}
        <div className="flex flex-col lg:flex-row gap-8 items-start">

          {/* Left — inputs */}
          <div className="w-full lg:w-[460px] lg:shrink-0 space-y-6">

            {/* Language toggle */}
<div className="flex items-center gap-2">
  <span className="text-slate-400 text-sm">Мова результату:</span>
  <div className="flex rounded-lg border border-slate-700 overflow-hidden">
    {(["auto", "uk", "en"] as const).map((lang) => (
      <button
  key={lang}
  onClick={() => !file && setLanguage(lang)}
  disabled={!!file}
  className={`px-3 py-1.5 text-sm transition-colors ${
    language === lang
      ? "bg-cyan-500 text-slate-900 font-semibold"
      : "text-slate-400 hover:text-slate-200 hover:bg-slate-700"
  } ${file ? "opacity-50 cursor-not-allowed" : ""}`}
>
        {lang === "auto" ? "Auto" : lang === "uk" ? "🇺🇦 UA" : "🇬🇧 EN"}
      </button>
    ))}
  </div>
</div>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-200 text-lg">
                  1. Завантаж резюме (PDF)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <UploadZone onFileSelect={setFile} />
              </CardContent>
            </Card>

            <Card className="bg-slate-800 border-slate-700">
              <CardHeader>
                <CardTitle className="text-slate-200 text-lg">
                  2. Встав опис вакансії
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  placeholder="Встав сюди текст вакансії з DOU, LinkedIn або іншого сайту..."
                  className="min-h-40 resize-none bg-slate-900 border-slate-600 text-slate-200 placeholder:text-slate-500 focus:border-cyan-400 focus:ring-cyan-400"
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                />
                <p className="text-xs text-slate-500 mt-2">
                  {jobDescription.length} символів
                  {jobDescription.length < 20 && jobDescription.length > 0 && " — занадто мало"}
                </p>
              </CardContent>
            </Card>

            <Button
              onClick={handleAnalyze}
              disabled={!canSubmit || isLoading}
              className="w-full h-12 text-base bg-cyan-500 hover:bg-cyan-400 text-slate-900 font-semibold disabled:opacity-40"
            >
              {isLoading ? "Аналізуємо... ⏳" : "Аналізувати резюме 🚀"}
            </Button>

          </div>

          {/* Right — results */}
          <div className="w-full min-h-[400px]">
           {result ? (
                <ResultsCard result={result} />
                    ) : isLoading ? (
                      <ResultsSkeleton />
                    ) : (
              <div className="h-full min-h-100 flex items-center justify-center border-2 border-dashed border-slate-700 rounded-xl text-center p-10">
                <div className="space-y-3">
                  <div className="text-5xl">🤖</div>
                  <p className="text-slate-500 text-sm">
                    Результат аналізу з&apos;явиться тут
                  </p>
                </div>
              </div>
            )}
          </div>

        </div>
      </div>
    </main>
  );
}