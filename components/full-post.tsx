"use client"

import { useState } from "react"
import { CommentSection } from "./comment-section"

interface Comment {
  id: number
  author: string
  text: string
  time: string
}

interface FullPostProps {
  author: string
  content: string
  timestamp: string
  initialLikes?: number
  initialComments?: Comment[]
}

export function FullPost({ author, content, timestamp, initialLikes = 0, initialComments = [] }: FullPostProps) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(initialLikes)
  const [showComments, setShowComments] = useState(false)

  const handleLike = () => {
    setLiked(!liked)
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1))
  }

  return (
    <div className="p-4 border rounded-md bg-white">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0"></div>
        <div className="flex-1">
          <p className="font-medium">{author}</p>
          <p className="text-sm text-gray-500">{timestamp}</p>
          <p className="mt-2">{content}</p>

          <div className="flex items-center gap-4 mt-3 pt-3 border-t">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 ${liked ? "text-blue-600" : "text-gray-600"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill={liked ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                />
              </svg>
              <span>{liked ? "Liked" : "Like"}</span>
              {likeCount > 0 && <span>({likeCount})</span>}
            </button>

            <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1 text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>Comment</span>
              {initialComments.length > 0 && <span>({initialComments.length})</span>}
            </button>

            <button className="flex items-center gap-1 text-gray-600">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              <span>Share</span>
            </button>
          </div>

          {showComments && <CommentSection initialComments={initialComments} />}
        </div>
      </div>
    </div>
  )
}

