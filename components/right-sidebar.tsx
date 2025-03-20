import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Gift, Plus, Video } from "lucide-react"

interface RightSidebarProps {
  className?: string
}

export default function RightSidebar({ className }: RightSidebarProps) {
  return (
    <aside className={cn("py-4", className)}>
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Birthdays</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-start gap-3">
              <Gift className="h-5 w-5 text-blue-600 mt-0.5" />
              <p className="text-sm">
                <Link href="/profile/sarah" className="font-semibold hover:underline">
                  Sarah Johnson
                </Link>{" "}
                and{" "}
                <Link href="/birthdays" className="hover:underline">
                  2 others
                </Link>{" "}
                have birthdays today.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-lg">Contacts</CardTitle>
            <div className="flex gap-2">
              <Button variant="ghost" size="icon">
                <Video className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="icon">
                <Plus className="h-4 w-4" />
              </Button>
            </div>
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
                  href={`/profile/${contact.name.toLowerCase().replace(" ", "")}`}
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

        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Friend Requests</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Jessica" />
                <AvatarFallback>JT</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-medium">Jessica Taylor</div>
                <div className="text-xs text-muted-foreground">3 mutual friends</div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" className="h-8">
                    Confirm
                  </Button>
                  <Button size="sm" variant="outline" className="h-8">
                    Delete
                  </Button>
                </div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Robert" />
                <AvatarFallback>RW</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="font-medium">Robert Wilson</div>
                <div className="text-xs text-muted-foreground">1 mutual friend</div>
                <div className="flex gap-2 mt-2">
                  <Button size="sm" className="h-8">
                    Confirm
                  </Button>
                  <Button size="sm" variant="outline" className="h-8">
                    Delete
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </aside>
  )
}

