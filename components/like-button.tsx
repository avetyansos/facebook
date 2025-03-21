"use client"

import { useState } from "react"
import { SimpleButton } from "./simple-button"

export function LikeButton() {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(0)

  const handleClick = () => {
    setLiked(!liked)
    setCount((prev) => (liked ? prev - 1 : prev + 1))
  }

  return (
    <SimpleButton onClick={handleClick} className={liked ? "bg-blue-700 text-white" : ""}>
      {liked ? "Liked" : "Like"}
      {count > 0 && ` (${count})`}
    </SimpleButton>
  )
}

