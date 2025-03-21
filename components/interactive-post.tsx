"use client"

import { useState } from "react"

interface InteractivePostProps {
  author: string
  content: string
  timestamp: string
  initialLikes?: number
}

export function InteractivePost({ author, content, timestamp, initialLikes = 0 }: InteractivePostProps) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(initialLikes)

  const handleLike = () => {
    setLiked(!liked)
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1))
  }

  return (
    <div className="p-4 border rounded-md">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0"></div>
        <div className="flex-1">
          <p className="font-medium">{author}</p>
          <p className="text-sm text-gray-500">{timestamp}</p>
          <p className="mt-2">{content}</p>

          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleLike}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                liked ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {liked ? "Liked" : "Like"}
            </button>
            {likeCount > 0 && (
              <span className="text-sm text-gray-500">
                {likeCount} {likeCount === 1 ? "like" : "likes"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

