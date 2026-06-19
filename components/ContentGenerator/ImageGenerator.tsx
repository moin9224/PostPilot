"use client";

import { useState } from "react";
import { Wand2, X } from "lucide-react";

interface ImageGeneratorProps {
  onImageGenerated?: (url: string) => void;
}

const STYLES = [
  { id: "realistic", label: "📸 Realistic", color: "blue" },
  { id: "artistic", label: "🎨 Artistic", color: "purple" },
  { id: "abstract", label: "✨ Abstract", color: "pink" },
  { id: "minimalist", label: "◻️ Minimalist", color: "gray" },
  { id: "professional", label: "💼 Professional", color: "slate" },
];

export default function ImageGenerator({ onImageGenerated }: ImageGeneratorProps) {
  const [prompt, setPrompt] = useState("");
  const [style, setStyle] = useState("professional");
  const [loading, setLoading] = useState(false);
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      setError("Please enter an image description");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("/api/generate-image", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt: prompt.trim(), style }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to generate image");
      }

      setGeneratedImage(data.url);
      onImageGenerated?.(data.url);
      setPrompt("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to generate image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-ink mb-2">
          🖼️ Describe your image
        </label>
        <textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="e.g., 'A professional woman presenting data on a large screen in a modern office..'"
          className="w-full px-4 py-3 rounded-lg border border-neutral-300 bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={3}
          disabled={loading}
        />
      </div>

      <div>
        <label className="block text-sm font-semibold text-ink mb-3">Style</label>
        <div className="grid grid-cols-3 gap-2">
          {STYLES.map((s) => (
            <button
              key={s.id}
              onClick={() => setStyle(s.id)}
              disabled={loading}
              className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                style === s.id
                  ? "bg-blue-600 text-white ring-2 ring-blue-400"
                  : "bg-neutral-100 text-ink hover:bg-neutral-200"
              } disabled:opacity-50`}
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {generatedImage && (
        <div className="relative rounded-lg border border-neutral-300 overflow-hidden bg-neutral-100">
          <img
            src={generatedImage}
            alt="Generated image"
            className="w-full h-auto"
          />
          <button
            onClick={() => setGeneratedImage(null)}
            className="absolute top-2 right-2 p-1.5 bg-white rounded-lg shadow hover:bg-neutral-100 transition-colors"
          >
            <X className="h-4 w-4 text-neutral-600" />
          </button>
        </div>
      )}

      <button
        onClick={handleGenerate}
        disabled={loading || !prompt.trim()}
        className="w-full px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        <Wand2 className="h-5 w-5" />
        {loading ? "Generating..." : "Generate Image"}
      </button>

      <div className="text-xs text-neutral-600 p-3 rounded-lg bg-blue-50 border border-blue-200">
        💡 <strong>Tip:</strong> Be specific about what you want. Include details like setting, style,
        and mood for better results.
      </div>
    </div>
  );
}
