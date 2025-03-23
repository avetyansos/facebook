"use client"

import Link from "next/link"
import { Bell, Home, Menu, User, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { useToast } from "@/hooks/use-toast"

export default function Navbar() {
  const { toast } = useToast()

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
      <div className="container mx-auto max-w-7xl">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center">
              <div className="bg-primary text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold">
                f
              </div>
            </Link>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              <Home className="h-6 w-6" />
            </Link>
            <Link href="/friends" className="text-foreground hover:text-primary transition-colors">
              <Users className="h-6 w-6" />
            </Link>
            <Link href="/notifications" className="text-foreground hover:text-primary transition-colors">
              <Bell className="h-6 w-6" />
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="md:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="left">
                <nav className="flex flex-col gap-4 mt-8">
                  <Link
                    href="/"
                    className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                  >
                    <Home className="h-5 w-5" />
                    <span>Home</span>
                  </Link>
                  <Link
                    href="/friends"
                    className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                  >
                    <Users className="h-5 w-5" />
                    <span>Friends</span>
                  </Link>
                  <Link
                    href="/notifications"
                    className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                  >
                    <Bell className="h-5 w-5" />
                    <span>Notifications</span>
                  </Link>
                  <Link
                    href="/profile/johndoe"
                    className="flex items-center gap-2 text-foreground hover:text-primary transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </header>
  )
}

