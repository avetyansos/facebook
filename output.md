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

```tsx file="app/followers/loading.tsx"
export default function FollowersLoading() {
  return (
    <div className="p-8 flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
        <p className="mt-2">Loading followers...</p>
      </div>
    </div>
  )
}


```

```tsx file="app/followers/page.tsx"
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
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
import { globalUsers, globalSuggestions, followUser, unfollowUser } from "@/lib/shared-state"

export default function FollowersPage() {
  const [following, setFollowing] = useState<typeof globalUsers>([])
  const [suggestions, setSuggestions] = useState<typeof globalSuggestions>([])
  const [unfollowDialogOpen, setUnfollowDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<number | null>(null)
  const { toast } = useToast()

  // Update local state when component mounts or when returning to this page
  useEffect(() => {
    // Get all followed users
    setFollowing(globalUsers.filter((user) => user.isFollowing))

    // Get all suggestions
    setSuggestions([
      ...globalSuggestions.filter((user) => !user.isFollowing),
      ...globalUsers.filter((user) => !user.isFollowing && !user.isDeleted),
    ])
  }, [])

  const handleUnfollow = (id: number) => {
    setSelectedUser(id)
    setUnfollowDialogOpen(true)
  }

  const handleFollow = (id: number) => {
    const user = suggestions.find((u) => u.id === id)
    if (!user) return

    // Update local state
    setSuggestions((prev) => prev.filter((s) => s.id !== id))
    setFollowing((prev) => [...prev, { ...user, isFollowing: true }])

    // Update global state
    followUser(user)

    toast({
      title: "Following",
      description: `You are now following ${user.name}`,
    })
  }

  const confirmUnfollow = () => {
    if (selectedUser !== null) {
      const user = following.find((u) => u.id === selectedUser)
      if (!user) return

      // Update local state
      setFollowing((prev) => prev.filter((f) => f.id !== selectedUser))
      setSuggestions((prev) => [...prev, { ...user, isFollowing: false }])

      // Update global state
      unfollowUser(user.name)

      setUnfollowDialogOpen(false)

      // Show toast with Undo action
      toast({
        title: "Unfollowed",
        description: `You are no longer following ${user.name}`,
        action: (
          <ToastAction altText="Undo" onClick={() => undoUnfollow(user)}>
            Undo
          </ToastAction>
        ),
      })
    }
  }

  // Function to undo unfollowing
  const undoUnfollow = (user: (typeof globalUsers)[0]) => {
    // Update local state
    setSuggestions((prev) => prev.filter((s) => s.id !== user.id))
    setFollowing((prev) => [...prev, { ...user, isFollowing: true }])

    // Update global state
    followUser(user)

    toast({
      title: "Following restored",
      description: `You are following ${user.name} again`,
    })
  }

  // Function to generate username from name
  const generateUsername = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "")
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-7xl py-8 pt-24 px-4 md:px-6">
        <Tabs defaultValue="following">
          <div className="mb-6 flex justify-center md:justify-start">
            {/* Responsive TabsList - default width on larger screens, full width on mobile */}
            <TabsList className="md:w-auto w-full grid grid-cols-2">
              <TabsTrigger value="following" className="md:w-auto w-full">
                Following
              </TabsTrigger>
              <TabsTrigger value="suggestions" className="md:w-auto w-full">
                Suggestions
              </TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="following">
            <Card>
              <CardHeader>
                <CardTitle>Following ({following.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {following.map((user) => (
                    <div key={user.id} className="flex flex-col items-center p-4 border rounded-lg">
                      <Link href={`/profile/${generateUsername(user.name)}`}>
                        <Avatar className="h-16 w-16 mb-3">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                      <div className="text-center">
                        <Link href={`/profile/${generateUsername(user.name)}`} className="font-medium hover:underline">
                          {user.name}
                        </Link>
                        <div className="text-sm text-muted-foreground">{user.mutualFollowers} mutual followers</div>
                      </div>
                      <Button variant="outline" className="mt-3 w-full" onClick={() => handleUnfollow(user.id)}>
                        Unfollow
                      </Button>
                    </div>
                  ))}
                </div>

                {following.length === 0 && (
                  <div className="text-center py-10 text-muted-foreground">You are not following anyone yet</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suggestions">
            <Card>
              <CardHeader>
                <CardTitle>Suggested Accounts</CardTitle>
              </CardHeader>
              <CardContent>
                {suggestions.length > 0 ? (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {suggestions.map((user) => (
                      <div key={user.id} className="p-4 border rounded-lg relative">
                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                          <Link href={`/profile/${generateUsername(user.name)}`} className="shrink-0">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={user.avatar} alt={user.name} />
                              <AvatarFallback>
                                {user.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                          </Link>
                          <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
                            <div className="font-medium text-lg">
                              <Link href={`/profile/${generateUsername(user.name)}`} className="hover:underline">
                                {user.name}
                              </Link>
                            </div>
                            <div className="text-muted-foreground">{user.mutualFollowers} mutual followers</div>

                            <div className="mt-3 w-full">
                              <Button
                                className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                                onClick={() => handleFollow(user.id)}
                              >
                                Follow
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-10 text-muted-foreground">No suggestions found</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Unfollow Dialog */}
      <Dialog open={unfollowDialogOpen} onOpenChange={setUnfollowDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unfollow</DialogTitle>
            <DialogDescription>
              {selectedUser !== null &&
                `Are you sure you want to unfollow ${following.find((u) => u.id === selectedUser)?.name}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setUnfollowDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmUnfollow}>
              Unfollow
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
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

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Check, X } from "lucide-react"
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

interface User {
  id: number
  name: string
  mutualFollowers: number
  isFollowing: boolean
  isRequested?: boolean
  isDeleted?: boolean
  avatar?: string
}

export default function ConnectionsPage() {
  const [users, setUsers] = useState<User[]>([
    {
      id: 1,
      name: "Sarah Johnson",
      mutualFollowers: 5,
      isFollowing: true,
      isDeleted: false,
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 2,
      name: "Michael Brown",
      mutualFollowers: 3,
      isFollowing: true,
      isDeleted: false,
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 3,
      name: "Emily Smith",
      mutualFollowers: 7,
      isFollowing: true,
      isDeleted: false,
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 4,
      name: "David Wilson",
      mutualFollowers: 2,
      isFollowing: false,
      isRequested: true,
      isDeleted: false,
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 5,
      name: "Jessica Taylor",
      mutualFollowers: 9,
      isFollowing: false,
      isRequested: true,
      isDeleted: false,
      avatar: "/placeholder.svg?height=100&width=100",
    },
    {
      id: 6,
      name: "Robert Miller",
      mutualFollowers: 4,
      isFollowing: false,
      isRequested: false,
      isDeleted: false,
      avatar: "/placeholder.svg?height=100&width=100",
    },
  ])
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [unfollowDialogOpen, setUnfollowDialogOpen] = useState(false)
  const [selectedUser, setSelectedUser] = useState<number | null>(null)
  const { toast } = useToast()

  const handleAcceptRequest = (id: number) => {
    setSelectedUser(id)
    setConfirmDialogOpen(true)
  }

  const handleDeleteRequest = (id: number) => {
    setSelectedUser(id)
    setDeleteDialogOpen(true)
  }

  const handleUnfollow = (id: number) => {
    setSelectedUser(id)
    setUnfollowDialogOpen(true)
  }

  const handleFollow = (id: number) => {
    const userName = users.find((u) => u.id === id)?.name || "User"
    setUsers(users.map((user) => (user.id === id ? { ...user, isFollowing: true } : user)))

    toast({
      title: "Following",
      description: `You are now following ${userName}`,
    })
  }

  const confirmAcceptRequest = () => {
    if (selectedUser !== null) {
      const userName = users.find((u) => u.id === selectedUser)?.name || "User"
      setUsers(
        users.map((user) => (user.id === selectedUser ? { ...user, isFollowing: true, isRequested: false } : user)),
      )
      setConfirmDialogOpen(false)

      toast({
        title: "Follow request accepted",
        description: `You are now following ${userName}`,
      })
    }
  }

  const confirmDeleteRequest = () => {
    if (selectedUser !== null) {
      const user = users.find((u) => u.id === selectedUser)
      if (user) {
        // Mark as deleted instead of removing from the list
        setUsers(users.map((u) => (u.id === selectedUser ? { ...u, isDeleted: true } : u)))
        setDeleteDialogOpen(false)

        toast({
          title: "Request deleted",
          description: `Follow request from ${user.name} has been deleted`,
          action: (
            <ToastAction altText="Undo" onClick={() => undoDeleteRequest(user.id)}>
              Undo
            </ToastAction>
          ),
        })
      }
    }
  }

  const undoDeleteRequest = (id: number) => {
    // Mark as not deleted to restore it
    setUsers(users.map((u) => (u.id === id ? { ...u, isDeleted: false } : u)))

    const userName = users.find((u) => u.id === id)?.name || "User"
    toast({
      title: "Request restored",
      description: `Follow request from ${userName} has been restored`,
    })
  }

  const confirmUnfollow = () => {
    if (selectedUser !== null) {
      const userName = users.find((u) => u.id === selectedUser)?.name || "User"
      const userId = selectedUser

      // Update the users list
      setUsers(users.map((user) => (user.id === selectedUser ? { ...user, isFollowing: false } : user)))
      setUnfollowDialogOpen(false)

      // Show toast with Undo action
      toast({
        title: "Unfollowed",
        description: `You are no longer following ${userName}`,
        action: (
          <ToastAction altText="Undo" onClick={() => undoUnfollow(userId)}>
            Undo
          </ToastAction>
        ),
      })
    }
  }

  // Function to undo unfollowing
  const undoUnfollow = (id: number) => {
    setUsers(users.map((user) => (user.id === id ? { ...user, isFollowing: true } : user)))

    const userName = users.find((u) => u.id === id)?.name || "User"
    toast({
      title: "Following restored",
      description: `You are following ${userName} again`,
    })
  }

  // Function to generate username from name
  const generateUsername = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "")
  }

  // Filter users for each tab
  const following = users.filter((user) => user.isFollowing)
  const requests = users.filter((user) => !user.isFollowing && user.isRequested && !user.isDeleted)
  const suggestions = users.filter((user) => !user.isFollowing && !user.isRequested).slice(0, 3)

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-7xl py-8 pt-24 px-4 md:px-6">
        <Tabs defaultValue="following">
          <div className="mb-6">
            <TabsList className="w-full grid grid-cols-3">
              <TabsTrigger value="following">Following</TabsTrigger>
              <TabsTrigger value="requests">Requests</TabsTrigger>
              <TabsTrigger value="suggestions">Suggestions</TabsTrigger>
            </TabsList>
          </div>

          <TabsContent value="following">
            <Card>
              <CardHeader>
                <CardTitle>Following ({following.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  {following.map((user) => (
                    <div key={user.id} className="flex flex-col items-center p-4 border rounded-lg">
                      <Link href={`/profile/${generateUsername(user.name)}`}>
                        <Avatar className="h-16 w-16 mb-3">
                          <AvatarImage src={user.avatar} alt={user.name} />
                          <AvatarFallback>
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </Link>
                      <div className="text-center">
                        <Link href={`/profile/${generateUsername(user.name)}`} className="font-medium hover:underline">
                          {user.name}
                        </Link>
                        <div className="text-sm text-muted-foreground">{user.mutualFollowers} mutual followers</div>
                      </div>
                      <Button variant="outline" className="mt-3 w-full" onClick={() => handleUnfollow(user.id)}>
                        Unfollow
                      </Button>
                    </div>
                  ))}
                </div>

                {following.length === 0 && (
                  <div className="text-center py-10 text-muted-foreground">You are not following anyone yet</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="requests">
            <Card>
              <CardHeader>
                <CardTitle>Follow Requests</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {requests.map((user) => (
                    <div key={user.id} className="p-4 border rounded-lg relative">
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                        <Link href={`/profile/${generateUsername(user.name)}`} className="shrink-0">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        </Link>
                        <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
                          <div className="font-medium text-lg">
                            <Link href={`/profile/${generateUsername(user.name)}`} className="hover:underline">
                              {user.name}
                            </Link>
                          </div>
                          <div className="text-muted-foreground">{user.mutualFollowers} mutual followers</div>

                          <div className="flex gap-2 mt-3 w-full">
                            <Button
                              className="flex-1 bg-primary text-primary-foreground hover:bg-primary/90"
                              onClick={() => handleAcceptRequest(user.id)}
                            >
                              <Check className="mr-2 h-4 w-4 md:hidden" />
                              <span>Confirm</span>
                            </Button>
                            <Button variant="outline" className="flex-1" onClick={() => handleDeleteRequest(user.id)}>
                              <X className="mr-2 h-4 w-4 md:hidden" />
                              <span>Delete</span>
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                {requests.length === 0 && (
                  <div className="text-center py-10 text-muted-foreground">No follow requests to display</div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="suggestions">
            <Card>
              <CardHeader>
                <CardTitle>Suggested Accounts</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {suggestions.map((user) => (
                    <div key={user.id} className="p-4 border rounded-lg relative">
                      <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                        <Link href={`/profile/${generateUsername(user.name)}`} className="shrink-0">
                          <Avatar className="h-16 w-16">
                            <AvatarImage src={user.avatar} alt={user.name} />
                            <AvatarFallback>
                              {user.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        </Link>
                        <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
                          <div className="font-medium text-lg">
                            <Link href={`/profile/${generateUsername(user.name)}`} className="hover:underline">
                              {user.name}
                            </Link>
                          </div>
                          <div className="text-muted-foreground">{user.mutualFollowers} mutual followers</div>

                          <div className="mt-3 w-full">
                            <Button
                              className="w-full bg-primary text-primary-foreground hover:bg-primary/90"
                              onClick={() => handleFollow(user.id)}
                            >
                              Follow
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Confirm Follow Request Dialog */}
      <Dialog open={confirmDialogOpen} onOpenChange={setConfirmDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Follow Request</DialogTitle>
            <DialogDescription>
              {selectedUser !== null &&
                `Are you sure you want to accept the follow request from ${users.find((u) => u.id === selectedUser)?.name}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmAcceptRequest} className="gap-2">
              <Check className="h-4 w-4" />
              Confirm
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Follow Request Dialog */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Follow Request</DialogTitle>
            <DialogDescription>
              {selectedUser !== null &&
                `Are you sure you want to delete the follow request from ${users.find((u) => u.id === selectedUser)?.name}?`}
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

      {/* Unfollow Dialog */}
      <Dialog open={unfollowDialogOpen} onOpenChange={setUnfollowDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unfollow</DialogTitle>
            <DialogDescription>
              {selectedUser !== null &&
                `Are you sure you want to unfollow ${users.find((u) => u.id === selectedUser)?.name}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setUnfollowDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmUnfollow}>
              Unfollow
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
import { X } from "lucide-react"
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
            <Button variant="outline" onClick={markAllAsRead}>
              Mark all as read
            </Button>
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

import { useState, useEffect } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Post from "@/components/post"
import CreatePost from "@/components/create-post"
import Navbar from "@/components/navbar"
import { useToast } from "@/hooks/use-toast"
import { globalUsers, globalSuggestions, isUserFollowed, followUser, unfollowUser } from "@/lib/shared-state"

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

                  <Post
                    id="profile1"
                    author={{
                      name: displayName,
                      image: profileData.profileImage,
                      username: username,
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
                      name: displayName,
                      image: profileData.profileImage,
                      username: username,
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
    <Card className="mb-6 mt-0">
      {" "}
      {/* Added mt-0 to ensure no top margin */}
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

import Link from "next/link"
import { Bell, Home, Menu, User, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"
import { usePathname } from "next/navigation"

export default function Navbar() {
  const { toast } = useToast()
  const pathname = usePathname()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
      <div className="container mx-auto max-w-7xl">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <Link href="/" className="flex items-center">
            <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold">
              f
            </div>
          </Link>

          {/* Push navigation to the right */}
          <div className="flex-1"></div>

          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/"
              className={`text-foreground hover:text-primary transition-colors ${pathname === "/" ? "text-primary" : ""}`}
            >
              <Home className="h-6 w-6" />
            </Link>
            <Link
              href="/followers"
              className={`text-foreground hover:text-primary transition-colors ${pathname === "/followers" ? "text-primary" : ""}`}
            >
              <Users className="h-6 w-6" />
            </Link>
            <Link
              href="/notifications"
              className={`text-foreground hover:text-primary transition-colors ${pathname === "/notifications" ? "text-primary" : ""}`}
            >
              <Bell className="h-6 w-6" />
            </Link>
          </nav>

          <div className="flex items-center gap-4 ml-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link
                    href="/"
                    className={`flex items-center gap-2 text-foreground hover:text-primary transition-colors ${pathname === "/" ? "text-primary" : ""}`}
                  >
                    <Home className="h-5 w-5" />
                    <span>Home</span>
                  </Link>
                  <Link
                    href="/followers"
                    className={`flex items-center gap-2 text-foreground hover:text-primary transition-colors ${pathname === "/followers" ? "text-primary" : ""}`}
                  >
                    <Users className="h-5 w-5" />
                    <span>Followers</span>
                  </Link>
                  <Link
                    href="/notifications"
                    className={`flex items-center gap-2 text-foreground hover:text-primary transition-colors ${pathname === "/notifications" ? "text-primary" : ""}`}
                  >
                    <Bell className="h-5 w-5" />
                    <span>Notifications</span>
                  </Link>
                  <Link
                    href="/profile/johndoe"
                    className={`flex items-center gap-2 text-foreground hover:text-primary transition-colors ${pathname.startsWith("/profile") ? "text-primary" : ""}`}
                  >
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}


```

```tsx file="components/news-feed.tsx"
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


```

```tsx file="components/right-sidebar.tsx"
"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useToast } from "@/hooks/use-toast"
import { globalUsers, globalSuggestions, followUser } from "@/lib/shared-state"

interface RightSidebarProps {
  className?: string
}

interface Contact {
  id: number
  name: string
  online: boolean
  isFollowing: boolean
  avatar?: string
  mutualFollowers?: number
}

export default function RightSidebar({ className }: RightSidebarProps) {
  const [allFollowing, setAllFollowing] = useState<Contact[]>([])
  const [suggestions, setSuggestions] = useState<Contact[]>([])
  const { toast } = useToast()

  // Function to refresh data from global state
  const refreshData = () => {
    // Get all followed users from global state
    const followingUsers = globalUsers
      .filter((user) => user.isFollowing)
      .map((user) => ({
        id: user.id,
        name: user.name,
        online: Math.random() > 0.5, // Randomly set online status
        isFollowing: true,
        avatar: user.avatar,
        mutualFollowers: user.mutualFollowers,
      }))

    // Get all suggestions from global state
    const suggestionUsers = globalSuggestions
      .filter((user) => !user.isFollowing)
      .map((user) => ({
        id: user.id,
        name: user.name,
        online: Math.random() > 0.5, // Randomly set online status
        isFollowing: false,
        avatar: user.avatar,
        mutualFollowers: user.mutualFollowers,
      }))

    setAllFollowing(followingUsers)
    setSuggestions(suggestionUsers)
  }

  // Sync with global state on mount and when it changes
  useEffect(() => {
    refreshData()

    // Set up an interval to refresh data periodically
    const intervalId = setInterval(refreshData, 2000)

    // Clean up interval on unmount
    return () => clearInterval(intervalId)
  }, [])

  // Handle follow action
  const handleFollow = (id: number) => {
    const user = suggestions.find((s) => s.id === id)
    if (user) {
      // Update local state immediately
      setSuggestions((prev) => prev.filter((s) => s.id !== id))
      setAllFollowing((prev) => [...prev, { ...user, isFollowing: true }])

      // Update global state
      followUser({
        id: user.id,
        name: user.name,
        mutualFollowers: user.mutualFollowers || 0,
        isFollowing: true,
        avatar: user.avatar,
      })

      toast({
        title: "Following",
        description: `You are now following ${user.name}`,
      })
    }
  }

  // Create a function to generate a username from a name
  const generateUsername = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "")
  }

  return (
    <aside className={cn("pt-0", className)}>
      <div className="space-y-6">
        <Card className="mt-0">
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Following</CardTitle>
          </CardHeader>
          <CardContent className="px-4 py-2">
            {allFollowing.length > 0 ? (
              <div className="space-y-3">
                {allFollowing.map((contact) => (
                  <div key={contact.id}>
                    <Link
                      href={`/profile/${generateUsername(contact.name)}`}
                      className="flex items-center gap-3 rounded-md py-2 px-2 w-full text-foreground hover:bg-muted transition-colors"
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage
                            src={contact.avatar || "/placeholder.svg?height=40&width=40"}
                            alt={contact.name}
                          />
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
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">You are not following any contacts yet</div>
            )}
          </CardContent>
        </Card>

        {/* Separate card for suggestions */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-lg">Suggestions</CardTitle>
          </CardHeader>
          <CardContent className="px-4 py-2">
            {suggestions.length > 0 ? (
              <div className="space-y-3">
                {suggestions.map((contact) => (
                  <div key={contact.id} className="flex items-center justify-between">
                    <Link
                      href={`/profile/${generateUsername(contact.name)}`}
                      className="flex items-center gap-3 rounded-md py-2 px-2 text-foreground hover:bg-muted transition-colors"
                    >
                      <div className="relative">
                        <Avatar>
                          <AvatarImage
                            src={contact.avatar || "/placeholder.svg?height=40&width=40"}
                            alt={contact.name}
                          />
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
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-6 text-muted-foreground">No suggestions available</div>
            )}
          </CardContent>
        </Card>
      </div>
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

```ts file="lib/shared-state.ts"
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


```

