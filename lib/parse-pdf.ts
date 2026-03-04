import { extractText } from "unpdf";

export async function extractTextFromPdf(buffer: Buffer): Promise<string> {
  const { text } = await extractText(new Uint8Array(buffer), {
    mergePages: true,
  });

  if (!text || text.length < 50) {
    throw new Error("Не вдалось прочитати текст з PDF. Спробуй інший файл.");
  }

  return text.slice(0, 4000);
}