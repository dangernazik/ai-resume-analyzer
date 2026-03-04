import { NextRequest, NextResponse } from "next/server";
import Groq from "groq-sdk";
import { extractTextFromPdf } from "@/lib/parse-pdf";
import { AnalysisResult } from "@/types";

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY,
});

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get("file") as File | null;
    const jobDescription = formData.get("jobDescription") as string | null;
    const language = formData.get("language") as string ?? "auto";

    if (!file || !jobDescription) {
      return NextResponse.json(
        { error: "Файл і опис вакансії обов'язкові" },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);
    const resumeText = await extractTextFromPdf(buffer);

    const completion = await groq.chat.completions.create({
      model: "llama-3.3-70b-versatile",
     messages: [
  {
  role: "system",
  content: `Ти senior HR рекрутер з 10+ роками досвіду найму спеціалістів у різних сферах — IT, маркетинг, фінанси, дизайн, продажі та інші. Ти переглянув тисячі резюме і точно знаєш що робить кандидата сильним під будь-яку роль.

При аналізі резюме ти оцінюєш:
- Чіткість і структуру резюме (чи можна його прочитати за 10 секунд?)
- Конкретність досягнень (цифри, метрики, вплив — а не просто обов'язки)
- Релевантність досвіду до конкретної ролі
- Відповідність навичок і глибину експертизи
- Червоні прапорці (прогалини, розмиті описи, нерелевантна інфо)
- Загальне позиціонування кандидата під цільову роль

Ти повертаєш ТІЛЬКИ валідний JSON без жодного тексту навколо. Будь чесним і конкретним — загальні поради марні.
${
  language === "uk"
    ? "Відповідай ВИКЛЮЧНО українською мовою."
    : language === "en"
    ? "Respond EXCLUSIVELY in English."
    : "Визнач мову опису вакансії і відповідай ВИКЛЮЧНО тією ж мовою."
}`,
},
  {
    role: "user",
    content: `Проаналізуй це резюме під конкретну вакансію. Будь конкретним і чесним — посилайся на реальний вміст резюме і вакансії, не давай загальних відповідей.

РЕЗЮМЕ:
${resumeText}

ВАКАНСІЯ:
${jobDescription}

Поверни JSON у такому форматі:
{
  "score": число від 0 до 100 що відображає реальну відповідність,
  "strengths": [
    "конкретна сильна сторона з посиланням на реальний вміст резюме — від 2 до 5 пунктів залежно від якості"
  ],
  "weaknesses": [
    "конкретна прогалина або червоний прапорець з поясненням — від 2 до 6 пунктів, будь чесним навіть якщо це жорстко"
  ],
  "tips": [
    "конкретна actionable порада — не загальна, посилайся на реальні вимоги вакансії — від 3 до 6 пунктів"
  ]
}`,
  },
],
      temperature: 0.7,
    });

    const raw = completion.choices[0].message.content ?? "";
    const cleaned = raw.replace(/```json|```/g, "").trim();
    const result: AnalysisResult = JSON.parse(cleaned);

    return NextResponse.json(result);
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json(
      { error: "Щось пішло не так. Спробуй ще раз." },
      { status: 500 }
    );
  }
}