import { GoogleGenerativeAI } from "@google/generative-ai";

interface GenerationParams {
  topic: string;
  tone: "professional" | "casual" | "inspiring" | "educational";
  industry: string;
  audience: string;
  style: "short" | "medium" | "long";
  format?: string;
}

interface GeneratedPost {
  content: string;
  hashtags: string[];
  characterCount: number;
  estimatedReach: number;
}

const TONE_DESCRIPTIONS: Record<string, string> = {
  professional: "professional and business-focused",
  casual: "casual and conversational",
  inspiring: "motivational and inspiring",
  educational: "informative and educational",
};

const STYLE_LENGTHS: Record<string, number> = {
  short: 250,
  medium: 500,
  long: 1000,
};

export async function generateLinkedInPostWithGemini(
  params: GenerationParams,
  apiKey: string
): Promise<GeneratedPost> {
  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `You are an expert LinkedIn content creator. Generate a LinkedIn post about the following:

Topic: ${params.topic}
Tone: ${TONE_DESCRIPTIONS[params.tone]}
Industry: ${params.industry}
Target Audience: ${params.audience}
Length: ${STYLE_LENGTHS[params.style]} characters
${params.format ? `Format: ${params.format}` : ""}

Create an engaging LinkedIn post that:
1. Starts with a hook to grab attention
2. Is authentic and relatable
3. Includes a clear call-to-action or thought-provoking question
4. Uses line breaks for readability
5. Includes 3-5 relevant hashtags

Respond ONLY with the post content and hashtags in this format:
[POST]
<the post content here>
[/POST]
[HASHTAGS]
<hashtag1> <hashtag2> <hashtag3>
[/HASHTAGS]`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    const postMatch = responseText.match(/\[POST\]([\s\S]*?)\[\/POST\]/);
    const hashtagsMatch = responseText.match(/\[HASHTAGS\]([\s\S]*?)\[\/HASHTAGS\]/);

    const content = postMatch ? postMatch[1].trim() : responseText;
    const hashtagsText = hashtagsMatch ? hashtagsMatch[1].trim() : "";
    const hashtags = hashtagsText
      .split(/\s+/)
      .filter((tag) => tag.startsWith("#"))
      .slice(0, 5);

    const characterCount = content.length;
    const estimatedReach = Math.floor(500 + characterCount * 0.5);

    return {
      content,
      hashtags,
      characterCount,
      estimatedReach,
    };
  } catch (error) {
    console.error("Gemini generation error:", error);
    throw new Error("Failed to generate content with Gemini");
  }
}
