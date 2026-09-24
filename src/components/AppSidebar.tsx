import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
} from "./ui/sidebar";

import {
  LayoutDashboard,
  ClipboardList,
  UserRound,
  Users,
} from "lucide-react";

import useSidebarStore from "../store/useSidebarStore";
import useAuthStore from "../store/useAuthStore";
import useAttendanceHook from "../hooks/useAttendanceHook";

const menuItems = [
  {
    label: "Dashboard",
    menu: "dashboard",
    icon: LayoutDashboard,
    roles: ["intern", "admin"],
  },
  {
    label: "Teams",
    menu: "teams",
    icon: Users,
    roles: ["admin"],
  },
  {
    label: "Projects",
    menu: "projects",
    icon: LayoutDashboard,
    roles: ["admin", "intern"],
  },
  {
    label: "Applications",
    menu: "applications",
    icon: ClipboardList,
    roles: ["admin"],
  },
  {
    label: "Attendance",
    menu: "attendance",
    icon: ClipboardList,
    roles: ["intern"],
  },
  {
    label: "Profile",
    menu: "profile",
    icon: UserRound,
    roles: ["intern", "admin"],
  },
];

export function AppSidebar() {
  useAttendanceHook();
  const { sidebarState, setSidebarState } = useSidebarStore();
  const { user } = useAuthStore();

  return (
    <Sidebar className="h-screen border-r border-slate-200 bg-white">
      {/* Header */}
      <SidebarHeader className="border-b border-slate-200 bg-white px-6 py-5">
        <img
          src="/codecelix-logo.png"
          alt="Codecelix"
          className="h-9 w-auto max-w-full self-start"
        />
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="bg-white px-3 py-5">
        <div>
          <p className="mb-2 px-3 text-[11px] font-semibold uppercase tracking-[0.12em] text-slate-400">
            Workspace
          </p>

          <div className="space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = item.menu === sidebarState;

              if (!item.roles.includes(user?.role || "")) {
                return null;
              }

              return (
                <button
                  key={item.menu}
                  onClick={() => {
                    setSidebarState(item.menu);
                  }}
                  className={`group flex w-full cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors duration-150 ${isActive
                    ? "bg-[#BFE9E6] text-[#0A7E84]"
                    : "text-slate-700 hover:bg-slate-100 hover:text-[#0A7E84]"
                    }`}
                >
                  <Icon
                    size={18}
                    strokeWidth={2}
                    className={
                      isActive
                        ? "text-[#0A7E84]"
                        : "text-slate-500 group-hover:text-[#0A7E84]"
                    }
                  />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </div>
      </SidebarContent>

      {/* Footer */}
      <SidebarFooter className="border-t border-slate-200 bg-white p-4">
        <div className="flex flex-col items-center justify-center gap-1">
          <p className="text-xs font-medium text-slate-500">
            Code<span className="text-[#0A7E84]">celix</span>
          </p>

          <p className="text-[10px] text-slate-400">
            Internship Management System
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}