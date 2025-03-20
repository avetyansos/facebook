"use client"

import Link from "next/link"
import { Bell, Home, Menu, MessageSquare, Search, User, Users } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useState } from "react"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-background border-b">
      <div className="container mx-auto max-w-7xl">
        <div className="flex h-16 items-center justify-between px-4 md:px-6">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center">
              <div className="bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-2xl font-bold">
                f
              </div>
            </Link>
            <div className="hidden md:flex relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search SocialConnect" className="w-[300px] pl-9" />
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-foreground hover:text-blue-600 transition-colors">
              <Home className="h-6 w-6" />
            </Link>
            <Link href="/friends" className="text-foreground hover:text-blue-600 transition-colors">
              <Users className="h-6 w-6" />
            </Link>
            <Link href="/messages" className="text-foreground hover:text-blue-600 transition-colors">
              <MessageSquare className="h-6 w-6" />
            </Link>
            <Link href="/notifications" className="text-foreground hover:text-blue-600 transition-colors">
              <Bell className="h-6 w-6" />
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search className="h-5 w-5" />
            </Button>

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
                    className="flex items-center gap-2 text-foreground hover:text-blue-600 transition-colors"
                  >
                    <Home className="h-5 w-5" />
                    <span>Home</span>
                  </Link>
                  <Link
                    href="/friends"
                    className="flex items-center gap-2 text-foreground hover:text-blue-600 transition-colors"
                  >
                    <Users className="h-5 w-5" />
                    <span>Friends</span>
                  </Link>
                  <Link
                    href="/messages"
                    className="flex items-center gap-2 text-foreground hover:text-blue-600 transition-colors"
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span>Messages</span>
                  </Link>
                  <Link
                    href="/notifications"
                    className="flex items-center gap-2 text-foreground hover:text-blue-600 transition-colors"
                  >
                    <Bell className="h-5 w-5" />
                    <span>Notifications</span>
                  </Link>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 text-foreground hover:text-blue-600 transition-colors"
                  >
                    <User className="h-5 w-5" />
                    <span>Profile</span>
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="icon" className="rounded-full">
                  <Avatar>
                    <AvatarImage src="/placeholder-user.jpg" alt="User" />
                    <AvatarFallback>JD</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>My Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link href="/profile">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {isSearchOpen && (
          <div className="md:hidden p-4 border-t">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input placeholder="Search SocialConnect" className="w-full pl-9" />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

