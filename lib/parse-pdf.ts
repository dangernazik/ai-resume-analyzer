/* eslint-disable @typescript-eslint/no-require-imports */
const pdf = require("pdf-parse");

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const data = await pdf(buffer);
  const text = data.text.trim();

  if (!text || text.length < 50) {
    throw new Error("Не вдалось прочитати текст з PDF. Спробуй інший файл.");
  }

  return text.slice(0, 4000);
}