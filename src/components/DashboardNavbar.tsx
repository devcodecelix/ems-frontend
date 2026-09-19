import { Mail, ChevronDown, LogOut } from "lucide-react";
import { SidebarTrigger } from "./ui/sidebar";
import { Separator } from "./ui/separator";
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuGroup,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import useSidebarStore from "../store/useSidebarStore";
import useAuthStore from "../store/useAuthStore";

const DashboardNavbar = () => {
    const { user, logout } = useAuthStore();
    const { sidebarState } = useSidebarStore();

    const handleLogout = () => {
        logout();
    };

    const emailInitial = user?.email?.[0]?.toUpperCase() || "?";

    const AccountMenuContent = () => (
        <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuGroup>
                <DropdownMenuLabel className="font-normal">
                    <p className="text-xs text-slate-400">Signed in as</p>
                    <p className="text-sm font-medium text-slate-900 truncate mt-0.5">
                        {user?.email || "Unknown"}
                    </p>
                </DropdownMenuLabel>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                    onClick={handleLogout}
                    className="text-red-500 focus:text-red-600 focus:bg-red-50 cursor-pointer"
                >
                    <LogOut className="h-4 w-4" />
                    Logout
                </DropdownMenuItem>
            </DropdownMenuGroup>
        </DropdownMenuContent>
    );

    return (
        <header className="w-full border-b border-slate-200 bg-white/90 backdrop-blur-xl">
            <div className="flex min-h-21 items-center justify-between gap-4 px-4 sm:px-6">
                {/* Left Side */}
                <div className="flex min-w-0 items-center gap-3 sm:gap-4">
                    <SidebarTrigger className="text-slate-500 hover:text-slate-900" />
                    <Separator orientation="vertical" className="h-6 hidden sm:block" />

                    <div className="flex min-w-0 items-center gap-3">
                        {sidebarState === "create-resume" && (
                            <div className="flex items-center gap-4">
                                <div>
                                    <h1 className="text-xl font-extrabold md:text-2xl">
                                        Create Resume
                                    </h1>
                                    <p className="text-sm text-gray-600 md:text-base">
                                        Create Your Professional Resume
                                    </p>
                                </div>
                            </div>
                        )}

                        <div className="h-full flex items-center justify-center">
                            <h1 className="text-xl font-bold text-gray-900 sm:text-2xl">
                                {sidebarState === "dashboard" && "Dashboard"}
                                {sidebarState === "teams" && "Teams"}
                                {sidebarState === "interns" && "Interns"}
                                {sidebarState === "applications" && "Applications"}
                                {sidebarState === "projects" && "Projects"}
                                {sidebarState === "profile" && "Profile"}
                            </h1>
                        </div>
                    </div>
                </div>

                {/* Right Side */}
                <div className="flex shrink-0 items-center gap-3">
                    {/* Desktop trigger */}
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <button
                                    type="button"
                                    className="hidden sm:flex items-center gap-2 rounded-full border border-slate-200 bg-slate-50 px-3 py-1.5 hover:bg-slate-100 hover:border-slate-300 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                                >
                                    <Mail className="h-3.5 w-3.5 text-slate-400" />
                                    <p className="max-w-40 truncate text-xs font-medium text-slate-600">
                                        {user?.email || "Email"}
                                    </p>
                                    <ChevronDown className="h-3.5 w-3.5 text-slate-400" />
                                </button>
                            }
                        />

                        <AccountMenuContent />
                    </DropdownMenu>

                    {/* Mobile Avatar trigger */}
                    <DropdownMenu>
                        <DropdownMenuTrigger
                            render={
                                <button
                                    type="button"
                                    className="sm:hidden flex h-8 w-8 items-center justify-center rounded-full bg-slate-100 text-xs font-semibold text-slate-600 hover:bg-slate-200 transition-colors cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-slate-300"
                                >
                                    {emailInitial}
                                </button>
                            }
                        />

                        <AccountMenuContent />
                    </DropdownMenu>
                </div>
            </div>
        </header>
    );
};

export default DashboardNavbar;
