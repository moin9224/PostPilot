import OpenAI from "openai";
import { NextResponse } from "next/server";
import { createServerClient } from "@supabase/ssr";
import { cookies } from "next/headers";

export async function POST(request: Request) {
  try {
    const cookieStore = await cookies();
    const supabase = createServerClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      { cookies: { getAll: () => cookieStore.getAll(), setAll: () => {} } },
    );
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

    const { prompt } = await request.json();
    if (!prompt?.trim()) return NextResponse.json({ error: "Prompt is required" }, { status: 400 });

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json({ error: "Image generation is not configured." }, { status: 500 });
    }

    const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

    const enhancedPrompt = `Professional LinkedIn post image: ${prompt}. Clean, modern, business-appropriate, high quality, no text overlays.`;

    const response = await client.images.generate({
      model: "dall-e-3",
      prompt: enhancedPrompt,
      n: 1,
      size: "1024x1024",
      quality: "standard",
      response_format: "url",
    });

    const imageUrl = response.data[0]?.url;
    if (!imageUrl) return NextResponse.json({ error: "No image returned." }, { status: 500 });

    return NextResponse.json({ url: imageUrl });
  } catch (err: any) {
    const msg = err?.error?.message ?? err?.message ?? "Image generation failed.";
    return NextResponse.json({ error: msg }, { status: 500 });
  }
}
