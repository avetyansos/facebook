"use client"

import type React from "react"

import Link from "next/link"
import {
  Bookmark,
  Calendar,
  ChevronDown,
  Clock,
  Flag,
  Gamepad2,
  Heart,
  Home,
  LayoutGrid,
  MessageSquare,
  Newspaper,
  Store,
  Users,
  Video,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useState } from "react"
import { useToast } from "@/hooks/use-toast"
import { useRouter } from "next/navigation"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface SidebarProps {
  className?: string
}

export default function Sidebar({ className }: SidebarProps) {
  const [showMore, setShowMore] = useState(false)
  const { toast } = useToast()
  const router = useRouter()

  const handleUnavailableLink = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    // Use a more direct approach to show the toast
    toast({
      title: "Feature not available",
      description: "This feature is not available in the current version.",
    })
  }

  // Create a button handler for unavailable features
  const handleUnavailableButton = () => {
    toast({
      title: "Feature not available",
      description: "This feature is not available in the current version.",
    })
  }

  return (
    <aside className={cn("py-4", className)}>
      <div className="space-y-4">
        <div className="px-3">
          <Link href="/profile/johndoe" className="flex items-center gap-3 py-2">
            <Avatar>
              <AvatarImage src="/placeholder-user.jpg" alt="User" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <span className="font-medium">John Doe</span>
          </Link>
        </div>

        <div className="space-y-1 px-3">
          <Link
            href="/"
            className="flex items-center gap-3 rounded-md py-2 text-foreground hover:bg-muted transition-colors"
          >
            <Home className="h-5 w-5 text-primary" />
            <span>Home</span>
          </Link>
          <Link
            href="/friends"
            className="flex items-center gap-3 rounded-md py-2 text-foreground hover:bg-muted transition-colors"
          >
            <Users className="h-5 w-5 text-primary" />
            <span>Friends</span>
          </Link>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div
                  className="flex items-center gap-3 rounded-md py-2 text-muted-foreground cursor-pointer"
                  onClick={() => router.push("/messages")}
                >
                  <MessageSquare className="h-5 w-5 text-muted-foreground" />
                  <span>Messages</span>
                  <span className="ml-2 text-xs text-muted-foreground">Not Available</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Messages feature not available</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>

          {/* Change these to buttons for better reliability */}
          <Button
            variant="ghost"
            className="w-full justify-start px-0 gap-3 rounded-md py-2 text-foreground hover:bg-muted transition-colors"
            onClick={handleUnavailableButton}
          >
            <Bookmark className="h-5 w-5 text-purple-600" />
            <span>Saved</span>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start px-0 gap-3 rounded-md py-2 text-foreground hover:bg-muted transition-colors"
            onClick={handleUnavailableButton}
          >
            <LayoutGrid className="h-5 w-5 text-primary" />
            <span>Groups</span>
          </Button>

          <Button
            variant="ghost"
            className="w-full justify-start px-0 gap-3 rounded-md py-2 text-foreground hover:bg-muted transition-colors"
            onClick={handleUnavailableButton}
          >
            <Store className="h-5 w-5 text-primary" />
            <span>Marketplace</span>
          </Button>

          {showMore && (
            <>
              <Button
                variant="ghost"
                className="w-full justify-start px-0 gap-3 rounded-md py-2 text-foreground hover:bg-muted transition-colors"
                onClick={handleUnavailableButton}
              >
                <Video className="h-5 w-5 text-primary" />
                <span>Watch</span>
              </Button>

              <Button
                variant="ghost"
                className="w-full justify-start px-0 gap-3 rounded-md py-2 text-foreground hover:bg-muted transition-colors"
                onClick={handleUnavailableButton}
              >
                <Clock className="h-5 w-5 text-primary" />
                <span>Memories</span>
              </Button>
            </>
          )}

          <Button variant="ghost" className="w-full justify-start gap-3 px-3" onClick={() => setShowMore(!showMore)}>
            <ChevronDown className={`h-5 w-5 transition-transform ${showMore ? "rotate-180" : ""}`} />
            <span>{showMore ? "See less" : "See more"}</span>
          </Button>
        </div>

        <div className="border-t pt-4">
          <h3 className="px-3 text-sm font-semibold text-muted-foreground mb-2">Your shortcuts</h3>
          <div className="space-y-1 px-3">
            <Button
              variant="ghost"
              className="w-full justify-start px-0 gap-3 rounded-md py-2 text-foreground hover:bg-muted transition-colors"
              onClick={handleUnavailableButton}
            >
              <Gamepad2 className="h-5 w-5 text-green-600" />
              <span>Games</span>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start px-0 gap-3 rounded-md py-2 text-foreground hover:bg-muted transition-colors"
              onClick={handleUnavailableButton}
            >
              <Calendar className="h-5 w-5 text-red-600" />
              <span>Events</span>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start px-0 gap-3 rounded-md py-2 text-foreground hover:bg-muted transition-colors"
              onClick={handleUnavailableButton}
            >
              <Newspaper className="h-5 w-5 text-orange-600" />
              <span>News Feed</span>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start px-0 gap-3 rounded-md py-2 text-foreground hover:bg-muted transition-colors"
              onClick={handleUnavailableButton}
            >
              <Heart className="h-5 w-5 text-pink-600" />
              <span>Fundraisers</span>
            </Button>

            <Button
              variant="ghost"
              className="w-full justify-start px-0 gap-3 rounded-md py-2 text-foreground hover:bg-muted transition-colors"
              onClick={handleUnavailableButton}
            >
              <Flag className="h-5 w-5 text-primary" />
              <span>Pages</span>
            </Button>
          </div>
        </div>

        <div className="px-3 text-xs text-muted-foreground">
          <div className="flex flex-wrap gap-2 mt-4">
            <Button
              variant="link"
              className="h-auto p-0 text-xs text-muted-foreground"
              onClick={handleUnavailableButton}
            >
              Privacy
            </Button>
            <span>·</span>
            <Button
              variant="link"
              className="h-auto p-0 text-xs text-muted-foreground"
              onClick={handleUnavailableButton}
            >
              Terms
            </Button>
            <span>·</span>
            <Button
              variant="link"
              className="h-auto p-0 text-xs text-muted-foreground"
              onClick={handleUnavailableButton}
            >
              Advertising
            </Button>
            <span>·</span>
            <Button
              variant="link"
              className="h-auto p-0 text-xs text-muted-foreground"
              onClick={handleUnavailableButton}
            >
              Cookies
            </Button>
            <span>·</span>
            <Button
              variant="link"
              className="h-auto p-0 text-xs text-muted-foreground"
              onClick={handleUnavailableButton}
            >
              More
            </Button>
          </div>
          <div className="mt-2">© 2025 SocialConnect</div>
        </div>
      </div>
    </aside>
  )
}

