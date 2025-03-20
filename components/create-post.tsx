"use client"

import type React from "react"

import { useState } from "react"
import { Camera, FileImage, Smile, Users, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Textarea } from "@/components/ui/textarea"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"

export default function CreatePost() {
  const [postText, setPostText] = useState("")
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [isDialogOpen, setIsDialogOpen] = useState(false)

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) {
      const imageUrl = URL.createObjectURL(file)
      setSelectedImage(imageUrl)
    }
  }

  const removeImage = () => {
    setSelectedImage(null)
  }

  const handleSubmit = () => {
    // Here you would handle the post submission
    console.log("Post submitted:", { text: postText, image: selectedImage })
    setPostText("")
    setSelectedImage(null)
    setIsDialogOpen(false)
  }

  return (
    <Card className="mb-6">
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
                  <Button variant="outline" size="sm" className="mt-1 h-7 gap-1">
                    <Users className="h-3.5 w-3.5" />
                    <span>Friends</span>
                  </Button>
                </div>
              </div>
              <Textarea
                placeholder="What's on your mind, John?"
                className="min-h-[120px] border-none shadow-none resize-none focus-visible:ring-0"
                value={postText}
                onChange={(e) => setPostText(e.target.value)}
              />

              {selectedImage && (
                <div className="relative mt-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white rounded-full"
                    onClick={removeImage}
                    type="button"
                  >
                    <X className="h-4 w-4" />
                  </Button>
                  <img
                    src={selectedImage || "/placeholder.svg"}
                    alt="Selected"
                    className="rounded-md max-h-[300px] w-full object-cover"
                  />
                </div>
              )}

              <div className="flex items-center justify-between border rounded-md p-3">
                <div className="font-medium">Add to your post</div>
                <div className="flex gap-2">
                  <label htmlFor="image-upload" className="cursor-pointer">
                    <div className="text-green-600 hover:bg-muted rounded-full p-2">
                      <FileImage className="h-5 w-5" />
                    </div>
                    <input
                      type="file"
                      id="image-upload"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                  </label>
                  <div className="cursor-pointer text-amber-500 hover:bg-muted rounded-full p-2">
                    <Smile className="h-5 w-5" />
                  </div>
                </div>
              </div>

              <Button
                className="w-full"
                disabled={!postText.trim() && !selectedImage}
                onClick={handleSubmit}
                type="button"
              >
                Post
              </Button>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardFooter className="border-t pt-3">
        <div className="grid grid-cols-3 gap-1 w-full">
          <Button variant="ghost" className="flex gap-2" type="button">
            <Camera className="h-5 w-5 text-red-500" />
            <span>Live</span>
          </Button>
          <label htmlFor="quick-image-upload" className="cursor-pointer">
            <Button variant="ghost" className="flex gap-2 w-full" type="button">
              <FileImage className="h-5 w-5 text-green-500" />
              <span>Photo</span>
            </Button>
            <input
              type="file"
              id="quick-image-upload"
              accept="image/*"
              className="hidden"
              onChange={(e) => {
                handleImageChange(e)
                setIsDialogOpen(true)
              }}
            />
          </label>
          <Button variant="ghost" className="flex gap-2" onClick={() => setIsDialogOpen(true)} type="button">
            <Smile className="h-5 w-5 text-yellow-500" />
            <span>Feeling</span>
          </Button>
        </div>
      </CardFooter>
    </Card>
  )
}

