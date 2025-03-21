"use client"

import { useState } from "react"

interface InteractiveFriendCardProps {
  name: string
  mutualFriends: number
}

export function InteractiveFriendCard({ name, mutualFriends }: InteractiveFriendCardProps) {
  const [isFriend, setIsFriend] = useState(false)

  return (
    <div className="p-4 border rounded-md bg-white">
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 bg-gray-200 rounded-full shrink-0"></div>
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-gray-500">{mutualFriends} mutual friends</p>
        </div>
      </div>
      <div className="mt-3">
        <button
          onClick={() => setIsFriend(!isFriend)}
          className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${
            isFriend ? "bg-gray-200 hover:bg-gray-300" : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isFriend ? "Friends ✓" : "Add Friend"}
        </button>
      </div>
    </div>
  )
}

