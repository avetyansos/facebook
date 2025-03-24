"use client"

import { useState, useEffect } from "react"
import CreatePost from "@/components/create-post"
import Post, { type PostProps } from "@/components/post"
import { isUserFollowed } from "@/lib/shared-state"

export default function NewsFeed() {
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
        "Just got back from an amazing trip to Japan! The cherry blossoms were in full bloom and the food was incredible. Has anyone else visited Japan during cherry blossom season?",
      // Removed the image from Alex Johnson's post
      timestamp: "1 day ago",
      likes: 87,
      comments: 15,
      shares: 4,
      isLiked: true,
    },
    {
      id: "4",
      author: {
        name: "Emily Smith",
        image: "/placeholder.svg?height=40&width=40",
        username: "emilys",
      },
      content:
        "Just finished reading an amazing book on artificial intelligence. It's incredible how far we've come in this field! Anyone have recommendations for similar reads?",
      timestamp: "3 hours ago",
      likes: 56,
      comments: 8,
      shares: 2,
    },
    {
      id: "5",
      author: {
        name: "Michael Brown",
        image: "/placeholder.svg?height=40&width=40",
        username: "michaelb",
      },
      content:
        "Excited to share that I've just accepted a new position as Senior Developer at TechCorp! Looking forward to this new chapter in my career. #NewJob #TechCareers",
      timestamp: "1 day ago",
      likes: 112,
      comments: 24,
      shares: 5,
    },
  ]

  // State to manage posts
  const [posts, setPosts] = useState<PostProps[]>(initialPosts)
  const [filteredPosts, setFilteredPosts] = useState<PostProps[]>([])

  // Effect to filter posts based on followed users
  useEffect(() => {
    // Filter posts to only show those from followed users
    const postsFromFollowedUsers = posts.filter((post) => {
      // Always include the current user's posts (johndoe)
      if (post.author.username === "johndoe") return true

      // Check if the post author is being followed
      return isUserFollowed(post.author.name) || (post.author.username && isUserFollowed(post.author.username))
    })

    setFilteredPosts(postsFromFollowedUsers)
  }, [posts])

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
      // No image for new posts
    }

    // Add the new post to the beginning of the posts array
    setPosts([newPost, ...posts])
  }

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
        <div className="text-center py-10 text-muted-foreground">
          No posts from people you follow. Try following more accounts!
        </div>
      )}
    </div>
  )
}

