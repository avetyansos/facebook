import Link from "next/link"
import { SimpleButton } from "@/components/simple-button"
import { SimplePost } from "@/components/simple-post"

export default function Profile() {
  return (
    <div className="p-8">
      <header className="mb-6">
        <h1 className="text-2xl font-bold">Profile</h1>
        <nav className="mt-2">
          <Link href="/" className="text-blue-600 hover:underline">
            ← Back to Home
          </Link>
        </nav>
      </header>

      <main>
        <div className="grid gap-4">
          <div className="p-4 border rounded-md">
            <div className="flex flex-col items-center">
              <div className="w-24 h-24 bg-gray-200 rounded-full mb-4"></div>
              <h2 className="text-xl font-bold">John Doe</h2>
              <p className="text-gray-600">Software Developer</p>
              <div className="mt-4">
                <SimpleButton variant="outline">Edit Profile</SimpleButton>
              </div>
            </div>
          </div>

          <div className="p-4 border rounded-md">
            <h2 className="text-xl font-bold mb-2">About</h2>
            <p>Software Developer | Photography Enthusiast | Coffee Lover</p>
          </div>

          <div className="p-4 border rounded-md">
            <h2 className="text-xl font-bold mb-2">Recent Posts</h2>
            <div className="space-y-4">
              <SimplePost
                author="John Doe"
                content="Just finished working on an exciting new project!"
                timestamp="3 days ago"
              />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

