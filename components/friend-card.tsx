"use client"

import { useState } from "react"
import { SimpleButton } from "./simple-button"

interface FriendCardProps {
  name: string
  mutualFriends: number
}

export function FriendCard({ name, mutualFriends }: FriendCardProps) {
  const [isFriend, setIsFriend] = useState(false)

  return (
    <div className="p-3 border rounded-md">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-gray-600">{mutualFriends} mutual friends</p>
        </div>
      </div>
      <div className="mt-3">
        <SimpleButton variant={isFriend ? "outline" : "default"} onClick={() => setIsFriend(!isFriend)}>
          {isFriend ? "Friends ✓" : "Add Friend"}
        </SimpleButton>
      </div>
    </div>
  )
}

