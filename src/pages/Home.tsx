import { AppSidebar } from "../components/AppSidebar"
import MainScreen from "../components/MainScreen"
import { SidebarProvider } from "../components/ui/sidebar"

const Home = () => {
  return (
    <div className="flex h-screen w-full overflow-hidden">
      <SidebarProvider>
        <AppSidebar />
        <main className="w-full">
          <MainScreen />
        </main>
      </SidebarProvider>
    </div>
  )
}

export default Home
