import { GoogleGenerativeAI } from "@google/generative-ai";

interface URLContent {
  title: string;
  description: string;
  content: string;
  url: string;
}

interface ConvertedPost {
  content: string;
  hashtags: string[];
  variations: string[];
  estimatedReach: number;
}

async function fetchURLContent(url: string): Promise<URLContent> {
  try {
    const response = await fetch(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch URL: ${response.statusText}`);
    }

    const html = await response.text();

    // Extract title
    const titleMatch = html.match(/<title[^>]*>([^<]+)<\/title>/i);
    const title = titleMatch ? titleMatch[1].trim() : "";

    // Extract meta description
    const descMatch = html.match(
      /<meta\s+name="description"\s+content="([^"]*)"/i
    );
    const description = descMatch ? descMatch[1].trim() : "";

    // Extract main content (simplified - removes scripts, styles, etc)
    let content = html
      .replace(/<script[^>]*>.*?<\/script>/gi, "")
      .replace(/<style[^>]*>.*?<\/style>/gi, "")
      .replace(/<[^>]+>/g, " ")
      .replace(/\s+/g, " ")
      .trim();

    // Keep only first 2000 characters of content
    content = content.substring(0, 2000);

    return {
      title,
      description,
      content,
      url,
    };
  } catch (error) {
    throw new Error(
      `Failed to fetch content from URL: ${error instanceof Error ? error.message : "Unknown error"}`
    );
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

  // Fetch content from URL
  const urlContent = await fetchURLContent(url);

  // Use Gemini to convert to LinkedIn post
  const client = new GoogleGenerativeAI(apiKey);
  const model = client.getGenerativeModel({ model: "gemini-pro" });

  const prompt = `You are an expert LinkedIn content strategist. Convert the following content from a URL into an engaging LinkedIn post.

URL: ${urlContent.url}
Title: ${urlContent.title}
Description: ${urlContent.description}
Content: ${urlContent.content}

Create:
1. A main LinkedIn post (250-500 characters) that captures the key insight
2. 3 variations of the post (different angles/approaches)
3. 5-7 relevant hashtags

The post should:
- Start with a hook that grabs attention
- Be authentic and relatable
- Include a call-to-action or thought-provoking question
- Use line breaks for readability
- NOT include emojis

Respond in this exact format:
[MAIN_POST]
<the main post content>
[/MAIN_POST]

[VARIATION_1]
<first variation>
[/VARIATION_1]

[VARIATION_2]
<second variation>
[/VARIATION_2]

[VARIATION_3]
<third variation>
[/VARIATION_3]

[HASHTAGS]
<hashtag1> <hashtag2> <hashtag3> <hashtag4> <hashtag5>
[/HASHTAGS]`;

  try {
    const result = await model.generateContent(prompt);
    const responseText = result.response.text();

    // Parse response
    const mainPostMatch = responseText.match(
      /\[MAIN_POST\]([\s\S]*?)\[\/MAIN_POST\]/
    );
    const variation1Match = responseText.match(
      /\[VARIATION_1\]([\s\S]*?)\[\/VARIATION_1\]/
    );
    const variation2Match = responseText.match(
      /\[VARIATION_2\]([\s\S]*?)\[\/VARIATION_2\]/
    );
    const variation3Match = responseText.match(
      /\[VARIATION_3\]([\s\S]*?)\[\/VARIATION_3\]/
    );
    const hashtagsMatch = responseText.match(
      /\[HASHTAGS\]([\s\S]*?)\[\/HASHTAGS\]/
    );

    const mainPost = mainPostMatch ? mainPostMatch[1].trim() : "";
    const variations = [
      variation1Match ? variation1Match[1].trim() : "",
      variation2Match ? variation2Match[1].trim() : "",
      variation3Match ? variation3Match[1].trim() : "",
    ].filter((v) => v.length > 0);

    const hashtagsText = hashtagsMatch ? hashtagsMatch[1].trim() : "";
    const hashtags = hashtagsText
      .split(/\s+/)
      .filter((tag) => tag.startsWith("#"))
      .slice(0, 7);

    const characterCount = mainPost.length;
    const estimatedReach = Math.floor(500 + characterCount * 0.7);

    return {
      content: mainPost,
      hashtags,
      variations,
      estimatedReach,
    };
  } catch (error) {
    console.error("Gemini conversion error:", error);
    throw new Error("Failed to convert URL content to LinkedIn post");
  }
}
