import { Button } from "@/components/ui/button"
import { Card, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Edit, MoreHorizontal, Search, Send, Settings } from "lucide-react"

export default function MessagesPage() {
  return (
    <div className="container py-6">
      <Card className="h-[calc(100vh-120px)] overflow-hidden">
        <div className="grid h-full" style={{ gridTemplateColumns: "300px 1fr" }}>
          <div className="border-r">
            <CardHeader className="px-4 py-3 flex flex-row items-center justify-between">
              <CardTitle className="text-xl">Chats</CardTitle>
              <div className="flex gap-1">
                <Button variant="ghost" size="icon">
                  <Settings className="h-5 w-5" />
                </Button>
                <Button variant="ghost" size="icon">
                  <Edit className="h-5 w-5" />
                </Button>
              </div>
            </CardHeader>
            <div className="p-3 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                <Input placeholder="Search messages" className="pl-9" />
              </div>
            </div>
            <div className="overflow-y-auto" style={{ height: "calc(100% - 120px)" }}>
              <div className="bg-muted/50 p-3 border-l-4 border-blue-600">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Avatar>
                      <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Alex" />
                      <AvatarFallback>AJ</AvatarFallback>
                    </Avatar>
                    <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-1 ring-background"></span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex justify-between items-baseline">
                      <div className="font-medium truncate">Alex Johnson</div>
                      <div className="text-xs text-muted-foreground">2m</div>
                    </div>
                    <div className="text-sm truncate">Hey, how's it going?</div>
                  </div>
                </div>
              </div>

              {Array.from({ length: 10 }).map((_, i) => (
                <div key={`chat-${i}`} className="p-3 hover:bg-muted/30 transition-colors cursor-pointer">
                  <div className="flex items-center gap-3">
                    <div className="relative">
                      <Avatar>
                        <AvatarImage
                          src={`/placeholder.svg?height=40&width=40&text=Chat ${i + 1}`}
                          alt={`Chat ${i + 1}`}
                        />
                        <AvatarFallback>C{i + 1}</AvatarFallback>
                      </Avatar>
                      {i % 3 === 0 && (
                        <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 ring-1 ring-background"></span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex justify-between items-baseline">
                        <div className="font-medium truncate">Contact {i + 1}</div>
                        <div className="text-xs text-muted-foreground">{Math.floor(Math.random() * 12) + 1}h</div>
                      </div>
                      <div className="text-sm truncate">
                        {i % 2 === 0 ? "You: " : ""}
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit.
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex flex-col h-full">
            <div className="p-3 border-b flex items-center justify-between">
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Alex" />
                  <AvatarFallback>AJ</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">Alex Johnson</div>
                  <div className="text-xs text-green-600">Active now</div>
                </div>
              </div>
              <Button variant="ghost" size="icon">
                <MoreHorizontal className="h-5 w-5" />
              </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              <div className="flex justify-start">
                <div className="bg-muted rounded-lg rounded-tl-none px-4 py-2 max-w-[80%]">
                  <p>Hey, how's it going?</p>
                  <div className="text-xs text-muted-foreground mt-1">10:30 AM</div>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="bg-blue-600 text-white rounded-lg rounded-tr-none px-4 py-2 max-w-[80%]">
                  <p>Not bad! Just working on a new project. How about you?</p>
                  <div className="text-xs text-blue-100 mt-1">10:32 AM</div>
                </div>
              </div>

              <div className="flex justify-start">
                <div className="bg-muted rounded-lg rounded-tl-none px-4 py-2 max-w-[80%]">
                  <p>I'm good too! Just saw your post about the hiking trip. Looks amazing!</p>
                  <div className="text-xs text-muted-foreground mt-1">10:34 AM</div>
                </div>
              </div>

              <div className="flex justify-end">
                <div className="bg-blue-600 text-white rounded-lg rounded-tr-none px-4 py-2 max-w-[80%]">
                  <p>Thanks! It was incredible. We should plan a trip together sometime.</p>
                  <div className="text-xs text-blue-100 mt-1">10:36 AM</div>
                </div>
              </div>

              <div className="flex justify-start">
                <div className="bg-muted rounded-lg rounded-tl-none px-4 py-2 max-w-[80%]">
                  <p>Definitely! I'm free next weekend if you want to plan something.</p>
                  <div className="text-xs text-muted-foreground mt-1">10:38 AM</div>
                </div>
              </div>
            </div>

            <div className="p-3 border-t">
              <div className="flex gap-2">
                <Input placeholder="Type a message..." className="flex-1" />
                <Button size="icon">
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </Card>
    </div>
  )
}

