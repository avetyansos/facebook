"use client"

import { useState } from "react"
import CreatePost from "@/components/create-post"
import Post, { type PostProps } from "@/components/post"

interface NewsFeedProps {
  filter?: "friends" | "groups"
}

export default function NewsFeed({ filter }: NewsFeedProps) {
  // Initial posts data
  const initialPosts: PostProps[] = [
    {
      id: "1",
      author: {
        name: "Sarah Johnson",
        image: "/placeholder.svg?height=40&width=40",
        username: "sarahj",
      },
      content:
        "Just finished a 5-mile run! 🏃‍♀️ Feeling great and ready to tackle the day. Who else is getting their workout in this morning?",
      timestamp: "2 hours ago",
      likes: 24,
      comments: 5,
      shares: 2,
    },
    {
      id: "2",
      author: {
        name: "Tech Innovations",
        image: "/placeholder.svg?height=40&width=40",
        username: "techinnovations",
      },
      content:
        "We're excited to announce our newest product line! After months of development, we're finally ready to share what we've been working on. Stay tuned for the big reveal next week! #TechInnovation #NewProduct",
      image: "/placeholder.svg?height=500&width=800",
      timestamp: "5 hours ago",
      likes: 142,
      comments: 37,
      shares: 28,
    },
    {
      id: "3",
      author: {
        name: "Alex Johnson",
        image: "/placeholder.svg?height=40&width=40",
        username: "alexj",
      },
      content:
        "Just got back from an amazing trip to Japan! The cherry blossoms were in full bloom and the food was incredible. Here's one of my favorite photos from the trip. Has anyone else visited Japan during cherry blossom season?",
      image: "/placeholder.svg?height=500&width=800",
      timestamp: "1 day ago",
      likes: 87,
      comments: 15,
      shares: 4,
      isLiked: true,
    },
  ]

  // State to manage posts
  const [posts, setPosts] = useState<PostProps[]>(initialPosts)

  // Function to add a new post
  const addPost = (content: string) => {
    const newPost: PostProps = {
      id: `post-${Date.now()}`,
      author: {
        name: "John Doe",
        image: "/placeholder-user.jpg",
        username: "johndoe",
      },
      content: content,
      timestamp: "Just now",
      likes: 0,
      comments: 0,
      shares: 0,
    }

    // Add the new post to the beginning of the posts array
    setPosts([newPost, ...posts])
  }

  // Filter posts based on the selected tab
  const filteredPosts =
    filter === "friends"
      ? posts.filter(
          (post) =>
            post.author.username === "alexj" || post.author.username === "sarahj" || post.author.username === "johndoe",
        )
      : filter === "groups"
        ? posts.filter((post) => post.author.username === "techinnovations")
        : posts

  return (
    <div>
      <CreatePost onPostSubmit={addPost} />

      {filteredPosts.length > 0 ? (
        <div className="space-y-4">
          {filteredPosts.map((post) => (
            <Post key={post.id} {...post} />
          ))}
        </div>
      ) : (
        <div className="text-center py-10 text-muted-foreground">No posts to display in this section.</div>
      )}
    </div>
  )
}

