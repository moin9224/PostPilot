import { GoogleGenerativeAI } from "@google/generative-ai";

interface ConvertedPost {
  content: string;
  hashtags: string[];
  variations: string[];
  estimatedReach: number;
}

async function fetchURLContent(url: string): Promise<string> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
      timeout: 5000,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const html = await response.text();

    // Extract main content
    let content = html
      .replace(/<script[^>]*>.*?<\/script>/gi, "")
      .replace(/<style[^>]*>.*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    return content.substring(0, 3000);
  } catch (error) {
    throw new Error(`Cannot fetch URL: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
}

export async function convertURLToLinkedInPost(
  url: string,
  apiKey: string
): Promise<ConvertedPost> {
  // Validate URL
  try {
    new URL(url);
  } catch {
    throw new Error("Invalid URL format");
  }

  // Fetch content
  const content = await fetchURLContent(url);

  if (!content || content.length < 50) {
    throw new Error("Could not extract enough content from URL");
  }

  // Use Gemini to convert
  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `Convert this web content into a LinkedIn post.

Content: ${content.substring(0, 2000)}

Create ONLY the exact format below (no extra text):

[POST]
<LinkedIn post 250-500 chars, hook + insight + CTA, no emojis>
[/POST]

[VAR1]
<Different angle 250-500 chars>
[/VAR1]

[VAR2]
<Another angle 250-500 chars>
[/VAR2]

[TAGS]
#hashtag1 #hashtag2 #hashtag3 #hashtag4 #hashtag5 #hashtag6 #hashtag7
[/TAGS]`;

  try {
    const result = await model.generateContent(prompt);
    const text = result.response.text();

    const post = text.match(/\[POST\]([\s\S]*?)\[\/POST\]/)?.[1]?.trim() || "";
    const var1 = text.match(/\[VAR1\]([\s\S]*?)\[\/VAR1\]/)?.[1]?.trim() || "";
    const var2 = text.match(/\[VAR2\]([\s\S]*?)\[\/VAR2\]/)?.[1]?.trim() || "";
    const tagsText = text.match(/\[TAGS\]([\s\S]*?)\[\/TAGS\]/)?.[1]?.trim() || "";

    const tags = tagsText
      .split(/\s+/)
      .filter((t) => t.startsWith("#"))
      .slice(0, 7);

    if (!post) {
      throw new Error("Failed to generate post content");
    }

    return {
      content: post,
      hashtags: tags,
      variations: [var1, var2].filter((v) => v.length > 0),
      estimatedReach: Math.floor(500 + post.length * 0.7),
    };
  } catch (error) {
    console.error("Gemini error:", error);
    throw new Error("AI generation failed. Make sure you have a Gemini API key in settings.");
  }
}
