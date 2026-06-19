"use client";

import LinkedInPreview from "./LinkedInPreview";
import GenerationForm from "./GenerationForm";

interface TwoColumnLayoutProps {
  // Form props
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

  // Preview props
  content: string;
  characterCount: number;
  estimatedReach: number;
}

export default function TwoColumnLayout({
  // Form
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

  // Preview
  content,
  characterCount,
  estimatedReach,
}: TwoColumnLayoutProps) {
  return (
    <div className="min-h-screen bg-neutral-50 py-8">
      <div className="mx-auto max-w-7xl px-4">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-ink">Create LinkedIn Post</h1>
          <p className="text-neutral-600 mt-1">
            Generate engaging posts with AI and see a live preview
          </p>
        </div>

        {/* 2-Column Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Form (1 column) */}
          <div className="lg:col-span-1">
            <div className="sticky top-4">
              <div className="bg-white rounded-lg border border-neutral-300 shadow-sm p-6">
                <h2 className="text-lg font-bold text-ink mb-6">Your Post</h2>
                <GenerationForm
                  topic={topic}
                  setTopic={setTopic}
                  tone={tone}
                  setTone={setTone}
                  industry={industry}
                  setIndustry={setIndustry}
                  audience={audience}
                  setAudience={setAudience}
                  style={style}
                  setStyle={setStyle}
                  loading={loading}
                  onGenerate={onGenerate}
                />
              </div>
            </div>
          </div>

          {/* Right Column - Preview (2 columns) */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg border border-neutral-300 shadow-sm p-6">
              <h2 className="text-lg font-bold text-ink mb-6">LinkedIn Preview</h2>
              <LinkedInPreview
                content={content}
                characterCount={characterCount}
                estimatedReach={estimatedReach}
              />
            </div>
          </div>
        </div>

        {/* Post Actions */}
        {content && (
          <div className="mt-8 bg-white rounded-lg border border-neutral-300 shadow-sm p-6">
            <h3 className="text-lg font-bold text-ink mb-4">Actions</h3>
            <div className="flex gap-3 flex-wrap">
              <button className="px-6 py-2 rounded-lg bg-blue-600 hover:bg-blue-700 text-white font-medium text-sm transition-colors">
                📋 Copy to Clipboard
              </button>
              <button className="px-6 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-ink font-medium text-sm transition-colors border border-neutral-300">
                📅 Schedule Post
              </button>
              <button className="px-6 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-ink font-medium text-sm transition-colors border border-neutral-300">
                ✨ Generate Variation
              </button>
              <button className="px-6 py-2 rounded-lg bg-neutral-100 hover:bg-neutral-200 text-ink font-medium text-sm transition-colors border border-neutral-300">
                🖼️ Add Image
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
