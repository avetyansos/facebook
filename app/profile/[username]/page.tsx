"use client"

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Post from "@/components/post"
import CreatePost from "@/components/create-post"
import Navbar from "@/components/navbar"
import { useToast } from "@/hooks/use-toast"
import {
  globalUsers,
  globalSuggestions,
  isUserFollowed,
  followUser,
  unfollowUser,
  getFilteredPosts,
  addPost,
} from "@/lib/shared-state"
import type { PostProps } from "@/types"

interface ProfilePageProps {
  params: {
    username: string
  }
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { toast } = useToast()
  const username = params.username
  const [displayName, setDisplayName] = useState("")
  const [isFollowing, setIsFollowing] = useState(false)
  const [profileData, setProfileData] = useState({
    name: "",
    username: username,
    bio: "Software Developer | Photography Enthusiast | Coffee Lover",
    coverImage: "/placeholder.svg?height=300&width=1200",
    profileImage: username === "johndoe" ? "/placeholder-user.jpg" : "/placeholder.svg?height=100&width=100",
    followers: Math.floor(Math.random() * 500) + 100,
    following: Math.floor(Math.random() * 1000) + 500,
    location: "San Francisco, CA",
    workplace: "Tech Innovations Inc.",
    education: "Stanford University",
    joined: "January 2018",
  })
  const [profilePosts, setProfilePosts] = useState<PostProps[]>([])

  // Find the correct user and set their information
  useEffect(() => {
    // First, check if this is a direct match with a username in our posts
    // This handles cases like "sarahj", "alexj", etc.
    let foundUser = false

    // Check for exact username matches from our known usernames
    const knownUsernames: Record<string, string> = {
      sarahj: "Sarah Johnson",
      alexj: "Alex Johnson",
      emilys: "Emily Smith",
      michaelb: "Michael Brown",
      techinnovations: "Tech Innovations",
      johndoe: "John Doe",
    }

    if (knownUsernames[username]) {
      setDisplayName(knownUsernames[username])
      setProfileData((prev) => ({
        ...prev,
        name: knownUsernames[username],
      }))
      foundUser = true
    }

    // If not found by username, check if it matches a name in globalUsers
    if (!foundUser) {
      // Check if this username matches any of our global users (by converting to lowercase username)
      const matchedUser = globalUsers.find((user) => {
        const userUsername = user.name.toLowerCase().replace(/\s+/g, "")
        return userUsername === username.toLowerCase()
      })

      if (matchedUser) {
        setDisplayName(matchedUser.name)
        setProfileData((prev) => ({
          ...prev,
          name: matchedUser.name,
          profileImage: matchedUser.avatar || prev.profileImage,
        }))
        foundUser = true
      }
    }

    // Also check in globalSuggestions
    if (!foundUser) {
      const matchedSuggestion = globalSuggestions.find((user) => {
        const userUsername = user.name.toLowerCase().replace(/\s+/g, "")
        return userUsername === username.toLowerCase()
      })

      if (matchedSuggestion) {
        setDisplayName(matchedSuggestion.name)
        setProfileData((prev) => ({
          ...prev,
          name: matchedSuggestion.name,
          profileImage: matchedSuggestion.avatar || prev.profileImage,
        }))
        foundUser = true
      }
    }

    // If still not found, generate a display name from the username
    if (!foundUser) {
      const generatedName = username
        .replace(/([a-z])([A-Z])/g, "$1 $2") // Insert space before capital letters
        .split(/(?=[A-Z])/)
        .join(" ") // Split by capital letters and join with space
        .split(/[^a-zA-Z]/)
        .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
        .join(" ") // Capitalize first letter of each word
        .trim()

      setDisplayName(generatedName)
      setProfileData((prev) => ({
        ...prev,
        name: generatedName,
      }))
    }
  }, [username])

  // Check follow status whenever displayName changes
  useEffect(() => {
    if (displayName) {
      // Check if this user is being followed
      const followed = isUserFollowed(displayName)
      setIsFollowing(followed)
    }
  }, [displayName])

  // Periodically check follow status to keep it in sync
  useEffect(() => {
    const intervalId = setInterval(() => {
      if (displayName) {
        const followed = isUserFollowed(displayName)
        setIsFollowing(followed)
      }
    }, 1000)

    return () => clearInterval(intervalId)
  }, [displayName])

  // Load posts for this profile
  useEffect(() => {
    if (displayName) {
      // Get all posts from global state
      const allPosts = getFilteredPosts()

      // Filter posts to only show those from this profile
      const userPosts = allPosts.filter(
        (post) => post.author.username === username || post.author.name.toLowerCase() === displayName.toLowerCase(),
      )

      setProfilePosts(userPosts)
    }
  }, [displayName, username])

  const handleFollowToggle = () => {
    const newFollowingState = !isFollowing
    setIsFollowing(newFollowingState)

    if (newFollowingState) {
      // Follow user
      followUser({
        id: Date.now(), // Generate a unique ID if not already in the system
        name: displayName,
        mutualFollowers: Math.floor(Math.random() * 5) + 1,
        isFollowing: true,
        avatar: profileData.profileImage,
      })

      // Also update in globalSuggestions if present
      const suggestionIndex = globalSuggestions.findIndex((s) => s.name.toLowerCase() === displayName.toLowerCase())

      if (suggestionIndex !== -1) {
        globalSuggestions[suggestionIndex].isFollowing = true
      }

      toast({
        title: "Following",
        description: `You are now following ${displayName}`,
      })
    } else {
      // Unfollow user
      unfollowUser(displayName)

      toast({
        title: "Unfollowed",
        description: `You have unfollowed ${displayName}`,
      })
    }
  }

  const handleAddPost = (content: string) => {
    // Add post to global state
    const newPost = addPost(content)

    // Update local state to include the new post
    setProfilePosts((prev) => [newPost, ...prev])

    toast({
      title: "Post created",
      description: "Your post has been published successfully!",
    })
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="pb-10 pt-16">
        <div className="relative mb-5">
          <div className="h-[300px] w-full overflow-hidden rounded-b-lg">
            <img
              src={profileData.coverImage || "/placeholder.svg"}
              alt="Cover"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="container max-w-7xl px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-end -mt-16 md:-mt-20 relative z-10">
              <div className="relative">
                <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background">
                  <AvatarImage src={profileData.profileImage} alt={displayName} />
                  <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
                </Avatar>
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">{displayName}</h1>
                    <p className="text-muted-foreground">{profileData.followers} followers</p>
                  </div>

                  <div className="flex gap-2">
                    {username !== "johndoe" && (
                      <Button
                        className={`gap-2 ${isFollowing ? "bg-muted text-foreground hover:bg-muted/80" : ""}`}
                        onClick={handleFollowToggle}
                      >
                        {isFollowing ? "Following ✓" : "Follow"}
                      </Button>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="container max-w-7xl px-4 md:px-6">
          <div className="flex flex-col lg:flex-row gap-6">
            <div className="lg:w-1/3 space-y-6">
              <div className="bg-card rounded-lg border p-4">
                <h2 className="font-semibold text-lg mb-3">Intro</h2>
                <div className="space-y-3">
                  <p>{profileData.bio}</p>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Works at {profileData.workplace}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path d="M12 14l9-5-9-5-9 5 9 5z" />
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                      />
                    </svg>
                    <span>Studied at {profileData.education}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                      />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                      />
                    </svg>
                    <span>Lives in {profileData.location}</span>
                  </div>
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Joined {profileData.joined}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:w-2/3">
              <Tabs defaultValue="posts" className="mb-6">
                <TabsList className="w-full">
                  <TabsTrigger value="posts" className="flex-1">
                    Posts
                  </TabsTrigger>
                  <TabsTrigger value="about" className="flex-1">
                    About
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="posts" className="mt-6">
                  {username === "johndoe" && <CreatePost onPostSubmit={handleAddPost} />}

                  {profilePosts.length > 0 ? (
                    <div className="space-y-4">
                      {profilePosts.map((post) => (
                        <Post
                          key={post.id}
                          {...post}
                          // Override the image prop to remove images on profile page
                          image={undefined}
                        />
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-muted-foreground">No posts to display</div>
                  )}
                </TabsContent>
                <TabsContent value="about">
                  <div className="bg-card rounded-lg border p-6">
                    <h2 className="text-xl font-semibold mb-4">About</h2>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-2">Overview</h3>
                        <p>{profileData.bio}</p>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Work and Education</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                            <div>
                              <div>Works at {profileData.workplace}</div>
                              <div className="text-sm text-muted-foreground">2020 - Present</div>
                            </div>
                          </div>
                          <div className="flex items-center gap-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path d="M12 14l9-5-9-5-9 5 9 5z" />
                              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14z" />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998a12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                              />
                            </svg>
                            <div>
                              <div>Studied at {profileData.education}</div>
                              <div className="text-sm text-muted-foreground">2014 - 2018</div>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div>
                        <h3 className="font-medium mb-2">Contact Information</h3>
                        <div className="space-y-2">
                          <div className="flex items-center gap-3">
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              className="h-5 w-5"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                              />
                            </svg>
                            <span>{username}@example.com</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

