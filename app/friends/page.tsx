import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Search, UserPlus, X } from "lucide-react"

export default function FriendsPage() {
  return (
    <div className="container py-6">
      <div className="flex flex-col md:flex-row gap-6">
        <div className="md:w-1/4">
          <Card>
            <CardHeader>
              <CardTitle>Friends</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              <div className="border-b">
                <div className="relative p-3">
                  <Search className="absolute left-6 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search Friends"
                    className="pl-8 h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                  />
                </div>
              </div>
              <nav className="space-y-1 p-3">
                <a href="#" className="flex items-center gap-3 rounded-md bg-muted p-2 font-medium">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                    />
                  </svg>
                  <span>Home</span>
                </a>
                <a href="#" className="flex items-center gap-3 rounded-md p-2 text-muted-foreground hover:bg-muted">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z"
                    />
                  </svg>
                  <span>Friend Requests</span>
                </a>
                <a href="#" className="flex items-center gap-3 rounded-md p-2 text-muted-foreground hover:bg-muted">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"
                    />
                  </svg>
                  <span>All Friends</span>
                </a>
                <a href="#" className="flex items-center gap-3 rounded-md p-2 text-muted-foreground hover:bg-muted">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"
                    />
                  </svg>
                  <span>Birthdays</span>
                </a>
                <a href="#" className="flex items-center gap-3 rounded-md p-2 text-muted-foreground hover:bg-muted">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>Recently Active</span>
                </a>
              </nav>
            </CardContent>
          </Card>
        </div>

        <div className="md:w-3/4">
          <Tabs defaultValue="suggestions">
            <TabsList className="w-full">
              <TabsTrigger value="suggestions" className="flex-1">
                Suggestions
              </TabsTrigger>
              <TabsTrigger value="requests" className="flex-1">
                Friend Requests
              </TabsTrigger>
              <TabsTrigger value="all" className="flex-1">
                All Friends
              </TabsTrigger>
            </TabsList>

            <TabsContent value="suggestions" className="mt-6">
              <h2 className="text-xl font-semibold mb-4">People You May Know</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 9 }).map((_, i) => (
                  <div key={`suggestion-${i}`} className="flex flex-col items-center p-4 border rounded-lg">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={`/placeholder.svg?height=96&width=96&text=Person ${i + 1}`}
                        alt={`Person ${i + 1}`}
                      />
                      <AvatarFallback>P{i + 1}</AvatarFallback>
                    </Avatar>
                    <div className="mt-3 text-center">
                      <div className="font-medium">Person {i + 1}</div>
                      <div className="text-sm text-muted-foreground">
                        {Math.floor(Math.random() * 10) + 1} mutual friends
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3 w-full">
                      <Button className="flex-1 gap-2">
                        <UserPlus className="h-4 w-4" />
                        <span>Add</span>
                      </Button>
                      <Button variant="outline" size="icon">
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="requests" className="mt-6">
              <h2 className="text-xl font-semibold mb-4">Friend Requests</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 3 }).map((_, i) => (
                  <div key={`request-${i}`} className="flex flex-col items-center p-4 border rounded-lg">
                    <Avatar className="h-24 w-24">
                      <AvatarImage
                        src={`/placeholder.svg?height=96&width=96&text=Request ${i + 1}`}
                        alt={`Request ${i + 1}`}
                      />
                      <AvatarFallback>R{i + 1}</AvatarFallback>
                    </Avatar>
                    <div className="mt-3 text-center">
                      <div className="font-medium">Request {i + 1}</div>
                      <div className="text-sm text-muted-foreground">
                        {Math.floor(Math.random() * 5) + 1} mutual friends
                      </div>
                      <div className="text-xs text-muted-foreground mt-1">
                        Sent {Math.floor(Math.random() * 10) + 1}d ago
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3 w-full">
                      <Button className="flex-1">Confirm</Button>
                      <Button variant="outline" className="flex-1">
                        Delete
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="all" className="mt-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">All Friends</h2>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <input
                    type="text"
                    placeholder="Search Friends"
                    className="pl-9 h-9 rounded-md border border-input bg-background px-3 py-1 text-sm shadow-sm transition-colors"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 12 }).map((_, i) => (
                  <div key={`friend-${i}`} className="flex items-center gap-3 p-3 border rounded-lg">
                    <Avatar>
                      <AvatarImage
                        src={`/placeholder.svg?height=40&width=40&text=Friend ${i + 1}`}
                        alt={`Friend ${i + 1}`}
                      />
                      <AvatarFallback>F{i + 1}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="font-medium">Friend {i + 1}</div>
                      <div className="text-xs text-muted-foreground">
                        {Math.floor(Math.random() * 20) + 1} mutual friends
                      </div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <span className="sr-only">Options</span>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-5 w-5"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                      </svg>
                    </Button>
                  </div>
                ))}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  )
}

