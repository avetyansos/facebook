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

