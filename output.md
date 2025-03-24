```tsx file="app/error.tsx"
"use client"

import { useEffect } from "react"
import Link from "next/link"

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="p-8 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="mb-4">An error occurred while rendering this page.</p>
        <div className="space-x-4">
          <button onClick={reset} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            Try again
          </button>
          <Link href="/" className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
            Return to Home
          </Link>
        </div>
      </div>
    </div>
  )
}


```

```tsx file="app/friends/loading.tsx"
export default function FriendsLoading() {
  return (
    <div className="p-8 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-2">Loading friends...</p>
      </div>
    </div>
  )
}


```

```tsx file="app/friends/page.tsx"
"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Search, Check, X } from "lucide-react"
import Navbar from "@/components/navbar"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { ToastAction } from "@/components/ui/toast"

interface Friend {
  id: number
  name: string
  mutualFriends: number
  isFriend: boolean
  avatar?: string
}

export default function FriendsPage() {
  const [searchQuery, setSearchQuery] = useState("")
  const [friends, setFriends] = useState<Friend[]>([
    { id: 1, name: "Sarah Johnson", mutualFriends: 5, isFriend: true, avatar: "/placeholder.svg?height=100&width=100" },
    { id: 2, name: "Michael Brown", mutualFriends: 3, isFriend: true, avatar: "/placeholder.svg?height=100&width=100" },
    { id: 3, name: "Emily Smith", mutualFriends: 7, isFriend: true, avatar: "/placeholder.svg?height=100&width=100" },
    { id: 4, name: "David Wilson", mutualFriends: 2, isFriend: false, avatar: "/placeholder.svg?height=100&width=100" },
    {
      id: 5,
      name: "Jessica Taylor",
      mutualFriends: 9,
      isFriend: false,
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 6,
      name: "Robert Miller",
      mutualFriends: 4,
      isFriend: false,
      avatar: "/placeholder.svg?height=100&width=100",
    },
  ])
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [unfriendDialogOpen, setUnfriendDialogOpen] = useState(false)
  const [selectedFriend, setSelectedFriend] = useState<number | null>(null)
  const { toast } = useToast()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      toast({
        title: "Search Not Available",
        description: "The search functionality is not implemented in this version.",
        variant: "destructive",
      })
    }
  }

  const handleAddFriend = (id: number) => {
    setSelectedFriend(id)
    setConfirmDialogOpen(true)
  }

  const handleDeleteRequest = (id: number) => {
    setSelectedFriend(id)
    setDeleteDialogOpen(true)
  }

  const handleUnfriend = (id: number) => {
    setSelectedFriend(id)
    setUnfriendDialogOpen(true)
  }

  const confirmAddFriend = () => {
    if (selectedFriend !== null) {
      const friendName = friends.find((f) => f.id === selectedFriend)?.name || "User"
      setFriends(friends.map((friend) => (friend.id === selectedFriend ? { ...friend, isFriend: true } : friend)))
      setConfirmDialogOpen(false)

      toast({
        title: "Friend request accepted",
        description: `You are now friends with ${friendName}`,
      })
    }
  }

  const confirmDeleteRequest = () => {
    if (selectedFriend !== null) {
      const friendName = friends.find((f) => f.id === selectedFriend)?.name || "User"
      // In a real app, you might want to remove the friend from the list
      // For this demo, we'll just keep them in the list
      setDeleteDialogOpen(false)

      toast({
        title: "Friend request deleted",
        description: `Friend request from ${friendName} has been deleted`,
      })
    }
  }

  const confirmUnfriend = () => {
    if (selectedFriend !== null) {
      const friendName = friends.find((f) => f.id === selectedFriend)?.name || "User"
      const friendId = selectedFriend

      // Update the friends list
      setFriends(friends.map((friend) => (friend.id === selectedFriend ? { ...friend, isFriend: false } : friend)))
      setUnfriendDialogOpen(false)

      // Show toast with Undo action
      toast({
        title: "Friend removed",
        description: `You are no longer friends with ${friendName}`,
        action: (
          <ToastAction altText="Undo" onClick={() => undoUnfriend(friendId)}>
            Undo
          </ToastAction>
        ),
      })
    }
  }

  // Function to undo unfriending
  const undoUnfriend = (id: number) => {
    setFriends(friends.map((friend) => (friend.id === id ? { ...friend, isFriend: true } : friend)))

    const friendName = friends.find((f) => f.id === id)?.name || "User"
    toast({
      title: "Friend restored",
      description: `You are friends with ${friendName} again`,
    })
  }

  const filteredFriends = searchQuery.trim()
    ? friends.filter((friend) => friend.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : friends

  // Function to generate username from name
  const generateUsername = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-7xl py-8 pt-24 px-4 md:px-6">
        <Tabs defaultValue="all">
          <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
            <TabsList>
              <TabsTrigger value="all">All Friends</TabsTrigger>
              <TabsTrigger value="requests">Friend Requests</TabsTrigger>
              <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            </TabsList>

            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search friends"
                className="pl-9 w-full md:w-[250px]"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>

          <TabsContent value="all">
            <Card>
              <CardHeader>
                <CardTitle>All Friends ({friends.filter((f) => f.isFriend).length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredFriends
                    .filter((friend) => friend.isFriend)
                    .map((friend) => (
                      <div key={friend.id} className="flex flex-col items-center p-4 border rounded-lg">
                        <Link href={`/profile/${generateUsername(friend.name)}`}>
                          <Avatar className="h-16 w-16 mb-3">
                            <AvatarImage src={friend.avatar} alt={friend.name} />
                            <AvatarFallback>
                              {friend.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        </Link>
                        <div className="text-center">
                          <Link
                            href={`/profile/${generateUsername(friend.name)}`}
                            className="font-medium hover:underline"
                          >
                            {friend.name}
                          </Link>
                          <div className="text-sm text-muted-foreground">{friend.mutualFriends} mutual friends</div>
                        </div>
                        <Button variant="outline" className="mt-3 w-full" onClick={() => handleUnfriend(friend.id)}>
                          Unfriend
                        </Button>
                      </div>
                    ))}
                </div>

                {filteredFriends.filter((friend) => friend.isFriend).length === 0 && (
                  <div className="text-center py-10 text-muted-foreground">
                    {searchQuery ? "No friends match your search" : "You have no friends yet"}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>Friend Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredFriends
                    .filter((friend) => !friend.isFriend)
                    .slice(0, 2)
                    .map((friend) => (
                      <div key={friend.id} className="flex flex-col items-center p-4 border rounded-lg">
                        <Link href={`/profile/${generateUsername(friend.name)}`}>
                          <Avatar className="h-16 w-16 mb-3">
                            <AvatarImage src={friend.avatar} alt={friend.name} />
                            <AvatarFallback>
                              {friend.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        </Link>
                        <div className="text-center">
                          <Link
                            href={`/profile/${generateUsername(friend.name)}`}
                            className="font-medium hover:underline"
                          >
                            {friend.name}
                          </Link>
                          <div className="text-sm text-muted-foreground">{friend.mutualFriends} mutual friends</div>
                        </div>
                        <div className="flex gap-2 mt-3 w-full">
                          <Button className="flex-1" onClick={() => handleAddFriend(friend.id)}>
                            Confirm
                          </Button>
                          <Button variant="outline" className="flex-1" onClick={() => handleDeleteRequest(friend.id)}>
                            Delete
                          </Button>
                        </div>
                      </div>
                    ))}
                </div>

                {filteredFriends.filter((friend) => !friend.isFriend).length === 0 && (
                  <div className="text-center py-10 text-muted-foreground">No friend requests to display</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suggestions">
            <Card>
              <CardHeader>
                <CardTitle>Suggested Friends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {filteredFriends
                    .filter((friend) => !friend.isFriend)
                    .slice(1, 4)
                    .map((friend) => (
                      <div key={friend.id} className="flex flex-col items-center p-4 border rounded-lg">
                        <Link href={`/profile/${generateUsername(friend.name)}`}>
                          <Avatar className="h-16 w-16 mb-3">
                            <AvatarImage src={friend.avatar} alt={friend.name} />
                            <AvatarFallback>
                              {friend.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        </Link>
                        <div className="text-center">
                          <Link
                            href={`/profile/${generateUsername(friend.name)}`}
                            className="font-medium hover:underline"
                          >
                            {friend.name}
                          </Link>
                          <div className="text-sm text-muted-foreground">{friend.mutualFriends} mutual friends</div>
                        </div>
                        <Button className="mt-3 w-full" onClick={() => handleAddFriend(friend.id)}>
                          Add Friend
                        </Button>
                      </div>
                    ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Confirm Friend Request Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Friend Request</DialogTitle>
            <DialogDescription>
              {selectedFriend !== null &&
                `Are you sure you want to accept the friend request from ${friends.find((f) => f.id === selectedFriend)?.name}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmAddFriend} className="gap-2">
              <Check className="h-4 w-4" />
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Friend Request Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Friend Request</DialogTitle>
            <DialogDescription>
              {selectedFriend !== null &&
                `Are you sure you want to delete the friend request from ${friends.find((f) => f.id === selectedFriend)?.name}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteRequest} className="gap-2">
              <X className="h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Unfriend Dialog */}
      <Dialog open={unfriendDialogOpen} onOpenChange={setUnfriendDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Remove Friend</DialogTitle>
            <DialogDescription>
              {selectedFriend !== null &&
                `Are you sure you want to remove ${friends.find((f) => f.id === selectedFriend)?.name} from your friends list?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setUnfriendDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmUnfriend}>
              Remove
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}


```

```tsx file="app/layout.tsx"
import type React from "react"
import "./globals.css"
import type { Metadata } from "next"
import { Toaster } from "@/components/ui/toaster"

export const metadata: Metadata = {
  title: "SocialConnect",
  description: "A simple social network",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        {children}
        <Toaster />
      </body>
    </html>
  )
}



import './globals.css'
```

```tsx file="app/loading.tsx"
export default function Loading() {
  return (
    <div className="p-8 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-2">Loading...</p>
      </div>
    </div>
  )
}


```

```tsx file="app/messages/loading.tsx"
export default function MessagesLoading() {
  return (
    <div className="p-8 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-2">Loading messages...</p>
      </div>
    </div>
  )
}


```

```tsx file="app/messages/page.tsx"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Navbar from "@/components/navbar"
import { Construction } from "lucide-react"

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-7xl py-8 pt-24 px-4 md:px-6">
        <Card className="border-primary/20">
          <CardHeader className="text-center pb-2">
            <Construction className="h-16 w-16 text-primary mx-auto mb-2" />
            <CardTitle className="text-2xl">Messages Feature Not Available</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              The messaging feature is currently under development and not available in this version. We're working hard
              to bring you a great messaging experience soon!
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild>
                <Link href="/">Return to Home</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/profile/johndoe">Go to Profile</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}


```

```tsx file="app/not-found.tsx"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function NotFound() {
  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
      <div className="text-center p-8">
        <h1 className="text-6xl font-bold text-primary mb-4">404</h1>
        <h2 className="text-2xl font-semibold mb-4">Page Not Found</h2>
        <p className="text-muted-foreground mb-6">
          The page you are looking for doesn't exist or is temporarily unavailable.
        </p>
        <Button asChild>
          <Link href="/">Return to Home</Link>
        </Button>
      </div>
    </div>
  )
}


```

```tsx file="app/notifications/loading.tsx"
export default function NotificationsLoading() {
  return (
    <div className="p-8 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-2">Loading notifications...</p>
      </div>
    </div>
  )
}


```

```tsx file="app/notifications/page.tsx"
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Settings, X } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import Navbar from "@/components/navbar"

interface Notification {
  id: number
  user: string
  content: string
  time: string
  read: boolean
}

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([
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
  ])

  const markAsRead = (id: number) => {
    setNotifications(
      notifications.map((notification) => (notification.id === id ? { ...notification, read: true } : notification)),
    )
  }

  const removeNotification = (id: number) => {
    setNotifications(notifications.filter((notification) => notification.id !== id))
  }

  const markAllAsRead = () => {
    setNotifications(notifications.map((notification) => ({ ...notification, read: true })))
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto max-w-7xl py-8 pt-24">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Notifications</CardTitle>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={markAllAsRead}>Mark all as read</DropdownMenuItem>
                <DropdownMenuItem
                  onClick={() => alert("Notification settings are not available in the current version.")}
                >
                  Notification settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {notifications.length > 0 ? (
                notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className={`p-4 rounded-md relative ${
                      notification.read ? "hover:bg-muted/50" : "bg-muted border-l-4 border-primary"
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className="w-10 h-10 bg-muted rounded-full shrink-0"></div>
                      <div>
                        <p>
                          <span className="font-medium">{notification.user}</span> {notification.content}
                        </p>
                        <div className="text-xs text-muted-foreground mt-1">{notification.time}</div>
                      </div>
                      <div className="ml-auto flex gap-2">
                        {!notification.read && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8"
                            onClick={() => markAsRead(notification.id)}
                            title="Mark as read"
                          >
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => removeNotification(notification.id)}
                          title="Remove notification"
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-10 text-muted-foreground">No notifications to display</div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </>
  )
}


```

```tsx file="app/page.tsx"
import Navbar from "@/components/navbar"
import Sidebar from "@/components/sidebar"
import RightSidebar from "@/components/right-sidebar"
import NewsFeed from "@/components/news-feed"

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto max-w-7xl pt-16">
        <div className="flex flex-col md:flex-row gap-4 p-4">
          <div className="hidden md:block md:w-1/4 lg:w-1/5">
            <Sidebar className="sticky top-20" />
          </div>
          <main className="flex-1 md:w-2/4 lg:w-3/5">
            <NewsFeed />
          </main>
          <div className="hidden lg:block lg:w-1/5">
            <RightSidebar className="sticky top-20" />
          </div>
        </div>
      </div>
    </>
  )
}


```

```tsx file="app/profile/[username]/loading.tsx"
export default function Loading() {
  return (
    <div className="p-8 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-2">Loading profile...</p>
      </div>
    </div>
  )
}


```

```tsx file="app/profile/[username]/page.tsx"
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


```

```tsx file="app/profile/loading.tsx"
export default function ProfileLoading() {
  return (
    <div className="p-8 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-2">Loading profile...</p>
      </div>
    </div>
  )
}


```

```tsx file="app/profile/page.tsx"
import Link from "next/link"
import { SimpleButton } from "@/components/simple-button"
import { SimplePost } from "@/components/simple-post"

export default function Profile() {
  return (
    <div className="p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <nav className="mt-2">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
        </nav>
      </header>

      <main>
        <div className="grid gap-4">
          <div className="p-4 border rounded-md">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
              <h2 className="text-xl font-bold">John Doe</h2>
              <p className="text-gray-600">Software Developer</p>
              <div className="mt-4">
                <SimpleButton variant="outline">Edit Profile</SimpleButton>
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-md">
            <h2 className="text-xl font-bold mb-2">About</h2>
            <p>Software Developer | Photography Enthusiast | Coffee Lover</p>
          </div>

          <div className="p-4 border rounded-md">
            <h2 className="text-xl font-bold mb-2">Recent Posts</h2>
            <div className="space-y-4">
              <SimplePost
                author="John Doe"
                content="Just finished working on an exciting new project!"
                timestamp="3 days ago"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}


```

```tsx file="components/client-wrapper.tsx"
"use client"

import type React from "react"

export function ClientWrapper({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}


```

```tsx file="components/comment-section.tsx"
"use client"

import type React from "react"

import { useState } from "react"

interface Comment {
  id: number
  author: string
  text: string
  time: string
}

interface CommentSectionProps {
  initialComments: Comment[]
}

export function CommentSection({ initialComments }: CommentSectionProps) {
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const [newComment, setNewComment] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (!newComment.trim()) return

    const comment: Comment = {
      id: Date.now(),
      author: "You",
      text: newComment,
      time: "Just now",
    }

    setComments([...comments, comment])
    setNewComment("")
  }

  return (
    <div className="mt-4">
      <h3 className="font-medium mb-2">Comments</h3>

      <div className="space-y-3 mb-4">
        {comments.map((comment) => (
          <div key={comment.id} className="flex gap-2">
            <div className="w-8 h-8 bg-gray-200 rounded-full shrink-0"></div>
            <div className="flex-1">
              <div className="bg-gray-100 rounded-lg px-3 py-2">
                <div className="font-medium text-sm">{comment.author}</div>
                <p className="text-sm">{comment.text}</p>
              </div>
              <div className="text-xs text-gray-500 mt-1">{comment.time}</div>
            </div>
          </div>
        ))}
      </div>

      <form onSubmit={handleSubmit} className="flex gap-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full shrink-0"></div>
        <div className="flex-1">
          <input
            type="text"
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="Write a comment..."
            className="w-full px-3 py-2 border rounded-md"
          />
        </div>
        <button
          type="submit"
          disabled={!newComment.trim()}
          className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
        >
          Post
        </button>
      </form>
    </div>
  )
}


```

```tsx file="components/create-post.tsx"
"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface CreatePostProps {
  onPostSubmit: (content: string) => void
}

export default function CreatePost({ onPostSubmit }: CreatePostProps) {
  const [postText, setPostText] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleSubmit = () => {
    if (!postText.trim()) return

    // Call the onPostSubmit function to add the post to the timeline
    onPostSubmit(postText)

    // Show success toast
    toast({
      title: "Post created",
      description: "Your post has been published successfully!",
    })

    // Reset state and close dialog
    setPostText("")
    setIsDialogOpen(false)
  }

  return (
    <Card className="mb-6">
      <CardHeader className="pb-3">
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-10 w-full justify-start text-muted-foreground rounded-full">
                What&apos;s on your mind, John?
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-center">Create Post</DialogTitle>
              </DialogHeader>
              <div className="flex items-center gap-3 py-2">
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">John Doe</div>
                </div>
              </div>

              <div className="bg-white p-3 rounded-md">
                <Textarea
                  placeholder="What's on your mind, John?"
                  className="min-h-[120px] border-none shadow-none resize-none focus-visible:ring-0 bg-white"
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  autoFocus
                />
              </div>

              <Button className="w-full mt-4" disabled={!postText.trim()} onClick={handleSubmit} type="button">
                Post
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
    </Card>
  )
}


```

```tsx file="components/friend-card.tsx"
"use client"

import { useState } from "react"
import { SimpleButton } from "./simple-button"

interface FriendCardProps {
  name: string
  mutualFriends: number
}

export function FriendCard({ name, mutualFriends }: FriendCardProps) {
  const [isFriend, setIsFriend] = useState(false)

  return (
    <div className="p-3 border rounded-md">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-gray-600">{mutualFriends} mutual friends</p>
        </div>
      </div>
      <div className="mt-3">
        <SimpleButton variant={isFriend ? "outline" : "default"} onClick={() => setIsFriend(!isFriend)}>
          {isFriend ? "Friends ✓" : "Add Friend"}
        </SimpleButton>
      </div>
    </div>
  )
}


```

```tsx file="components/full-post.tsx"
"use client"

import { useState } from "react"
import { CommentSection } from "./comment-section"

interface Comment {
  id: number
  author: string
  text: string
  time: string
}

interface FullPostProps {
  author: string
  content: string
  timestamp: string
  initialLikes?: number
  initialComments?: Comment[]
}

export function FullPost({ author, content, timestamp, initialLikes = 0, initialComments = [] }: FullPostProps) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(initialLikes)
  const [showComments, setShowComments] = useState(false)

  const handleLike = () => {
    setLiked(!liked)
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1))
  }

  return (
    <div className="p-4 border rounded-md bg-white">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0"></div>
        <div className="flex-1">
          <p className="font-medium">{author}</p>
          <p className="text-sm text-gray-500">{timestamp}</p>
          <p className="mt-2">{content}</p>

          <div className="flex items-center gap-4 mt-3 pt-3 border-t">
            <button
              onClick={handleLike}
              className={`flex items-center gap-1 ${liked ? "text-blue-600" : "text-gray-600"}`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill={liked ? "currentColor" : "none"}
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5"
                />
              </svg>
              <span>{liked ? "Liked" : "Like"}</span>
              {likeCount > 0 && <span>({likeCount})</span>}
            </button>

            <button onClick={() => setShowComments(!showComments)} className="flex items-center gap-1 text-gray-600">
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
                  d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"
                />
              </svg>
              <span>Comment</span>
              {initialComments.length > 0 && <span>({initialComments.length})</span>}
            </button>

            <button className="flex items-center gap-1 text-gray-600">
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
                  d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                />
              </svg>
              <span>Share</span>
            </button>
          </div>

          {showComments && <CommentSection initialComments={initialComments} />}
        </div>
      </div>
    </div>
  )
}


```

```tsx file="components/interactive-friend-card.tsx"
"use client"

import { useState } from "react"

interface InteractiveFriendCardProps {
  name: string
  mutualFriends: number
}

export function InteractiveFriendCard({ name, mutualFriends }: InteractiveFriendCardProps) {
  const [isFriend, setIsFriend] = useState(false)

  return (
    <div className="p-4 border rounded-md bg-white">
      <div className="flex items-center gap-3">
        <div className="w-16 h-16 bg-gray-200 rounded-full shrink-0"></div>
        <div>
          <p className="font-medium">{name}</p>
          <p className="text-sm text-gray-500">{mutualFriends} mutual friends</p>
        </div>
      </div>
      <div className="mt-3">
        <button
          onClick={() => setIsFriend(!isFriend)}
          className={`w-full px-4 py-2 rounded-md font-medium transition-colors ${
            isFriend ? "bg-gray-200 hover:bg-gray-300" : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isFriend ? "Friends ✓" : "Add Friend"}
        </button>
      </div>
    </div>
  )
}


```

```tsx file="components/interactive-post.tsx"
"use client"

import { useState } from "react"

interface InteractivePostProps {
  author: string
  content: string
  timestamp: string
  initialLikes?: number
}

export function InteractivePost({ author, content, timestamp, initialLikes = 0 }: InteractivePostProps) {
  const [liked, setLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(initialLikes)

  const handleLike = () => {
    setLiked(!liked)
    setLikeCount((prev) => (liked ? prev - 1 : prev + 1))
  }

  return (
    <div className="p-4 border rounded-md">
      <div className="flex items-start gap-3">
        <div className="w-10 h-10 bg-gray-200 rounded-full shrink-0"></div>
        <div className="flex-1">
          <p className="font-medium">{author}</p>
          <p className="text-sm text-gray-500">{timestamp}</p>
          <p className="mt-2">{content}</p>

          <div className="flex items-center gap-2 mt-3">
            <button
              onClick={handleLike}
              className={`px-4 py-2 rounded-md font-medium transition-colors ${
                liked ? "bg-blue-600 text-white hover:bg-blue-700" : "bg-gray-100 hover:bg-gray-200"
              }`}
            >
              {liked ? "Liked" : "Like"}
            </button>
            {likeCount > 0 && (
              <span className="text-sm text-gray-500">
                {likeCount} {likeCount === 1 ? "like" : "likes"}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}


```

```tsx file="components/like-button.tsx"
"use client"

import { useState } from "react"
import { SimpleButton } from "./simple-button"

export function LikeButton() {
  const [liked, setLiked] = useState(false)
  const [count, setCount] = useState(0)

  const handleClick = () => {
    setLiked(!liked)
    setCount((prev) => (liked ? prev - 1 : prev + 1))
  }

  return (
    <SimpleButton onClick={handleClick} className={liked ? "bg-blue-700 text-white" : ""}>
      {liked ? "Liked" : "Like"}
      {count > 0 && ` (${count})`}
    </SimpleButton>
  )
}


```

```tsx file="components/navbar.tsx"
"use client"

import type React from "react"

import Link from "next/link"
import { Bell, Home, Menu, User, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Search } from "lucide-react"

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    toast({
      title: "Search Not Available",
      description: "The search functionality is not implemented in this version.",
      variant: "destructive",
    })
  }

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
      <div className="container mx-auto max-w-7xl">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center">
              <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold">
                f
              </div>
            </Link>
            <div className="hidden md:flex relative">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search SocialConnect (Not Available)"
                  className="w-[300px] pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              <Home className="h-6 w-6" />
            </Link>
            <Link href="/friends" className="text-foreground hover:text-primary transition-colors">
              <Users className="h-6 w-6" />
            </Link>
            <Link href="/notifications" className="text-foreground hover:text-primary transition-colors">
              <Bell className="h-6 w-6" />
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search className="h-5 w-5" />
            </Button>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                  >
                    <Home className="h-5 w-5" />
                    <span>Home</span>
                  </Link>
                  <Link
                    href="/friends"
                    className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                  >
                    <Users className="h-5 w-5" />
                    <span>Friends</span>
                  </Link>
                  <Link
                    href="/notifications"
                    className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                  >
                    <Bell className="h-5 w-5" />
                    <span>Notifications</span>
                  </Link>
                  <Link
                    href="/profile/johndoe"
                    className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile/johndoe">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    toast({
                      title: "Logged out",
                      description: "You have been logged out successfully!",
                    })
                  }
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {isSearchOpen && (
          <div className="md:hidden p-4 border-t">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search SocialConnect (Not Available)"
                className="w-full pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
        )}
      </div>
    </header>
  )
}


```

```tsx file="components/news-feed.tsx"
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


```

```tsx file="components/right-sidebar.tsx"
"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

interface RightSidebarProps {
  className?: string
}

export default function RightSidebar({ className }: RightSidebarProps) {
  const [friendRequests, setFriendRequests] = useState([
    { id: 1, name: "Jessica Taylor", mutualFriends: 3, avatar: "/placeholder.svg?height=40&width=40", initials: "JT" },
    { id: 2, name: "Robert Wilson", mutualFriends: 1, avatar: "/placeholder.svg?height=40&width=40", initials: "RW" },
  ])

  const [activeTab, setActiveTab] = useState("contacts")
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<number | null>(null)
  const { toast } = useToast()

  const handleAcceptFriend = (id: number) => {
    setSelectedRequest(id)
    setConfirmDialogOpen(true)
  }

  const handleDeleteFriend = (id: number) => {
    setSelectedRequest(id)
    setDeleteDialogOpen(true)
  }

  const confirmAcceptFriend = () => {
    if (selectedRequest !== null) {
      const requestName = friendRequests.find((r) => r.id === selectedRequest)?.name || "User"
      setFriendRequests(friendRequests.filter((request) => request.id !== selectedRequest))
      setConfirmDialogOpen(false)

      toast({
        title: "Friend request accepted",
        description: `You are now friends with ${requestName}`,
        action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
      })
    }
  }

  const confirmDeleteFriend = () => {
    if (selectedRequest !== null) {
      const requestName = friendRequests.find((r) => r.id === selectedRequest)?.name || "User"
      setFriendRequests(friendRequests.filter((request) => request.id !== selectedRequest))
      setDeleteDialogOpen(false)

      toast({
        title: "Friend request deleted",
        description: `Friend request from ${requestName} has been deleted`,
        action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
      })
    }
  }

  // Create a function to generate a username from a name
  const generateUsername = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "")
  }

  return (
    <aside className={cn("py-4", className)}>
      <div className="space-y-6">
        <Tabs defaultValue="contacts" onValueChange={setActiveTab}>
          <TabsList className="w-full">
            <TabsTrigger value="contacts" className="flex-1">
              Contacts
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex-1">
              Friend Requests
            </TabsTrigger>
          </TabsList>

          <TabsContent value="contacts">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between">
                <CardTitle className="text-lg">Contacts</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {[
                    { name: "Alex Johnson", online: true },
                    { name: "Emily Smith", online: true },
                    { name: "Michael Brown", online: true },
                    { name: "Sophia Williams", online: false },
                    { name: "David Miller", online: false },
                  ].map((contact, i) => (
                    <Link
                      href={`/profile/${generateUsername(contact.name)}`}
                      key={`contact-${i}`}
                      className="flex items-center gap-3 rounded-md py-1 text-foreground hover:bg-muted transition-colors"
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage src="/placeholder.svg?height=40&width=40" alt={contact.name} />
                          <AvatarFallback>
                            {contact.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {contact.online && (
                          <span className="absolute bottom-0 right-0 h-2.5 w-2.5 rounded-full bg-green-500 ring-1 ring-background"></span>
                        )}
                      </div>
                      <span>{contact.name}</span>
                    </Link>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Friend Requests</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {friendRequests.length > 0 ? (
                  friendRequests.map((request) => (
                    <div key={request.id} className="flex items-start gap-3">
                      <Link href={`/profile/${generateUsername(request.name)}`}>
                        <Avatar className="h-10 w-10">
                          <AvatarImage src={request.avatar} alt={request.name} />
                          <AvatarFallback>{request.initials}</AvatarFallback>
                        </Avatar>
                      </Link>
                      <div className="flex-1">
                        <div className="font-medium">
                          <Link href={`/profile/${generateUsername(request.name)}`} className="hover:underline">
                            {request.name}
                          </Link>
                        </div>
                        <div className="text-xs text-muted-foreground">{request.mutualFriends} mutual friends</div>
                        <div className="flex gap-2 mt-2">
                          <Button size="sm" className="h-8" onClick={() => handleAcceptFriend(request.id)}>
                            Confirm
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="h-8"
                            onClick={() => handleDeleteFriend(request.id)}
                          >
                            Delete
                          </Button>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="text-center py-4 text-muted-foreground">No friend requests to display</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Confirm Friend Request Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Friend Request</DialogTitle>
            <DialogDescription>
              {selectedRequest !== null &&
                `Are you sure you want to accept the friend request from ${friendRequests.find((r) => r.id === selectedRequest)?.name}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmAcceptFriend} className="gap-2">
              <Check className="h-4 w-4" />
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Friend Request Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Friend Request</DialogTitle>
            <DialogDescription>
              {selectedRequest !== null &&
                `Are you sure you want to delete the friend request from ${friendRequests.find((r) => r.id === selectedRequest)?.name}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteFriend} className="gap-2">
              <X className="h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  )
}


```

```tsx file="components/simple-button.tsx"
import type React from "react"

interface SimpleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "default" | "outline"
}

export function SimpleButton({ children, variant = "default", className = "", ...props }: SimpleButtonProps) {
  const baseStyles = "px-4 py-2 rounded-md font-medium"
  const variantStyles =
    variant === "default" ? "bg-blue-600 text-white hover:bg-blue-700" : "border border-gray-300 hover:bg-gray-100"

  return (
    <button className={`${baseStyles} ${variantStyles} ${className}`} {...props}>
      {children}
    </button>
  )
}


```

```tsx file="components/simple-post.tsx"
import { ClientWrapper } from "./client-wrapper"
import { LikeButton } from "./like-button"

interface SimplePostProps {
  author: string
  content: string
  timestamp: string
}

export function SimplePost({ author, content, timestamp }: SimplePostProps) {
  return (
    <div className="p-3 border rounded-md">
      <p className="font-medium">{author}</p>
      <p className="text-sm text-gray-600">{timestamp}</p>
      <p className="mt-2">{content}</p>
      <div className="mt-3">
        <ClientWrapper>
          <LikeButton />
        </ClientWrapper>
      </div>
    </div>
  )
}


```

```ts file="hooks/use-toast.ts"
// This is a direct import to ensure it works properly
import { useToast as useToastOriginal } from "@/components/ui/use-toast"

export const useToast = useToastOriginal


```

