"use client"

import type React from "react"

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
import { useRouter } from "next/navigation"
import { useToast } from "@/hooks/use-toast"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

export default function Navbar() {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()
  const { toast } = useToast()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    // Use a more direct approach to show the toast
    toast({
      title: "Search Not Available",
      description: "The search functionality is not implemented in this version.",
      variant: "destructive",
    })
  }

  const handleMessagesClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault()
    router.push("/messages")
  }

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
            <div className="hidden md:flex relative">
              <form onSubmit={handleSearch} className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search SocialConnect (Not Available)"
                  className="w-[300px] pl-9"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </form>
            </div>
          </div>

          <nav className="hidden md:flex items-center gap-6">
            <Link href="/" className="text-foreground hover:text-primary transition-colors">
              <Home className="h-6 w-6" />
            </Link>
            <Link href="/friends" className="text-foreground hover:text-primary transition-colors">
              <Users className="h-6 w-6" />
            </Link>
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Link
                    href="/messages"
                    onClick={handleMessagesClick}
                    className="text-muted-foreground hover:text-primary transition-colors relative"
                  >
                    <MessageSquare className="h-6 w-6" />
                    <span className="absolute -top-1 -right-1 text-primary text-[10px] rounded-full w-4 h-4 flex items-center justify-center">
                      !
                    </span>
                  </Link>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Messages feature not available</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            <Link href="/notifications" className="text-foreground hover:text-primary transition-colors">
              <Bell className="h-6 w-6" />
            </Link>
          </nav>

          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={() => {
                if (isSearchOpen) {
                  setIsSearchOpen(false)
                } else {
                  setIsSearchOpen(true)
                }
              }}
            >
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
                  <div
                    className="flex items-center gap-2 text-muted-foreground cursor-pointer"
                    onClick={() => {
                      router.push("/messages")
                    }}
                  >
                    <MessageSquare className="h-5 w-5" />
                    <span>Messages</span>
                    <span className="ml-2 text-xs text-muted-foreground">Not Available</span>
                  </div>
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
                  <Link href="/profile/johndoe">Profile</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() =>
                    toast({
                      title: "Logged out",
                      description: "You have been logged out successfully!",
                    })
                  }
                >
                  Log out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {isSearchOpen && (
          <div className="md:hidden p-4 border-t">
            <form onSubmit={handleSearch} className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search SocialConnect (Not Available)"
                className="w-full pl-9"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </form>
          </div>
        )}
      </div>
    </header>
  )
}

