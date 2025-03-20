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
  Newspaper,
  Store,
  Users,
  Video,
} from "lucide-react"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

interface SidebarProps {
  className?: string
}

export default function Sidebar({ className }: SidebarProps) {
  return (
    <aside className={cn("py-4", className)}>
      <div className="space-y-4">
        <div className="px-3">
          <Link href="/profile" className="flex items-center gap-3 py-2">
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
            <Home className="h-5 w-5 text-blue-600" />
            <span>Home</span>
          </Link>
          <Link
            href="/friends"
            className="flex items-center gap-3 rounded-md py-2 text-foreground hover:bg-muted transition-colors"
          >
            <Users className="h-5 w-5 text-blue-600" />
            <span>Friends</span>
          </Link>
          <Link
            href="/saved"
            className="flex items-center gap-3 rounded-md py-2 text-foreground hover:bg-muted transition-colors"
          >
            <Bookmark className="h-5 w-5 text-purple-600" />
            <span>Saved</span>
          </Link>
          <Link
            href="/groups"
            className="flex items-center gap-3 rounded-md py-2 text-foreground hover:bg-muted transition-colors"
          >
            <LayoutGrid className="h-5 w-5 text-blue-600" />
            <span>Groups</span>
          </Link>
          <Link
            href="/marketplace"
            className="flex items-center gap-3 rounded-md py-2 text-foreground hover:bg-muted transition-colors"
          >
            <Store className="h-5 w-5 text-blue-600" />
            <span>Marketplace</span>
          </Link>
          <Link
            href="/watch"
            className="flex items-center gap-3 rounded-md py-2 text-foreground hover:bg-muted transition-colors"
          >
            <Video className="h-5 w-5 text-blue-600" />
            <span>Watch</span>
          </Link>
          <Link
            href="/memories"
            className="flex items-center gap-3 rounded-md py-2 text-foreground hover:bg-muted transition-colors"
          >
            <Clock className="h-5 w-5 text-blue-600" />
            <span>Memories</span>
          </Link>
          <Button variant="ghost" className="w-full justify-start gap-3 px-3">
            <ChevronDown className="h-5 w-5" />
            <span>See more</span>
          </Button>
        </div>

        <div className="border-t pt-4">
          <h3 className="px-3 text-sm font-semibold text-muted-foreground mb-2">Your shortcuts</h3>
          <div className="space-y-1 px-3">
            <Link
              href="/games"
              className="flex items-center gap-3 rounded-md py-2 text-foreground hover:bg-muted transition-colors"
            >
              <Gamepad2 className="h-5 w-5 text-green-600" />
              <span>Games</span>
            </Link>
            <Link
              href="/events"
              className="flex items-center gap-3 rounded-md py-2 text-foreground hover:bg-muted transition-colors"
            >
              <Calendar className="h-5 w-5 text-red-600" />
              <span>Events</span>
            </Link>
            <Link
              href="/news"
              className="flex items-center gap-3 rounded-md py-2 text-foreground hover:bg-muted transition-colors"
            >
              <Newspaper className="h-5 w-5 text-orange-600" />
              <span>News Feed</span>
            </Link>
            <Link
              href="/fundraisers"
              className="flex items-center gap-3 rounded-md py-2 text-foreground hover:bg-muted transition-colors"
            >
              <Heart className="h-5 w-5 text-pink-600" />
              <span>Fundraisers</span>
            </Link>
            <Link
              href="/pages"
              className="flex items-center gap-3 rounded-md py-2 text-foreground hover:bg-muted transition-colors"
            >
              <Flag className="h-5 w-5 text-blue-600" />
              <span>Pages</span>
            </Link>
          </div>
        </div>

        <div className="px-3 text-xs text-muted-foreground">
          <div className="flex flex-wrap gap-2 mt-4">
            <Link href="/privacy" className="hover:underline">
              Privacy
            </Link>
            <span>·</span>
            <Link href="/terms" className="hover:underline">
              Terms
            </Link>
            <span>·</span>
            <Link href="/advertising" className="hover:underline">
              Advertising
            </Link>
            <span>·</span>
            <Link href="/cookies" className="hover:underline">
              Cookies
            </Link>
            <span>·</span>
            <Link href="/more" className="hover:underline">
              More
            </Link>
          </div>
          <div className="mt-2">© 2025 SocialConnect</div>
        </div>
      </div>
    </aside>
  )
}

