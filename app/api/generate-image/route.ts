import { z } from "zod";
import { ok, parseBody, preflight, requireUser, route, ApiError } from "@/lib/api";
import { generatePostImage } from "@/lib/image-generation";

const Body = z.object({
  prompt: z.string().min(10, "Prompt must be at least 10 characters."),
  style: z.enum(["realistic", "artistic", "abstract", "minimalist", "professional"]).optional(),
});

export const OPTIONS = () => preflight();

export const POST = route(async (request) => {
  const { user, supabase } = await requireUser();
  const params = await parseBody(request, Body);

  try {
    const image = await generatePostImage({
      prompt: params.prompt,
      style: params.style || "professional",
    });

    // Save to database for later use
    const { data: saved, error } = await supabase
      .from("generated_images")
      .insert({
        user_id: user.id,
        prompt: image.prompt,
        image_url: image.url,
        style: params.style || "professional",
      })
      .select("id, image_url, prompt, created_at");

    if (error) {
      console.error("Database error:", error);
      throw new ApiError(500, "Failed to save image");
    }

    return ok({
      id: saved?.[0]?.id,
      url: image.url,
      prompt: image.prompt,
      style: params.style || "professional",
      createdAt: image.generatedAt,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to generate image";
    throw new ApiError(500, message);
  }
});
