import CreatePost from "@/components/create-post"
import Post, { type PostProps } from "@/components/post"

interface NewsFeedProps {
  filter?: "friends" | "groups"
}

export default function NewsFeed({ filter }: NewsFeedProps) {
  // This would typically come from an API
  const posts: PostProps[] = [
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

  // Filter posts based on the selected tab
  const filteredPosts =
    filter === "friends"
      ? posts.filter((post) => post.author.username === "alexj" || post.author.username === "sarahj")
      : filter === "groups"
        ? posts.filter((post) => post.author.username === "techinnovations")
        : posts

  return (
    <div>
      <CreatePost />

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

