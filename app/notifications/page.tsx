import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Bell, Check, Settings } from "lucide-react"

export default function NotificationsPage() {
  return (
    <div className="container py-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle className="text-2xl">Notifications</CardTitle>
          <Button variant="ghost" size="icon">
            <Settings className="h-5 w-5" />
          </Button>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="all">
            <TabsList className="mb-4">
              <TabsTrigger value="all">All</TabsTrigger>
              <TabsTrigger value="unread">Unread</TabsTrigger>
            </TabsList>

            <TabsContent value="all">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50 border-l-4 border-blue-600">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Sarah" />
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p>
                      <span className="font-medium">Sarah Johnson</span> commented on your post: "Great photo! Where was
                      this taken?"
                    </p>
                    <div className="text-xs text-muted-foreground mt-1">2 hours ago</div>
                  </div>
                  <Button variant="ghost" size="icon" className="mt-1">
                    <Check className="h-4 w-4" />
                  </Button>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Alex" />
                    <AvatarFallback>AJ</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p>
                      <span className="font-medium">Alex Johnson</span> liked your photo.
                    </p>
                    <div className="text-xs text-muted-foreground mt-1">5 hours ago</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Tech" />
                    <AvatarFallback>TI</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p>
                      <span className="font-medium">Tech Innovations</span> posted a new update: "Exciting news coming
                      next week!"
                    </p>
                    <div className="text-xs text-muted-foreground mt-1">1 day ago</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Emily" />
                    <AvatarFallback>ES</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p>
                      <span className="font-medium">Emily Smith</span> tagged you in a photo.
                    </p>
                    <div className="text-xs text-muted-foreground mt-1">2 days ago</div>
                  </div>
                </div>

                <div className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors">
                  <div className="bg-blue-100 text-blue-600 rounded-full w-10 h-10 flex items-center justify-center">
                    <Bell className="h-5 w-5" />
                  </div>
                  <div className="flex-1">
                    <p>
                      You have a memory from <span className="font-medium">3 years ago</span> to look back on.
                    </p>
                    <div className="text-xs text-muted-foreground mt-1">3 days ago</div>
                  </div>
                </div>

                {Array.from({ length: 5 }).map((_, i) => (
                  <div
                    key={`notification-${i}`}
                    className="flex items-start gap-4 p-3 rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <Avatar>
                      <AvatarImage
                        src={`/placeholder.svg?height=40&width=40&text=User ${i + 1}`}
                        alt={`User ${i + 1}`}
                      />
                      <AvatarFallback>U{i + 1}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <p>
                        <span className="font-medium">User {i + 1}</span>{" "}
                        {i % 2 === 0 ? "liked your post." : "commented on your photo."}
                      </p>
                      <div className="text-xs text-muted-foreground mt-1">{i + 4} days ago</div>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="unread">
              <div className="space-y-4">
                <div className="flex items-start gap-4 p-3 rounded-lg bg-muted/50 border-l-4 border-blue-600">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Sarah" />
                    <AvatarFallback>SJ</AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <p>
                      <span className="font-medium">Sarah Johnson</span> commented on your post: "Great photo! Where was
                      this taken?"
                    </p>
                    <div className="text-xs text-muted-foreground mt-1">2 hours ago</div>
                  </div>
                  <Button variant="ghost" size="icon" className="mt-1">
                    <Check className="h-4 w-4" />
                  </Button>
                </div>

                <div className="p-6 text-center text-muted-foreground">
                  <p>No more unread notifications.</p>
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  )
}

