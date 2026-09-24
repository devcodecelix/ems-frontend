import useSidebarStore from "../store/useSidebarStore"
import Applications from "./main-screens/Applications"
import Dashboard from "./main-screens/Dashboard"
import DashboardNavbar from "./DashboardNavbar"
import Project from "./main-screens/Project"
import Profile from "./main-screens/Profile"
import Teams from "./main-screens/Teams"
import Attendance from "./main-screens/Attendance"

const MainScreen = () => {
    const { sidebarState } = useSidebarStore()
    return (
        <div className="flex h-screen w-full overflow-hidden bg-[#F7F8F8]">
            <div className="flex h-full w-full flex-col">
                <DashboardNavbar />

                <main className="px-5 py-5 h-full overflow-y-auto custom-scrollbar">
                    {sidebarState === "dashboard" && <Dashboard />}
                    {sidebarState === "teams" && <Teams />}
                    {sidebarState === "applications" && <Applications />}
                    {sidebarState === "attendance" && <Attendance />}
                    {sidebarState === "projects" && <Project />}
                    {sidebarState === "profile" && <Profile />}
                </main>

            </div>
        </div>
    )
}

export default MainScreen
