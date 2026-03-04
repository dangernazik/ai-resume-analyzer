"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import UploadZone from "@/components/upload-zone";

export default function Home() {
  const [file, setFile] = useState<File | null>(null);
  const [jobDescription, setJobDescription] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const canSubmit = file && jobDescription.trim().length > 20;

  async function handleAnalyze() {
  if (!canSubmit || !file) return;
  setIsLoading(true);

  try {
    const formData = new FormData();
    formData.append("file", file);
    formData.append("jobDescription", jobDescription);

    const res = await fetch("/api/analyze", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      alert(data.error ?? "Щось пішло не так");
      return;
    }

    console.log("Результат:", data);
    alert(`Скор: ${data.score}/100`); // тимчасово, завтра зробимо UI
  } catch (e) {
    alert("Помилка з'єднання");
  } finally {
    setIsLoading(false);
  }
}

  return (
    <main className="min-h-screen bg-slate-50 py-12 px-4">
      <div className="max-w-2xl mx-auto space-y-8">

        {/* Header */}
        <div className="text-center space-y-2">
          <h1 className="text-4xl font-bold text-slate-900">
            AI Resume Analyzer
          </h1>
          <p className="text-slate-500">
            Upload CV, choose job description — get detailed AI analysis
          </p>
        </div>

        {/* Upload */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">1. Upload your CV (PDF)</CardTitle>
          </CardHeader>
          <CardContent>
            <UploadZone onFileSelect={setFile} />
          </CardContent>
        </Card>

        {/* Job description */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">2. Paste job description</CardTitle>
          </CardHeader>
          <CardContent>
            <Textarea
              placeholder="Paste job description from DOU, LinkedIn or other site..."
              className="min-h-[160px] resize-none"
              value={jobDescription}
              onChange={(e) => setJobDescription(e.target.value)}
            />
            <p className="text-xs text-slate-400 mt-2">
              {jobDescription.length} символів
              {jobDescription.length < 20 && jobDescription.length > 0 && " — занадто мало"}
            </p>
          </CardContent>
        </Card>

        {/* Submit */}
        <Button
          onClick={handleAnalyze}
          disabled={!canSubmit || isLoading}
          className="w-full h-12 text-base"
        >
          {isLoading ? "Analyzing... ⏳" : "Analyze Resume 🚀"}
        </Button>

      </div>
    </main>
  );
}