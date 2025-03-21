"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Gift, Plus, Video, Check, X } from "lucide-react"
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
import { useToast } from "@/components/ui/use-toast"

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
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Birthdays</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <Gift className="h-5 w-5 text-primary mt-0.5" />
              <p className="text-sm">
                <Link href="/profile/sarahjohnson" className="font-semibold hover:underline">
                  Sarah Johnson
                </Link>{" "}
                and{" "}
                <Link
                  href="/"
                  onClick={(e) => {
                    e.preventDefault()
                    toast({
                      title: "Feature not available",
                      description: "Birthdays feature is not available in the current version.",
                    })
                  }}
                  className="hover:underline"
                >
                  2 others
                </Link>{" "}
                have birthdays today.
              </p>
            </div>
          </CardContent>
        </Card>

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
                <div className="flex gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      toast({
                        title: "Feature not available",
                        description: "Video call feature is not available in the current version.",
                      })
                    }
                  >
                    <Video className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      toast({
                        title: "Feature not available",
                        description: "Add contact feature is not available in the current version.",
                      })
                    }
                  >
                    <Plus className="h-4 w-4" />
                  </Button>
                </div>
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

