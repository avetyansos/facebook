"use client"

import Link from "next/link"
import { Home, Users } from "lucide-react"
import { cn } from "@/lib/utils"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"

interface SidebarProps {
  className?: string
}

export default function Sidebar({ className }: SidebarProps) {
  const { toast } = useToast()

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
        </div>

        <div className="px-3 text-xs text-muted-foreground">
          <div className="mt-2">© 2025 SocialConnect</div>
        </div>
      </div>
    </aside>
  )
}

