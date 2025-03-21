import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import Link from "next/link"
import Navbar from "@/components/navbar"
import { Construction } from "lucide-react"

export default function MessagesPage() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <div className="container mx-auto max-w-7xl py-8 pt-24">
        <Card className="border-primary/20">
          <CardHeader className="text-center pb-2">
            <Construction className="h-16 w-16 text-primary mx-auto mb-2" />
            <CardTitle className="text-2xl">Messages Feature Not Available</CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              The messaging feature is currently under development and not available in this version. We're working hard
              to bring you a great messaging experience soon!
            </p>
            <div className="flex justify-center gap-4">
              <Button asChild>
                <Link href="/">Return to Home</Link>
              </Button>
              <Button variant="outline" asChild>
                <Link href="/profile/johndoe">Go to Profile</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

