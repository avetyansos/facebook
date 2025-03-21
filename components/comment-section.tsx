"use client"

import type React from "react"

import { useState } from "react"

interface Comment {
  id: number
  author: string
  text: string
  time: string
}

interface CommentSectionProps {
  initialComments: Comment[]
}

export function CommentSection({ initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now(),
      author: "You",
      text: newComment,
      time: "Just now",
    }

    setComments([...comments, comment])
    setNewComment("")
  }

  return (
    <div className="mt-4">
      <h3 className="font-medium mb-2">Comments</h3>

      <div className="space-y-3 mb-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full shrink-0"></div>
            <div className="flex-1">
              <div className="bg-gray-100 rounded-lg px-3 py-2">
                <div className="font-medium text-sm">{comment.author}</div>
                <p className="text-sm">{comment.text}</p>
              </div>
              <div className="text-xs text-gray-500 mt-1">{comment.time}</div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full shrink-0"></div>
        <div className="flex-1">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
        >
          Post
        </button>
      </form>
    </div>
  )
}

