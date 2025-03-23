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

