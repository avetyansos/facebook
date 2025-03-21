import Navbar from "@/components/navbar"
import Sidebar from "@/components/sidebar"
import RightSidebar from "@/components/right-sidebar"
import NewsFeed from "@/components/news-feed"

export default function Home() {
  return (
    <>
      <Navbar />
      <div className="container mx-auto max-w-7xl pt-16">
        <div className="flex flex-col md:flex-row gap-4 p-4">
          <div className="hidden md:block md:w-1/4 lg:w-1/5">
            <Sidebar className="sticky top-20" />
          </div>
          <main className="flex-1 md:w-2/4 lg:w-3/5">
            <NewsFeed />
          </main>
          <div className="hidden lg:block lg:w-1/5">
            <RightSidebar className="sticky top-20" />
          </div>
        </div>
      </div>
    </>
  )
}

