"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Camera, Edit } from "lucide-react"
import Post from "@/components/post"
import CreatePost from "@/components/create-post"
import Navbar from "@/components/navbar"
import { useToast } from "@/hooks/use-toast"

interface ProfilePageProps {
  params: {
    username: string
  }
}

export default function ProfilePage({ params }: ProfilePageProps) {
  const { toast } = useToast()
  // This would typically come from an API based on the username
  // For now, we'll generate user data based on the username
  const username = params.username

  // Generate a display name from the username
  const generateDisplayName = (username: string) => {
    // If username is johndoe, return "John Doe"
    if (username === "johndoe") return "John Doe"

    // Otherwise, try to format the username into a name
    return username
      .replace(/([a-z])([A-Z])/g, "$1 $2") // Insert space before capital letters
      .split(/(?=[A-Z])/)
      .join(" ") // Split by capital letters and join with space
      .split(/[^a-zA-Z]/)
      .map((word) => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase())
      .join(" ") // Capitalize first letter of each word
      .trim()
  }

  const user = {
    name: generateDisplayName(username),
    username: username,
    bio: "Software Developer | Photography Enthusiast | Coffee Lover",
    coverImage: "/placeholder.svg?height=300&width=1200",
    profileImage: username === "johndoe" ? "/placeholder-user.jpg" : "/placeholder.svg?height=100&width=100",
    friends: Math.floor(Math.random() * 500) + 100,
    followers: Math.floor(Math.random() * 1000) + 500,
    location: "San Francisco, CA",
    workplace: "Tech Innovations Inc.",
    education: "Stanford University",
    joined: "January 2018",
  }

  const [isFollowing, setIsFollowing] = useState(false)

  const handleAddPost = (content: string) => {
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
            <img src={user.coverImage || "/placeholder.svg"} alt="Cover" className="w-full h-full object-cover" />
            {username === "johndoe" && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4 bg-black/50 hover:bg-black/70 text-white rounded-full"
              >
                <Camera className="h-5 w-5" />
              </Button>
            )}
          </div>

          <div className="container max-w-7xl px-4 md:px-6">
            <div className="flex flex-col md:flex-row gap-4 items-start md:items-end -mt-16 md:-mt-20 relative z-10">
              <div className="relative">
                <Avatar className="h-32 w-32 md:h-40 md:w-40 border-4 border-background">
                  <AvatarImage src={user.profileImage} alt={user.name} />
                  <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                </Avatar>
                {username === "johndoe" && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute bottom-0 right-0 bg-black/50 hover:bg-black/70 text-white rounded-full"
                  >
                    <Camera className="h-4 w-4" />
                  </Button>
                )}
              </div>

              <div className="flex-1">
                <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
                  <div>
                    <h1 className="text-2xl md:text-3xl font-bold">{user.name}</h1>
                    <p className="text-muted-foreground">{user.friends} friends</p>
                  </div>

                  <div className="flex gap-2">
                    {username === "johndoe" ? (
                      <Button className="gap-2">
                        <Edit className="h-4 w-4" />
                        <span>Edit Profile</span>
                      </Button>
                    ) : (
                      <>
                        <Button className="gap-2" onClick={() => setIsFollowing(!isFollowing)}>
                          {isFollowing ? "Following ✓" : "Follow"}
                        </Button>
                      </>
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
                  <p>{user.bio}</p>
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
                    <span>Works at {user.workplace}</span>
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
                      <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                      />
                    </svg>
                    <span>Studied at {user.education}</span>
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
                    <span>Lives in {user.location}</span>
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
                        d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                      />
                    </svg>
                    <span>Joined {user.joined}</span>
                  </div>
                  {username === "johndoe" && (
                    <Button variant="outline" className="w-full">
                      Edit Details
                    </Button>
                  )}
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

                  <Post
                    id="profile1"
                    author={{
                      name: user.name,
                      image: user.profileImage,
                      username: user.username,
                    }}
                    content="Just finished working on an exciting new project! Can't wait to share more details soon. #coding #newproject"
                    timestamp="3 days ago"
                    likes={42}
                    comments={8}
                    shares={3}
                  />

                  <Post
                    id="profile2"
                    author={{
                      name: user.name,
                      image: user.profileImage,
                      username: user.username,
                    }}
                    content="Beautiful day for a hike! Nature always helps me clear my mind and get inspired."
                    image="/placeholder.svg?height=500&width=800&text=Hiking+Photo"
                    timestamp="1 week ago"
                    likes={78}
                    comments={12}
                    shares={5}
                  />
                </TabsContent>
                <TabsContent value="about">
                  <div className="bg-card rounded-lg border p-6">
                    <h2 className="text-xl font-semibold mb-4">About</h2>
                    <div className="space-y-6">
                      <div>
                        <h3 className="font-medium mb-2">Overview</h3>
                        <p>{user.bio}</p>
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
                              <div>Works at {user.workplace}</div>
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
                              <path d="M12 14l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14z" />
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M12 14l9-5-9-5-9 5 9 5zm0 0l6.16-3.422a12.083 12.083 0 01.665 6.479A11.952 11.952 0 0012 20.055a11.952 11.952 0 00-6.824-2.998 12.078 12.078 0 01.665-6.479L12 14zm-4 6v-7.5l4-2.222"
                              />
                            </svg>
                            <div>
                              <div>Studied at {user.education}</div>
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

