import Anthropic from "@anthropic-ai/sdk";
import { ApiError } from "./api";

// We use Claude (claude-opus-4-8) — the most capable model — for content
// generation. The env var is ANTHROPIC_API_KEY (the Anthropic SDK reads it
// automatically; we construct lazily so a missing key fails per-request with a
// clean error rather than crashing the whole server at import time).
export const CLAUDE_MODEL = "claude-opus-4-8";

let client: Anthropic | null = null;

function getClient(): Anthropic {
  if (!process.env.ANTHROPIC_API_KEY) {
    throw new ApiError(
      500,
      "ANTHROPIC_API_KEY is not configured on the server.",
    );
  }
  if (!client) client = new Anthropic();
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
  count: number;
}

export interface GeneratedPost {
  content: string;
  characterCount: number;
  hashtags: string[];
  estimatedReach: number;
  suggestedBestTime: string;
}

const STYLE_GUIDANCE: Record<Style, string> = {
  short: "Keep each post under 400 characters — punchy and scannable.",
  medium: "Aim for 600–900 characters with a clear hook, body, and takeaway.",
  long: "Write 1,200–1,800 characters: strong hook, structured body, CTA.",
};

// We force a single tool call whose input schema is the shape we want. This
// is the most reliable way to get structured JSON out of the model across SDK
// versions — Claude must respond with a tool_use block matching this schema.
const SUBMIT_TOOL: Anthropic.Tool = {
  name: "submit_posts",
  description: "Return the generated LinkedIn posts in structured form.",
  input_schema: {
    type: "object",
    properties: {
      posts: {
        type: "array",
        items: {
          type: "object",
          properties: {
            content: { type: "string" },
            hashtags: { type: "array", items: { type: "string" } },
            estimatedReach: { type: "integer" },
            suggestedBestTime: { type: "string" },
          },
          required: [
            "content",
            "hashtags",
            "estimatedReach",
            "suggestedBestTime",
          ],
        },
      },
    },
    required: ["posts"],
  },
};

interface ModelPost {
  content: string;
  hashtags: string[];
  estimatedReach: number;
  suggestedBestTime: string;
}

/**
 * Generate LinkedIn post variations with Claude.
 * Returns exactly `count` posts (best-effort; model may return fewer).
 */
export async function generateLinkedInPosts(
  params: GenerateParams,
): Promise<GeneratedPost[]> {
  const { topic, tone, industry, audience, style, count } = params;
  const anthropic = getClient();

  const system = [
    `You are a world-class LinkedIn content strategist for the ${industry} industry.`,
    `You write posts in a ${tone} tone aimed at ${audience}.`,
    "You understand hooks, line breaks for readability, and what drives engagement on LinkedIn.",
    STYLE_GUIDANCE[style],
    "Never use hashtags inside the body — return them separately. Avoid emojis unless the casual tone calls for it.",
  ].join(" ");

  const userPrompt = [
    `Generate ${count} distinct LinkedIn posts about: "${topic}".`,
    "Each must take a genuinely different angle (story, contrarian take, how-to, data point, lesson, etc.).",
    "For each post provide 3–5 relevant hashtags, a realistic estimated reach (integer), and a suggested best posting time (e.g. 'Tue 9:00 AM').",
  ].join(" ");

  let message: Anthropic.Message;
  try {
    // Non-streaming with a bounded max_tokens keeps us well under SDK HTTP
    // timeouts for this output size. Forcing the tool guarantees structured
    // JSON in the tool_use block (no brittle parsing of free text).
    message = await anthropic.messages.create({
      model: CLAUDE_MODEL,
      max_tokens: 8000,
      system,
      messages: [{ role: "user", content: userPrompt }],
      tools: [SUBMIT_TOOL],
      tool_choice: { type: "tool", name: SUBMIT_TOOL.name },
    });
  } catch (err) {
    if (err instanceof Anthropic.RateLimitError) {
      throw new ApiError(429, "AI service is busy — please retry shortly.");
    }
    if (err instanceof Anthropic.APIError) {
      throw new ApiError(502, `AI generation failed: ${err.message}`);
    }
    throw err;
  }

  const toolUse = message.content.find((b) => b.type === "tool_use");
  if (!toolUse || toolUse.type !== "tool_use") {
    throw new ApiError(502, "AI did not return structured posts.");
  }

  // tool_use.input is already a parsed object (the SDK parses the JSON).
  const parsed = toolUse.input as { posts?: ModelPost[] };

  return (parsed.posts ?? []).slice(0, count).map((p) => ({
    content: p.content,
    characterCount: p.content.length,
    hashtags: p.hashtags ?? [],
    estimatedReach: p.estimatedReach ?? 0,
    suggestedBestTime: p.suggestedBestTime ?? "Tue 9:00 AM",
  }));
}
