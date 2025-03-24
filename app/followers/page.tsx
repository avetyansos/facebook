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

