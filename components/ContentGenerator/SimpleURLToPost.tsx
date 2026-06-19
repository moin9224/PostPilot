"use client";

import { useState } from "react";
import { Link2, Sparkles, Copy } from "lucide-react";

interface SimpleURLToPostProps {
  onPostGenerated?: (content: string) => void;
}

export default function SimpleURLToPost({ onPostGenerated }: SimpleURLToPostProps) {
  const [url, setUrl] = useState("");
  const [loading, setLoading] = useState(false);
  const [post, setPost] = useState("");
  const [variations, setVariations] = useState<string[]>([]);
  const [hashtags, setHashtags] = useState<string[]>([]);
  const [error, setError] = useState("");

  const handleConvert = async () => {
    if (!url.trim()) {
      setError("Please enter a URL");
      return;
    }

    setLoading(true);
    setError("");
    setPost("");

    try {
      const response = await fetch("/api/url-to-post", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: url.trim() }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Failed to convert");
      }

      setPost(data.content);
      setVariations(data.variations || []);
      setHashtags(data.hashtags || []);
      onPostGenerated?.(data.content);
      setUrl("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error converting URL");
    } finally {
      setLoading(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="space-y-4">
      {/* URL Input */}
      <div className="flex gap-2">
        <input
          type="url"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Paste any URL..."
          className="flex-1 px-4 py-2 rounded border border-neutral-300 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
          disabled={loading}
        />
        <button
          onClick={handleConvert}
          disabled={loading || !url.trim()}
          className="px-4 py-2 rounded bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm disabled:opacity-50 flex items-center gap-2"
        >
          <Sparkles className="h-4 w-4" />
          {loading ? "Converting..." : "Convert"}
        </button>
      </div>

      {/* Error */}
      {error && <div className="p-2 rounded bg-red-100 text-red-700 text-sm">{error}</div>}

      {/* Generated Post */}
      {post && (
        <div className="space-y-3">
          <div className="p-3 rounded bg-blue-50 border border-blue-200">
            <p className="text-xs font-semibold text-blue-900 mb-2">📝 Generated Post</p>
            <p className="text-sm text-ink">{post}</p>
            <button
              onClick={() => copyToClipboard(post)}
              className="mt-2 text-xs text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1"
            >
              <Copy className="h-3 w-3" />
              Copy
            </button>
          </div>

          {/* Hashtags */}
          {hashtags.length > 0 && (
            <div className="p-3 rounded bg-purple-50 border border-purple-200">
              <p className="text-xs font-semibold text-purple-900 mb-2">🏷️ Hashtags</p>
              <div className="flex flex-wrap gap-2">
                {hashtags.map((tag, i) => (
                  <button
                    key={i}
                    onClick={() => copyToClipboard(tag)}
                    className="px-2 py-1 text-xs bg-purple-200 text-purple-700 rounded hover:bg-purple-300 font-medium"
                  >
                    {tag}
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Variations */}
          {variations.length > 0 && (
            <div className="space-y-2">
              <p className="text-xs font-semibold text-neutral-700">💡 Variations</p>
              {variations.map((variation, i) => (
                <div key={i} className="p-3 rounded bg-neutral-50 border border-neutral-200">
                  <p className="text-xs text-neutral-600 mb-1">Variation {i + 1}</p>
                  <p className="text-sm text-ink">{variation}</p>
                  <button
                    onClick={() => copyToClipboard(variation)}
                    className="mt-2 text-xs text-neutral-600 hover:text-neutral-700 font-medium flex items-center gap-1"
                  >
                    <Copy className="h-3 w-3" />
                    Copy
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
