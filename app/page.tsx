import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import NewsFeed from "@/components/news-feed"
import Sidebar from "@/components/sidebar"
import RightSidebar from "@/components/right-sidebar"

export default function Home() {
  return (
    <div className="flex flex-col md:flex-row gap-4 px-4 py-6">
      <Sidebar className="hidden md:block w-[240px] lg:w-[280px] shrink-0" />

      <div className="flex-1 max-w-3xl mx-auto w-full">
        <Tabs defaultValue="foryou" className="mb-6">
          <TabsList className="w-full">
            <TabsTrigger value="foryou" className="flex-1">
              For You
            </TabsTrigger>
            <TabsTrigger value="friends" className="flex-1">
              Friends
            </TabsTrigger>
            <TabsTrigger value="groups" className="flex-1">
              Groups
            </TabsTrigger>
          </TabsList>
          <TabsContent value="foryou">
            <NewsFeed />
          </TabsContent>
          <TabsContent value="friends">
            <NewsFeed filter="friends" />
          </TabsContent>
          <TabsContent value="groups">
            <NewsFeed filter="groups" />
          </TabsContent>
        </Tabs>
      </div>

      <RightSidebar className="hidden lg:block w-[280px] shrink-0" />
    </div>
  )
}

