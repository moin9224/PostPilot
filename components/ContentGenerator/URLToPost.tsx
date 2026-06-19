"use client";

import { useState } from "react";
import { Link2, Sparkles, Copy, ChevronDown } from "lucide-react";

interface URLToPostProps {
  onPostGenerated?: (content: string, hashtags: string[]) => void;
}

export default function URLToPost({ onPostGenerated }: URLToPostProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<{
    content: string;
    variations: string[];
    hashtags: string[];
    estimatedReach: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [showVariations, setShowVariations] = useState(false);
  const [selectedVariation, setSelectedVariation] = useState<string | null>(null);

  const handleConvert = async () => {
    if (!url.trim()) {
      setError("Please enter a valid URL");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const response = await fetch("/api/url-to-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to convert URL");
      }

      setResult({
        content: data.content,
        variations: data.variations || [],
        hashtags: data.hashtags || [],
        estimatedReach: data.estimatedReach || 500,
      });

      onPostGenerated?.(data.content, data.hashtags || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to convert URL");
    } finally {
      setLoading(false);
    }
  };

  const handleSelectVariation = (variation: string) => {
    setSelectedVariation(variation);
    onPostGenerated?.(variation, result?.hashtags || []);
  };

  const handleCopyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-semibold text-ink mb-2">
          🔗 Paste any URL
        </label>
        <div className="flex gap-2">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://example.com/article..."
            className="flex-1 px-4 py-3 rounded-lg border border-neutral-300 bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            disabled={loading}
          />
          <button
            onClick={handleConvert}
            disabled={loading || !url.trim()}
            className="px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center gap-2 whitespace-nowrap"
          >
            <Sparkles className="h-4 w-4" />
            {loading ? "Converting..." : "Convert"}
          </button>
        </div>
      </div>

      {error && (
        <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
          {error}
        </div>
      )}

      {result && (
        <div className="space-y-4">
          {/* Main Post */}
          <div className="p-4 rounded-lg bg-blue-50 border border-blue-200">
            <p className="text-xs font-semibold text-blue-900 uppercase tracking-wider mb-2">
              Generated Post
            </p>
            <p className="text-sm text-ink mb-3 leading-relaxed">
              {selectedVariation || result.content}
            </p>
            <div className="flex gap-2">
              <button
                onClick={() =>
                  handleCopyToClipboard(selectedVariation || result.content)
                }
                className="flex items-center gap-1 text-xs text-blue-600 hover:text-blue-700 font-medium"
              >
                <Copy className="h-3 w-3" />
                Copy
              </button>
              <span className="text-xs text-blue-600">
                {(selectedVariation || result.content).length} chars
              </span>
            </div>
          </div>

          {/* Hashtags */}
          {result.hashtags.length > 0 && (
            <div className="p-4 rounded-lg bg-purple-50 border border-purple-200">
              <p className="text-xs font-semibold text-purple-900 uppercase tracking-wider mb-2">
                Suggested Hashtags
              </p>
              <div className="flex flex-wrap gap-2">
                {result.hashtags.map((tag) => (
                  <button
                    key={tag}
                    onClick={() =>
                      handleCopyToClipboard(
                        `${selectedVariation || result.content} ${tag}`
                      )
                    }
                    className="px-3 py-1 rounded-lg bg-purple-100 text-purple-700 text-xs font-medium hover:bg-purple-200 transition-colors"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Variations */}
          {result.variations.length > 0 && (
            <div className="space-y-2">
              <button
                onClick={() => setShowVariations(!showVariations)}
                className="w-full flex items-center justify-between p-3 rounded-lg bg-neutral-100 hover:bg-neutral-200 border border-neutral-300 transition-colors text-sm font-medium text-ink"
              >
                <span>💡 View {result.variations.length} Alternative Angles</span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    showVariations ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showVariations && (
                <div className="space-y-2">
                  {result.variations.map((variation, idx) => (
                    <button
                      key={idx}
                      onClick={() => handleSelectVariation(variation)}
                      className={`w-full p-3 rounded-lg border-2 text-left transition-colors ${
                        selectedVariation === variation
                          ? "bg-green-50 border-green-500"
                          : "bg-white border-neutral-300 hover:border-neutral-400"
                      }`}
                    >
                      <p className="text-xs font-semibold text-neutral-600 mb-1">
                        Variation {idx + 1}
                      </p>
                      <p className="text-sm text-ink">{variation}</p>
                    </button>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Stats */}
          <div className="p-3 rounded-lg bg-neutral-50 border border-neutral-200">
            <p className="text-xs font-semibold text-neutral-700 uppercase tracking-wider">
              📊 Estimated Reach: ~{result.estimatedReach} people
            </p>
          </div>
        </div>
      )}

      <div className="text-xs text-neutral-600 p-3 rounded-lg bg-blue-50 border border-blue-200">
        💡 <strong>How it works:</strong> Paste any URL and AI will extract the key insights,
        convert it to a LinkedIn post, suggest hashtags, and provide alternative angles.
      </div>
    </div>
  );
}
