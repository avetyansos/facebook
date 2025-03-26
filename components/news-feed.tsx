"use client"

import { useState, useEffect } from "react"
import CreatePost from "@/components/create-post"
import Post, { type PostProps } from "@/components/post"
import { getFilteredPosts, addPost } from "@/lib/shared-state"

// Function to set up a refresh interval for posts
const setupPostsRefreshInterval = (callback: () => void) => {
  const intervalId = setInterval(callback, 5000) // Refresh every 5 seconds
  return () => clearInterval(intervalId) // Cleanup function
}

export default function NewsFeed() {
  // State to manage posts
  const [filteredPosts, setFilteredPosts] = useState<PostProps[]>([])

  // Effect to load posts from global state
  useEffect(() => {
    // Initial load
    setFilteredPosts(getFilteredPosts())

    // Set up refresh interval
    const cleanup = setupPostsRefreshInterval(() => {
      setFilteredPosts(getFilteredPosts())
    })

    // Clean up interval on unmount
    return cleanup
  }, [])

  // Function to add a new post
  const handleAddPost = (content: string) => {
    // Add post to global state
    const newPost = addPost(content)

    // Update local state
    setFilteredPosts(getFilteredPosts())
  }

  return (
    <div>
      <CreatePost onPostSubmit={handleAddPost} />

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

