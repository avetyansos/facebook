"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { BookmarkIcon, Globe, MessageCircle, MoreHorizontal, Share2, ThumbsUp } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Textarea } from "@/components/ui/textarea"

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
  const [liked, setLiked] = useState(isLiked)
  const [likeCount, setLikeCount] = useState(likes)
  const [showComments, setShowComments] = useState(false)
  const [commentText, setCommentText] = useState("")
  const [commentsList, setCommentsList] = useState([
    { id: "comment1", name: "Emily Smith", text: "Great post! Thanks for sharing this.", time: "2h" },
    {
      id: "comment2",
      name: "Michael Brown",
      text: "I completely agree with this! Looking forward to more content like this.",
      time: "1h",
    },
  ])

  const handleLike = () => {
    setLiked(!liked)
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1))
  }

  const handleComment = (e: React.FormEvent) => {
    e.preventDefault()
    if (commentText.trim()) {
      const newComment = {
        id: `comment-${Date.now()}`,
        name: "John Doe",
        text: commentText,
        time: "Just now",
      }
      setCommentsList([...commentsList, newComment])
      setCommentText("")
    }
  }

  return (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
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

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => alert("Post saved!")}>
                <BookmarkIcon className="h-4 w-4 mr-2" />
                Save post
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => alert("Post hidden!")}>Hide post</DropdownMenuItem>
              <DropdownMenuItem onClick={() => alert("Post reported!")}>Report post</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
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
          <div className="flex gap-3">
            <button className="hover:underline" onClick={() => setShowComments(!showComments)}>
              {commentsList.length} comments
            </button>
            <button className="hover:underline">{shares} shares</button>
          </div>
        </div>

        <div className="flex justify-between w-full pt-1">
          <Button variant="ghost" className={`flex-1 gap-2 ${liked ? "text-primary" : ""}`} onClick={handleLike}>
            <ThumbsUp className="h-5 w-5" />
            <span>Like</span>
          </Button>
          <Button variant="ghost" className="flex-1 gap-2" onClick={() => setShowComments(!showComments)}>
            <MessageCircle className="h-5 w-5" />
            <span>Comment</span>
          </Button>
          <Button
            variant="ghost"
            className="flex-1 gap-2"
            onClick={() => alert("Share feature is not available in the current version.")}
          >
            <Share2 className="h-5 w-5" />
            <span>Share</span>
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
                <div className="flex justify-end mt-2">
                  <Button type="submit" size="sm" disabled={!commentText.trim()}>
                    Comment
                  </Button>
                </div>
              </form>
            </div>

            <div className="space-y-3 pt-2">
              {commentsList.map((comment) => (
                <div key={comment.id} className="flex gap-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg?height=32&width=32" alt={comment.name} />
                    <AvatarFallback>
                      {comment.name.charAt(0)}
                      {comment.name.split(" ")[1]?.charAt(0) || ""}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <div className="bg-muted rounded-lg px-3 py-2">
                      <div className="font-medium text-sm">{comment.name}</div>
                      <p className="text-sm">{comment.text}</p>
                    </div>
                    <div className="flex gap-3 text-xs text-muted-foreground mt-1 px-3">
                      <button className="font-medium hover:underline" onClick={() => alert("Comment liked!")}>
                        Like
                      </button>
                      <button
                        className="font-medium hover:underline"
                        onClick={() => alert("Reply feature is not available in the current version.")}
                      >
                        Reply
                      </button>
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

