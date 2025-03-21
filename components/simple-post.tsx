import { ClientWrapper } from "./client-wrapper"
import { LikeButton } from "./like-button"

interface SimplePostProps {
  author: string
  content: string
  timestamp: string
}

export function SimplePost({ author, content, timestamp }: SimplePostProps) {
  return (
    <div className="p-3 border rounded-md">
      <p className="font-medium">{author}</p>
      <p className="text-sm text-gray-600">{timestamp}</p>
      <p className="mt-2">{content}</p>
      <div className="mt-3">
        <ClientWrapper>
          <LikeButton />
        </ClientWrapper>
      </div>
    </div>
  )
}

