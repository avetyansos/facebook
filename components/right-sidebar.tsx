"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Check, MoreHorizontal, X } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { ToastAction } from "@/components/ui/toast"
import { useToast } from "@/hooks/use-toast"

interface FollowRequest {
  id: number
  name: string
  mutualFollowers: number
  avatar: string
  initials: string
  deleted?: boolean
}

interface RightSidebarProps {
  className?: string
}

export default function RightSidebar({ className }: RightSidebarProps) {
  const [followRequests, setFollowRequests] = useState<FollowRequest[]>([
    {
      id: 1,
      name: "Jessica Taylor",
      mutualFollowers: 3,
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "JT",
      deleted: false,
    },
    {
      id: 2,
      name: "Robert Wilson",
      mutualFollowers: 1,
      avatar: "/placeholder.svg?height=40&width=40",
      initials: "RW",
      deleted: false,
    },
  ])
  const [confirmDialogOpen, setConfirmDialogOpen] = useState(false)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedRequest, setSelectedRequest] = useState<number | null>(null)
  const { toast } = useToast()

  const handleAcceptFollow = (id: number) => {
    setSelectedRequest(id)
    setConfirmDialogOpen(true)
  }

  const handleDeleteFollow = (id: number) => {
    setSelectedRequest(id)
    setDeleteDialogOpen(true)
  }

  const confirmAcceptFollow = () => {
    if (selectedRequest !== null) {
      const requestName = followRequests.find((r) => r.id === selectedRequest)?.name || "User"
      // Mark as accepted instead of removing
      setFollowRequests(
        followRequests.map((request) => (request.id === selectedRequest ? { ...request, deleted: true } : request)),
      )
      setConfirmDialogOpen(false)

      toast({
        title: "Follow request accepted",
        description: `You are now following ${requestName}`,
        action: <ToastAction altText="Dismiss">Dismiss</ToastAction>,
      })
    }
  }

  const confirmDeleteFollow = () => {
    if (selectedRequest !== null) {
      const request = followRequests.find((r) => r.id === selectedRequest)
      if (request) {
        // Mark as deleted instead of removing from array
        setFollowRequests(followRequests.map((r) => (r.id === selectedRequest ? { ...r, deleted: true } : r)))
        setDeleteDialogOpen(false)

        toast({
          title: "Follow request deleted",
          description: `Follow request from ${request.name} has been deleted`,
          action: (
            <ToastAction altText="Undo" onClick={() => undoDeleteRequest(request.id)}>
              Undo
            </ToastAction>
          ),
        })
      }
    }
  }

  const undoDeleteRequest = (id: number) => {
    // Simply mark as not deleted
    setFollowRequests(followRequests.map((request) => (request.id === id ? { ...request, deleted: false } : request)))

    const requestName = followRequests.find((r) => r.id === id)?.name || "User"
    toast({
      title: "Follow request restored",
      description: `Follow request from ${requestName} has been restored`,
    })
  }

  // Create a function to generate a username from a name
  const generateUsername = (name: string) => {
    return name.toLowerCase().replace(/\s+/g, "")
  }

  // Filter requests to show only non-deleted ones
  const activeRequests = followRequests.filter((request) => !request.deleted)

  return (
    <aside className={cn("py-4", className)}>
      <div className="space-y-6">
        <Tabs defaultValue="contacts">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="contacts" className="flex-1">
              Contacts
            </TabsTrigger>
            <TabsTrigger value="requests" className="flex-1">
              Requests {activeRequests.length > 0 && `(${activeRequests.length})`}
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
                <CardTitle className="text-lg">Follow Requests</CardTitle>
              </CardHeader>
              <CardContent>
                {activeRequests.length > 0 ? (
                  <div className="space-y-4">
                    {activeRequests.map((request) => (
                      <div key={request.id} className="p-4 border rounded-lg relative">
                        {/* Three-dot menu in top right corner */}
                        <div className="absolute top-2 right-2">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="icon" className="h-8 w-8">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleAcceptFollow(request.id)}>
                                <Check className="mr-2 h-4 w-4" />
                                <span>Confirm</span>
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteFollow(request.id)}>
                                <X className="mr-2 h-4 w-4" />
                                <span>Delete</span>
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>

                        <div className="flex flex-col sm:flex-row items-center sm:items-start gap-4">
                          <Link href={`/profile/${generateUsername(request.name)}`} className="shrink-0">
                            <Avatar className="h-16 w-16">
                              <AvatarImage src={request.avatar} alt={request.name} />
                              <AvatarFallback>{request.initials}</AvatarFallback>
                            </Avatar>
                          </Link>
                          <div className="flex-1 flex flex-col items-center sm:items-start text-center sm:text-left">
                            <div className="font-medium text-lg">
                              <Link href={`/profile/${generateUsername(request.name)}`} className="hover:underline">
                                {request.name}
                              </Link>
                            </div>
                            <div className="text-muted-foreground">{request.mutualFollowers} mutual followers</div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-4 text-muted-foreground">No follow requests to display</div>
                )}
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
              {selectedRequest !== null &&
                `Are you sure you want to accept the follow request from ${followRequests.find((r) => r.id === selectedRequest)?.name}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setConfirmDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={confirmAcceptFollow} className="gap-2">
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
              {selectedRequest !== null &&
                `Are you sure you want to delete the follow request from ${followRequests.find((r) => r.id === selectedRequest)?.name}?`}
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex gap-2 sm:justify-end">
            <Button variant="outline" onClick={() => setDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={confirmDeleteFollow} className="gap-2">
              <X className="h-4 w-4" />
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </aside>
  )
}

