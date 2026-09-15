import { create } from "zustand";

interface SidebarState {
    sidebarState: string;

    setSidebarState: (state: string) => void;
}

const useSidebarStore = create<SidebarState>((set) => ({
    sidebarState: "dashboard",

    setSidebarState: (state) => {
        set({
            sidebarState: state,
        })
    },
}));

export default useSidebarStore;
