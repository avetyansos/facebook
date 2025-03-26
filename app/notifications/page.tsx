"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { X } from "lucide-react"
import Navbar from "@/components/navbar"
import {
  getActiveNotifications,
  markNotificationAsRead,
  removeNotification,
  markAllNotificationsAsRead,
} from "@/lib/shared-state"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(getActiveNotifications())

  // Update notifications when global state changes
  useEffect(() => {
    setNotifications(getActiveNotifications())
  }, [])

  const handleMarkAsRead = (id: number) => {
    markNotificationAsRead(id)
    setNotifications(getActiveNotifications())
  }

  const handleRemoveNotification = (id: number) => {
    removeNotification(id)
    setNotifications(getActiveNotifications())
  }

  const handleMarkAllAsRead = () => {
    markAllNotificationsAsRead()
    setNotifications(getActiveNotifications())
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto max-w-7xl py-8 pt-24">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle>Notifications</CardTitle>
            <Button variant="outline" onClick={handleMarkAllAsRead}>
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
                            onClick={() => handleMarkAsRead(notification.id)}
                            title="Mark as read"
                          >
                            <div className="h-2 w-2 rounded-full bg-primary"></div>
                          </Button>
                        )}
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={() => handleRemoveNotification(notification.id)}
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

