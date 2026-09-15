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
    <Sidebar className="h-screen border-r border-slate-200 bg-white shadow-sm">
      {/* Header */}
      <SidebarHeader className="border-b border-slate-200 bg-white px-5 py-5">
        <div className="flex items-center gap-3">
          {/* Logo */}
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-blue-600 text-white shadow-md shadow-blue-100">
            <span className="text-lg font-bold">C</span>
          </div>

          {/* Brand */}
          <div>
            <h1 className="text-lg font-bold tracking-tight text-slate-900">
              Code<span className="text-blue-600">celix</span>
            </h1>

            <p className="text-xs text-slate-500">
              Internship Dashboard
            </p>
          </div>
        </div>
      </SidebarHeader>

      {/* Content */}
      <SidebarContent className="bg-slate-50/60 px-3 py-6">
        <div className="mb-8">
          <p className="mb-3 px-3 text-[11px] font-semibold uppercase tracking-[0.15em] text-slate-400">
            Workspace
          </p>

          <div className="space-y-1.5">
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
                  className={`group flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-all duration-200 ${isActive
                    ? "bg-blue-600 text-white shadow-md shadow-blue-100"
                    : "text-slate-600 hover:bg-white hover:text-slate-900 hover:shadow-sm"
                    }`}
                >
                  <div
                    className={`flex h-8 w-8 items-center justify-center rounded-lg transition ${isActive
                      ? "bg-white/15"
                      : "bg-slate-100 group-hover:bg-blue-50"
                      }`}
                  >
                    <Icon
                      size={18}
                      strokeWidth={2}
                      className={
                        isActive
                          ? "text-white"
                          : "text-slate-500 group-hover:text-blue-600"
                      }
                    />
                  </div>

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
            Code<span className="text-blue-600">celix</span>
          </p>

          <p className="text-[10px] text-slate-400">
            Internship Management System
          </p>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
}