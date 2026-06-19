"use client";

import { Heart, MessageCircle, Repeat2, Share } from "lucide-react";

interface LinkedInPreviewProps {
  content: string;
  characterCount: number;
  estimatedReach: number;
}

export default function LinkedInPreview({
  content,
  characterCount,
  estimatedReach,
}: LinkedInPreviewProps) {
  return (
    <div className="flex flex-col">
      {/* LinkedIn Post Preview */}
      <div className="bg-white rounded-lg border border-neutral-300 shadow-sm">
        {/* Header */}
        <div className="p-4 border-b border-neutral-200">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center text-white font-bold">
              Y
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm text-ink">Your Name</p>
              <p className="text-xs text-neutral-600">Just now</p>
            </div>
            <button className="text-neutral-400 hover:text-neutral-600">
              ⋯
            </button>
          </div>
        </div>

        {/* Post Content */}
        <div className="p-4">
          <p className="text-sm text-ink leading-relaxed whitespace-pre-wrap">
            {content || "Your LinkedIn post will appear here..."}
          </p>
        </div>

        {/* Stats */}
        <div className="px-4 py-3 border-t border-neutral-200">
          <div className="flex gap-6 text-xs text-neutral-600">
            <button className="hover:text-blue-600">
              👍 {estimatedReach > 0 ? Math.min(estimatedReach, 999) : 0} likes
            </button>
            <button className="hover:text-blue-600">💬 Comments</button>
            <button className="hover:text-blue-600">↗ Shares</button>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="px-4 py-3 border-t border-neutral-200 flex gap-4">
          <button className="flex-1 flex items-center justify-center gap-2 text-neutral-600 hover:text-blue-600 py-2 rounded-lg hover:bg-neutral-50 transition-colors text-sm font-medium">
            <Heart className="h-4 w-4" />
            Like
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 text-neutral-600 hover:text-blue-600 py-2 rounded-lg hover:bg-neutral-50 transition-colors text-sm font-medium">
            <MessageCircle className="h-4 w-4" />
            Comment
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 text-neutral-600 hover:text-blue-600 py-2 rounded-lg hover:bg-neutral-50 transition-colors text-sm font-medium">
            <Repeat2 className="h-4 w-4" />
            Repost
          </button>
          <button className="flex-1 flex items-center justify-center gap-2 text-neutral-600 hover:text-blue-600 py-2 rounded-lg hover:bg-neutral-50 transition-colors text-sm font-medium">
            <Share className="h-4 w-4" />
            Share
          </button>
        </div>
      </div>

      {/* Stats */}
      <div className="mt-6 space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-xs font-semibold text-blue-900 uppercase tracking-wider">Character Count</p>
          <p className="text-2xl font-bold text-blue-600 mt-1">{characterCount}</p>
          <p className="text-xs text-blue-700 mt-1">LinkedIn max: 3000 characters</p>
        </div>

        <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
          <p className="text-xs font-semibold text-purple-900 uppercase tracking-wider">Estimated Reach</p>
          <p className="text-2xl font-bold text-purple-600 mt-1">~{estimatedReach}</p>
          <p className="text-xs text-purple-700 mt-1">Based on content quality & engagement</p>
        </div>
      </div>
    </div>
  );
}
