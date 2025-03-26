"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

interface CreatePostProps {
  onPostSubmit: (content: string) => void
}

export default function CreatePost({ onPostSubmit }: CreatePostProps) {
  const [postText, setPostText] = useState("")
  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const { toast } = useToast()

  const handleSubmit = () => {
    if (!postText.trim()) return

    // Call the onPostSubmit function to add the post to the timeline
    onPostSubmit(postText)

    // Show success toast
    toast({
      title: "Post created",
      description: "Your post has been published successfully!",
    })

    // Reset state and close dialog
    setPostText("")
    setIsDialogOpen(false)
  }

  return (
    <Card className="mb-6 mt-0">
      <CardHeader className="pb-3">
        <div className="flex gap-3">
          <Avatar>
            <AvatarImage src="/placeholder-user.jpg" alt="User" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>

          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" className="h-10 w-full justify-start text-muted-foreground rounded-full">
                What&apos;s on your mind, John?
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle className="text-center">Create Post</DialogTitle>
              </DialogHeader>
              <div className="flex items-center gap-3 py-2">
                <Avatar>
                  <AvatarImage src="/placeholder-user.jpg" alt="User" />
                  <AvatarFallback>JD</AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-medium">John Doe</div>
                </div>
              </div>

              <div className="bg-white p-3 rounded-md">
                <Textarea
                  placeholder="What's on your mind, John?"
                  className="min-h-[120px] border-none shadow-none resize-none focus-visible:ring-0 bg-white"
                  value={postText}
                  onChange={(e) => setPostText(e.target.value)}
                  autoFocus
                />
              </div>

              <Button className="w-full mt-4" disabled={!postText.trim()} onClick={handleSubmit} type="button">
                Post
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
    </Card>
  )
}

