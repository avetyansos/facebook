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

