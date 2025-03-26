"use client"

import type React from "react"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Globe, MessageCircle, ThumbsUp } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import { getComments, addComment, togglePostLike, getPostLikeStatus } from "@/lib/shared-state"

export interface PostProps {
  id: string
  author: {
    name: string
    image: string
    username: string
  }
  content: string
  image?: string
  timestamp: string
  likes: number
  comments: number
  shares: number
  isLiked?: boolean
}

export default function Post({
  id,
  author,
  content,
  image,
  timestamp,
  likes,
  comments,
  shares,
  isLiked = false,
}: PostProps) {
  // Get initial like status from global state
  const initialLikeStatus = getPostLikeStatus(id)
  const [liked, setLiked] = useState(initialLikeStatus.isLiked)
  const [likeCount, setLikeCount] = useState(initialLikeStatus.likeCount)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [commentsList, setCommentsList] = useState(getComments(id))
  const { toast } = useToast()

  // Update comments list when global state changes
  useEffect(() => {
    setCommentsList(getComments(id))
  }, [id])

  // Update like status when global state changes
  useEffect(() => {
    const likeStatus = getPostLikeStatus(id)
    setLiked(likeStatus.isLiked)
    setLikeCount(likeStatus.likeCount)
  }, [id])

  const handleLike = () => {
    // Update global state
    const newLikedState = togglePostLike(id)

    // Update local state
    const likeStatus = getPostLikeStatus(id)
    setLiked(likeStatus.isLiked)
    setLikeCount(likeStatus.likeCount)
  }

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (commentText.trim()) {
      // Add comment to global state
      addComment(id, commentText)

      // Update local state
      setCommentsList(getComments(id))
      setCommentText("")
    }
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex items-start">
          <div className="flex gap-3">
            <Link href={`/profile/${author.username}`}>
              <Avatar>
                <AvatarImage src={author.image} alt={author.name} />
                <AvatarFallback>{author.name.charAt(0)}</AvatarFallback>
              </Avatar>
            </Link>
            <div>
              <div className="font-medium">
                <Link href={`/profile/${author.username}`} className="hover:underline">
                  {author.name}
                </Link>
              </div>
              <div className="flex items-center text-xs text-muted-foreground">
                <span>{timestamp}</span>
                <span className="mx-1">·</span>
                <Globe className="h-3 w-3" />
              </div>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pb-3">
        <p className="whitespace-pre-line">{content}</p>
        {image && (
          <div className="mt-3">
            <img
              src={image || "/placeholder.svg"}
              alt="Post"
              className="rounded-md w-full object-cover max-h-[500px]"
            />
          </div>
        )}
      </CardContent>
      <CardFooter className="flex flex-col pt-0">
        <div className="flex justify-between items-center w-full text-sm text-muted-foreground py-2 border-y">
          <div className="flex items-center gap-1">
            <div className="bg-primary text-white rounded-full p-1">
              <ThumbsUp className="h-3 w-3" />
            </div>
            <span>{likeCount}</span>
          </div>
          <div>
            <button className="hover:underline" onClick={() => setShowComments(!showComments)}>
              {commentsList.length} comments
            </button>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-between w-full pt-1 gap-2">
          <Button variant="ghost" className={`flex-1 gap-2 ${liked ? "text-primary" : ""}`} onClick={handleLike}>
            <ThumbsUp className="h-5 w-5" />
            <span>Like</span>
          </Button>
          <Button variant="ghost" className="flex-1 gap-2 w-full" onClick={() => setShowComments(!showComments)}>
            <MessageCircle className="h-5 w-5" />
            <span>Comment</span>
          </Button>
        </div>

        {showComments && (
          <div className="w-full pt-3 space-y-3">
            <div className="flex gap-2">
              <Avatar className="h-8 w-8">
                <AvatarImage src="/placeholder-user.jpg" alt="User" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <form onSubmit={handleComment} className="flex-1">
                <Textarea
                  placeholder="Write a comment..."
                  className="min-h-[40px] resize-none"
                  value={commentText}
                  onChange={(e) => setCommentText(e.target.value)}
                />
                <div className="flex justify-end mt-2 w-full">
                  <Button type="submit" size="sm" disabled={!commentText.trim()} className="w-full sm:w-auto">
                    Comment
                  </Button>
                </div>
              </form>
            </div>

            <div className="space-y-3 pt-2">
              {commentsList.map((comment) => (
                <div key={comment.id} className="flex gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt={comment.author} />
                    <AvatarFallback>
                      {comment.author.charAt(0)}
                      {comment.author.split(" ")[1]?.charAt(0) || ""}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-muted rounded-lg px-3 py-2">
                      <div className="font-medium text-sm">{comment.author}</div>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                    <div className="text-xs text-muted-foreground mt-1 px-3">
                      <span>{comment.time}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </CardFooter>
    </Card>
  )
}

