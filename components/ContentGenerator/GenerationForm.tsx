"use client";

import { Sparkles } from "lucide-react";

interface GenerationFormProps {
  topic: string;
  setTopic: (value: string) => void;
  tone: string;
  setTone: (value: string) => void;
  industry: string;
  setIndustry: (value: string) => void;
  audience: string;
  setAudience: (value: string) => void;
  style: string;
  setStyle: (value: string) => void;
  loading: boolean;
  onGenerate: () => void;
}

const TONES = ["Professional", "Casual", "Inspiring", "Educational"];
const INDUSTRIES = [
  "Technology",
  "Finance",
  "Marketing",
  "Startup",
  "Education",
  "Healthcare",
  "Sales",
  "Other",
];
const AUDIENCES = [
  "Founders",
  "Professionals",
  "Students",
  "Job Seekers",
  "Entrepreneurs",
  "Investors",
];
const STYLES = ["Short (250 chars)", "Medium (500 chars)", "Long (1000 chars)"];

export default function GenerationForm({
  topic,
  setTopic,
  tone,
  setTone,
  industry,
  setIndustry,
  audience,
  setAudience,
  style,
  setStyle,
  loading,
  onGenerate,
}: GenerationFormProps) {
  return (
    <div className="flex flex-col gap-6">
      <div>
        <label className="block text-sm font-semibold text-ink mb-2">
          Post Topic *
        </label>
        <textarea
          value={topic}
          onChange={(e) => setTopic(e.target.value)}
          placeholder="What do you want to write about? Be specific..."
          className="w-full px-4 py-3 rounded-lg border border-neutral-300 bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent resize-none"
          rows={4}
        />
        <p className="text-xs text-neutral-500 mt-1">
          {topic.length}/500 characters
        </p>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-ink mb-2">
            Tone
          </label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {TONES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink mb-2">
            Style
          </label>
          <select
            value={style}
            onChange={(e) => setStyle(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            {STYLES.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-semibold text-ink mb-2">
            Industry
          </label>
          <select
            value={industry}
            onChange={(e) => setIndustry(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select industry...</option>
            {INDUSTRIES.map((ind) => (
              <option key={ind} value={ind}>
                {ind}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-semibold text-ink mb-2">
            Audience
          </label>
          <select
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="w-full px-3 py-2 rounded-lg border border-neutral-300 bg-white text-ink text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="">Select audience...</option>
            {AUDIENCES.map((aud) => (
              <option key={aud} value={aud}>
                {aud}
              </option>
            ))}
          </select>
        </div>
      </div>

      <button
        onClick={onGenerate}
        disabled={loading || !topic.trim() || !industry || !audience}
        className="w-full px-4 py-3 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-semibold text-sm disabled:opacity-50 disabled:cursor-not-allowed transition-colors flex items-center justify-center gap-2"
      >
        <Sparkles className="h-5 w-5" />
        {loading ? "Generating..." : "Generate Post"}
      </button>

      <div className="bg-neutral-50 border border-neutral-200 rounded-lg p-4">
        <p className="text-xs font-semibold text-neutral-700 uppercase tracking-wider mb-2">
          💡 Pro Tips
        </p>
        <ul className="text-xs text-neutral-600 space-y-1">
          <li>• Be specific about your topic for better results</li>
          <li>• Match the tone to your LinkedIn audience</li>
          <li>• Use industry context for relevant insights</li>
          <li>• Longer posts perform better with engagement hooks</li>
        </ul>
      </div>
    </div>
  );
}
