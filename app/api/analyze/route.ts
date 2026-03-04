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
          content: `Ти експерт з HR та кар'єрного розвитку.
Аналізуй резюме відносно вакансії і повертай ТІЛЬКИ валідний JSON без жодного тексту навколо.`,
        },
        {
          role: "user",
          content: `Проаналізуй це резюме відносно вакансії.

РЕЗЮМЕ:
${resumeText}

ВАКАНСІЯ:
${jobDescription}

Поверни JSON у такому форматі:
{
  "score": число від 0 до 100,
  "strengths": ["мінімум 3 сильні сторони"],
  "weaknesses": ["мінімум 3 слабкі сторони або чого не вистачає"],
  "tips": ["мінімум 3 конкретні поради як покращити резюме під цю вакансію"]
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