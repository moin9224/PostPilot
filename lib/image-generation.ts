interface ImageGenerationParams {
  prompt: string;
  style?: "realistic" | "artistic" | "abstract" | "minimalist" | "professional";
}

interface GeneratedImage {
  url: string;
  prompt: string;
  generatedAt: string;
}

const STYLE_PROMPTS: Record<string, string> = {
  realistic: "photorealistic, high quality, professional photography, 4k",
  artistic: "artistic painting, oil painting style, impressionist, colorful",
  abstract: "abstract art, modern art, geometric shapes, vibrant colors",
  minimalist: "minimalist design, clean, simple, white background, minimal colors",
  professional: "professional business photo, corporate style, modern, clean",
};

async function generateImageWithGemini(
  params: ImageGenerationParams
): Promise<GeneratedImage> {
  // Gemini doesn't have image generation, but we can use the prompt
  // to store and later use with external service
  const fullPrompt = `${params.prompt}. Style: ${STYLE_PROMPTS[params.style || "professional"]}`;

  return {
    url: "", // Placeholder - would be filled by actual generation service
    prompt: fullPrompt,
    generatedAt: new Date().toISOString(),
  };
}

export async function generatePostImage(
  params: ImageGenerationParams
): Promise<GeneratedImage> {
  try {
    // Try to use external image generation service
    const apiKey = process.env.REPLICATE_API_KEY;

    if (!apiKey) {
      console.warn("REPLICATE_API_KEY not set, using placeholder");
      return generateImageWithGemini(params);
    }

    const fullPrompt = `${params.prompt}. Style: ${STYLE_PROMPTS[params.style || "professional"]}`;

    // Use Replicate API for image generation (Stable Diffusion)
    const response = await fetch("https://api.replicate.com/v1/predictions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Token ${apiKey}`,
      },
      body: JSON.stringify({
        version:
          "27b93a2413e7f36cd83da926f3656280b2931564ff050bf9575f1fdf9bea1e33",
        input: {
          prompt: fullPrompt,
          num_outputs: 1,
          height: 768,
          width: 1024,
          num_inference_steps: 25,
          guidance_scale: 7.5,
        },
      }),
    });

    if (!response.ok) {
      throw new Error(`Replicate API error: ${response.statusText}`);
    }

    const data = await response.json();

    if (data.output && Array.isArray(data.output) && data.output.length > 0) {
      return {
        url: data.output[0],
        prompt: fullPrompt,
        generatedAt: new Date().toISOString(),
      };
    }

    throw new Error("No image generated");
  } catch (error) {
    console.error("Image generation error:", error);
    throw new Error("Failed to generate image. Please try again.");
  }
}

export async function generateMultipleImages(
  prompt: string,
  count: number = 3
): Promise<GeneratedImage[]> {
  const images: GeneratedImage[] = [];

  for (let i = 0; i < count; i++) {
    try {
      const style = Object.keys(STYLE_PROMPTS)[
        i % Object.keys(STYLE_PROMPTS).length
      ] as keyof typeof STYLE_PROMPTS;

      const image = await generatePostImage({
        prompt,
        style: style as any,
      });

      images.push(image);
    } catch (err) {
      console.error(`Failed to generate image ${i + 1}:`, err);
    }
  }

  return images;
}
