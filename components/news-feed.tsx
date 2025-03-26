"use client"

import { useState, useEffect } from "react"
import CreatePost from "@/components/create-post"
import Post, { type PostProps } from "@/components/post"
import { getFilteredPosts, addPost } from "@/lib/shared-state"

export default function NewsFeed() {
  // State to manage posts
  const [filteredPosts, setFilteredPosts] = useState<PostProps[]>([])

  // Effect to load posts from global state
  useEffect(() => {
    setFilteredPosts(getFilteredPosts())
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

