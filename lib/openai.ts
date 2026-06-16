import OpenAI from "openai";
import { ApiError } from "./api";

export const OPENAI_MODEL = "gpt-4o-mini";

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!process.env.OPENAI_API_KEY) {
    throw new ApiError(500, "OPENAI_API_KEY is not configured on the server.");
  }
  if (!client) client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  return client;
}

export type Tone = "professional" | "casual" | "inspiring" | "educational";
export type Style = "short" | "medium" | "long";

export interface GenerateParams {
  topic: string;
  tone: Tone;
  industry: string;
  audience: string;
  style: Style;
}

export interface GeneratedPost {
  content: string;
  characterCount: number;
  hashtags: string[];
  estimatedReach: number;
  suggestedBestTime: string;
}

const STYLE_GUIDANCE: Record<Style, string> = {
  short: "Keep the post under 400 characters — punchy and scannable.",
  medium: "Aim for 600–900 characters with a clear hook, body, and takeaway.",
  long: "Write 1,200–1,800 characters: strong hook, structured body, CTA.",
};

/**
 * Generate ONE LinkedIn post using OpenAI GPT.
 * Returns a single post with content, hashtags, and metadata.
 */
export async function generateLinkedInPost(
  params: GenerateParams,
): Promise<GeneratedPost> {
  const { topic, tone, industry, audience, style } = params;
  const openai = getClient();

  const system = [
    `You are a world-class LinkedIn content strategist for the ${industry} industry.`,
    `You write posts in a ${tone} tone aimed at ${audience}.`,
    "You understand hooks, line breaks for readability, and what drives engagement on LinkedIn.",
    STYLE_GUIDANCE[style],
    "Never use hashtags inside the body — return them separately. Avoid emojis unless the casual tone calls for it.",
  ].join(" ");

  const userPrompt = [
    `Generate ONE high-quality LinkedIn post about: "${topic}".`,
    "Choose the strongest angle (story, contrarian take, how-to, data point, lesson, etc.).",
    "Provide 3-5 relevant hashtags, a realistic estimated reach (integer), and a suggested best posting time (e.g. 'Tue 9:00 AM').",
    "Return your answer as JSON in this exact format:",
    `{"content": "...", "hashtags": ["tag1", "tag2"], "estimatedReach": 5000, "suggestedBestTime": "Tue 9:00 AM"}`,
  ].join(" ");

  try {
    const completion = await openai.chat.completions.create({
      model: OPENAI_MODEL,
      messages: [
        { role: "system", content: system },
        { role: "user", content: userPrompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.8,
      max_tokens: 2000,
    });

    const responseText = completion.choices[0]?.message?.content;
    if (!responseText) {
      throw new ApiError(502, "AI returned empty response.");
    }

    const parsed = JSON.parse(responseText);

    return {
      content: parsed.content || "",
      characterCount: (parsed.content || "").length,
      hashtags: parsed.hashtags || [],
      estimatedReach: parsed.estimatedReach || 0,
      suggestedBestTime: parsed.suggestedBestTime || "Tue 9:00 AM",
    };
  } catch (err: any) {
    console.error("[openai] generation error:", {
      status: err?.status,
      code: err?.code,
      message: err?.message,
      type: err?.type,
    });
    if (err?.status === 401) {
      throw new ApiError(401, "OpenAI API key is invalid. Check Vercel environment variables.");
    }
    if (err?.status === 429) {
      const detail = err?.message || "rate limit exceeded";
      throw new ApiError(429, `OpenAI: ${detail}`);
    }
    if (err?.status === 402 || err?.code === "insufficient_quota") {
      throw new ApiError(402, "OpenAI API quota exceeded. Add credits to your OpenAI account.");
    }
    if (err instanceof ApiError) throw err;
    throw new ApiError(502, `AI generation failed: ${err?.message || "Unknown error"}`);
  }
}
