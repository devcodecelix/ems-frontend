import { create } from "zustand";
import axiosInstance from "../lib/axios";
import type { User, AttendanceRecord } from "../interface";
import { toast } from "react-toastify";

interface InternState {
    stats: {
        batchInternCount: number;
        batchLeader: string;
    }
    allTeamMembers: User[];
    attendance: AttendanceRecord[];

    getAllTeamMembersLoader: boolean;
    getAttendanceLoader: boolean;

    getStats: () => Promise<void>;
    getAllTeamMembers: () => Promise<void>;
    getMyAttendance: () => Promise<void>;
}

const useInternStore = create<InternState>((set) => ({
    stats: {
        batchInternCount: 0,
        batchLeader: "",
    },
    allTeamMembers: [],
    attendance: [],

    getAllTeamMembersLoader: false,
    getAttendanceLoader: false,

    getStats: async () => {
        try {
            const response = await axiosInstance.get("/api/v3/intern/stats");
            set({ stats: response.data });
        } catch (error) {
            console.error("Error fetching stats:", error);
        }
    },
    getAllTeamMembers: async () => {
        try {
            set({ getAllTeamMembersLoader: true });
            const response = await axiosInstance.get("/api/v3/intern");
            set({ allTeamMembers: response.data });
        } catch (error) {
            console.error("Error fetching team members:", error);
        } finally {
            set({ getAllTeamMembersLoader: false });
        }
    },
    getMyAttendance: async () => {
        try {
            set({ getAttendanceLoader: true });
            const response = await axiosInstance.get("/api/v4/attendance");
            set({ attendance: response.data });
        } catch (error) {
            toast.error("Failed to load your attendance.");
            console.error("Error fetching attendance:", error);
        } finally {
            set({ getAttendanceLoader: false });
        }
    },
}));

export default useInternStore;
