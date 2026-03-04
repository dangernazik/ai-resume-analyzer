"use client";

import { AnalysisResult } from "@/types";
import { getT } from "@/lib/i18n";
import type { Lang } from "@/lib/i18n";

type Props = {
  result: AnalysisResult;
  lang: Lang;
};

export default function ResultsCard({ result, lang }: Props) {
  const t = getT(lang === "auto" ? "uk" : lang);
  const scoreColor =
    result.score >= 70
      ? "text-cyan-400"
      : result.score >= 40
      ? "text-yellow-400"
      : "text-red-400";

  return (
    <div className="space-y-6">

      {/* Скор */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-8 text-center space-y-2">
        <p className="text-slate-400 text-xs uppercase tracking-widest">{t.score}</p>
        <p className={`text-8xl font-bold ${scoreColor}`}>{result.score}</p>
        <p className="text-slate-500 text-sm">{t.outOf}</p>
      </div>

      {/* Сильні сторони */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-3">
        <h3 className="font-semibold text-emerald-400">{t.strengths}</h3>
        <ul className="space-y-2">
          {result.strengths.map((item, i) => (
            <li key={i} className="bg-emerald-950/40 border border-emerald-900/50 rounded-lg px-4 py-3 text-sm text-slate-300">
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Слабкі сторони */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-3">
        <h3 className="font-semibold text-red-400">{t.weaknesses}</h3>
        <ul className="space-y-2">
          {result.weaknesses.map((item, i) => (
            <li key={i} className="bg-red-950/40 border border-red-900/50 rounded-lg px-4 py-3 text-sm text-slate-300">
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Поради */}
      <div className="bg-slate-800 border border-slate-700 rounded-xl p-6 space-y-3">
        <h3 className="font-semibold text-cyan-400">{t.tips}</h3>
        <ul className="space-y-2">
          {result.tips.map((item, i) => (
            <li key={i} className="bg-cyan-950/40 border border-cyan-900/50 rounded-lg px-4 py-3 text-sm text-slate-300">
              {item}
            </li>
          ))}
        </ul>
      </div>

      {/* Кнопка reset */}
      
      <button
        onClick={() => window.location.reload()}
        className="w-full py-3 rounded-xl border border-slate-700 text-slate-400 text-sm hover:border-cyan-500 hover:text-cyan-400 transition-colors"
      >
         {t.resetBtn}
      </button>

    </div>
  );
}