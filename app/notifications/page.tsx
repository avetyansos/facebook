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

