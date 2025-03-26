// Types
export interface FollowRequest {
  id: number
  name: string
  mutualFollowers: number
  avatar: string
  initials: string
  deleted?: boolean
}

export interface User {
  id: number
  name: string
  mutualFollowers: number
  isFollowing: boolean
  isRequested?: boolean
  isDeleted?: boolean
  avatar?: string
  username?: string
}

export interface Comment {
  id: string
  postId: string
  author: string
  text: string
  time: string
}

export interface Notification {
  id: number
  user: string
  content: string
  time: string
  read: boolean
  deleted?: boolean
}

export interface Post {
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

// Initial follow requests data - now empty since we're removing requests
const initialFollowRequests: FollowRequest[] = []

// Global users state that will be shared across components
export const globalUsers: User[] = [
  {
    id: 1,
    name: "Sarah Johnson",
    mutualFollowers: 5,
    isFollowing: true,
    isDeleted: false,
    avatar: "/placeholder.svg?height=100&width=100",
    username: "sarahj",
  },
  {
    id: 2,
    name: "Michael Brown",
    mutualFollowers: 3,
    isFollowing: true,
    isDeleted: false,
    avatar: "/placeholder.svg?height=100&width=100",
    username: "michaelb",
  },
  {
    id: 3,
    name: "Emily Smith",
    mutualFollowers: 7,
    isFollowing: true,
    isDeleted: false,
    avatar: "/placeholder.svg?height=100&width=100",
    username: "emilys",
  },
  // Add suggested profiles
  {
    id: 6,
    name: "Robert Miller",
    mutualFollowers: 4,
    isFollowing: false,
    isRequested: false,
    isDeleted: false,
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 7,
    name: "Jennifer Davis",
    mutualFollowers: 2,
    isFollowing: false,
    isRequested: false,
    isDeleted: false,
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 8,
    name: "William Jones",
    mutualFollowers: 6,
    isFollowing: false,
    isRequested: false,
    isDeleted: false,
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 9,
    name: "Alex Johnson",
    mutualFollowers: 4,
    isFollowing: true,
    isDeleted: false,
    avatar: "/placeholder.svg?height=100&width=100",
    username: "alexj",
  },
  {
    id: 10,
    name: "Tech Innovations",
    mutualFollowers: 0,
    isFollowing: false,
    isDeleted: false,
    avatar: "/placeholder.svg?height=100&width=100",
    username: "techinnovations",
  },
]

// Additional global suggestions that will be shared across components
export const globalSuggestions: User[] = [
  {
    id: 201,
    name: "Sophia Williams",
    mutualFollowers: 5,
    isFollowing: false,
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 202,
    name: "David Miller",
    mutualFollowers: 2,
    isFollowing: false,
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 203,
    name: "Olivia Martinez",
    mutualFollowers: 4,
    isFollowing: false,
    avatar: "/placeholder.svg?height=100&width=100",
  },
  {
    id: 204,
    name: "James Wilson",
    mutualFollowers: 1,
    isFollowing: false,
    avatar: "/placeholder.svg?height=100&width=100",
  },
]

// Global posts state
export const globalPosts: Post[] = [
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

// Global comments state
export const globalComments: Record<string, Comment[]> = {
  "1": [
    {
      id: "comment1-1",
      postId: "1",
      author: "Emily Smith",
      text: "Great job on your run! I need to get back into my routine.",
      time: "2h",
    },
    {
      id: "comment1-2",
      postId: "1",
      author: "Michael Brown",
      text: "Morning runs are the best! Keep it up!",
      time: "1h",
    },
  ],
  "2": [
    {
      id: "comment2-1",
      postId: "2",
      author: "Sarah Johnson",
      text: "Can't wait to see what you're launching!",
      time: "4h",
    },
    {
      id: "comment2-2",
      postId: "2",
      author: "Alex Johnson",
      text: "This sounds exciting! Will there be a live stream of the announcement?",
      time: "3h",
    },
  ],
  "3": [
    {
      id: "comment3-1",
      postId: "3",
      author: "Emily Smith",
      text: "Japan is on my bucket list! Did you visit Tokyo?",
      time: "20h",
    },
    {
      id: "comment3-2",
      postId: "3",
      author: "Michael Brown",
      text: "The cherry blossoms are amazing! I went there last spring too.",
      time: "18h",
    },
  ],
  profile1: [
    {
      id: "profile1-1",
      postId: "profile1",
      author: "Sarah Johnson",
      text: "Looking forward to hearing more about this project!",
      time: "1d",
    },
  ],
  profile2: [
    {
      id: "profile2-1",
      postId: "profile2",
      author: "Emily Smith",
      text: "Beautiful view! Where was this taken?",
      time: "5d",
    },
  ],
}

// Global notifications state
export const globalNotifications: Notification[] = [
  {
    id: 1,
    user: "Sarah Johnson",
    content: "liked your post.",
    time: "1 hour ago",
    read: false,
  },
  {
    id: 2,
    user: "Michael Brown",
    content: 'commented on your photo: "Great shot!"',
    time: "2 hours ago",
    read: false,
  },
  {
    id: 3,
    user: "Emily Smith",
    content: "sent you a friend request.",
    time: "3 hours ago",
    read: false,
  },
  {
    id: 4,
    user: "David Wilson",
    content: "shared your post.",
    time: "4 hours ago",
    read: true,
  },
  {
    id: 5,
    user: "Jessica Taylor",
    content: "mentioned you in a comment.",
    time: "5 hours ago",
    read: true,
  },
]

// Helper function to check if a user is being followed
export function isUserFollowed(name: string): boolean {
  // Check by exact name
  const followedByName = globalUsers.some((user) => user.name.toLowerCase() === name.toLowerCase() && user.isFollowing)

  if (followedByName) return true

  // Check by username
  const followedByUsername = globalUsers.some(
    (user) => user.username && user.username.toLowerCase() === name.toLowerCase() && user.isFollowing,
  )

  return followedByUsername
}

// Helper function to follow a user
export function followUser(user: User): void {
  // Check if user already exists in globalUsers by name
  const existingUserByName = globalUsers.find((u) => u.name.toLowerCase() === user.name.toLowerCase())

  // Check if user already exists in globalUsers by username
  const existingUserByUsername = user.username
    ? globalUsers.find((u) => u.username && u.username.toLowerCase() === user.username.toLowerCase())
    : null

  const existingUser = existingUserByName || existingUserByUsername

  if (existingUser) {
    // Update existing user
    const index = globalUsers.findIndex((u) => u.id === existingUser.id)
    globalUsers[index] = { ...globalUsers[index], isFollowing: true }
  } else {
    // Add new user to global users
    globalUsers.push({
      ...user,
      isFollowing: true,
    })
  }

  // Update in suggestions if present
  const suggestionIndex = globalSuggestions.findIndex((s) => s.name.toLowerCase() === user.name.toLowerCase())

  if (suggestionIndex !== -1) {
    globalSuggestions[suggestionIndex] = {
      ...globalSuggestions[suggestionIndex],
      isFollowing: true,
    }
  }
}

// Helper function to unfollow a user
export function unfollowUser(name: string): void {
  // Try to find by name
  let index = globalUsers.findIndex((u) => u.name.toLowerCase() === name.toLowerCase())

  // If not found by name, try by username
  if (index === -1) {
    index = globalUsers.findIndex((u) => u.username && u.username.toLowerCase() === name.toLowerCase())
  }

  if (index !== -1) {
    globalUsers[index] = { ...globalUsers[index], isFollowing: false }
  }

  // Update in suggestions if present
  const suggestionIndex = globalSuggestions.findIndex((s) => s.name.toLowerCase() === name.toLowerCase())

  if (suggestionIndex !== -1) {
    globalSuggestions[suggestionIndex] = {
      ...globalSuggestions[suggestionIndex],
      isFollowing: false,
    }
  }
}

// Helper functions for posts
export function addPost(content: string): Post {
  const newPost: Post = {
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

  // Add the new post to the beginning of the global posts array
  globalPosts.unshift(newPost)

  return newPost
}

export function getFilteredPosts(): Post[] {
  // Filter posts to only show those from followed users
  return globalPosts.filter((post) => {
    // Always include the current user's posts (johndoe)
    if (post.author.username === "johndoe") return true

    // Check if the post author is being followed
    return isUserFollowed(post.author.name) || (post.author.username && isUserFollowed(post.author.username))
  })
}

export function getUserPosts(username: string): Post[] {
  return globalPosts.filter((post) => post.author.username === username)
}

// Helper functions for comments
export function addComment(postId: string, text: string): void {
  const newComment = {
    id: `comment-${Date.now()}`,
    postId,
    author: "John Doe",
    text,
    time: "Just now",
  }

  if (!globalComments[postId]) {
    globalComments[postId] = []
  }

  // Add new comment to the beginning of the array
  globalComments[postId] = [newComment, ...globalComments[postId]]

  // Update comment count in the post
  const postIndex = globalPosts.findIndex((p) => p.id === postId)
  if (postIndex !== -1) {
    globalPosts[postIndex].comments += 1
  }
}

export function getComments(postId: string): Comment[] {
  return globalComments[postId] || []
}

// Helper functions for notifications
export function markNotificationAsRead(id: number): void {
  const index = globalNotifications.findIndex((n) => n.id === id)
  if (index !== -1) {
    globalNotifications[index] = { ...globalNotifications[index], read: true }
  }
}

export function removeNotification(id: number): void {
  const index = globalNotifications.findIndex((n) => n.id === id)
  if (index !== -1) {
    globalNotifications[index] = { ...globalNotifications[index], deleted: true }
  }
}

export function markAllNotificationsAsRead(): void {
  globalNotifications.forEach((notification, index) => {
    globalNotifications[index] = { ...notification, read: true }
  })
}

export function getActiveNotifications(): Notification[] {
  return globalNotifications.filter((notification) => !notification.deleted)
}

// Helper function to toggle like on a post
export function togglePostLike(postId: string): boolean {
  const postIndex = globalPosts.findIndex((p) => p.id === postId)
  if (postIndex !== -1) {
    const post = globalPosts[postIndex]
    const newLikedState = !post.isLiked

    // Update like count
    const newLikeCount = newLikedState ? post.likes + 1 : post.likes - 1

    // Update post in global state
    globalPosts[postIndex] = {
      ...post,
      isLiked: newLikedState,
      likes: newLikeCount,
    }

    return newLikedState
  }
  return false
}

// Helper function to get a post's like status
export function getPostLikeStatus(postId: string): { isLiked: boolean; likeCount: number } {
  const post = globalPosts.find((p) => p.id === postId)
  if (post) {
    return {
      isLiked: post.isLiked || false,
      likeCount: post.likes,
    }
  }
  return { isLiked: false, likeCount: 0 }
}

// Shared state
export const sharedState = {
  followRequests: [...initialFollowRequests],

  // Methods to update the state
  updateFollowRequests(requests: FollowRequest[]) {
    this.followRequests = requests
  },

  getActiveRequests() {
    return this.followRequests.filter((request) => !request.deleted)
  },
}

