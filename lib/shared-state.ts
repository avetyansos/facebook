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

