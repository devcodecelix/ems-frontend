import { create } from "zustand";
import type { User } from "../interface";
import axiosInstance from "../lib/axios";

interface InternState {
    applications: User[];
    allInterns: User[];

    getApplicationsLoader: boolean;
    getAllInternsLoader: boolean;

    getApplications: () => Promise<void>;
    getAllInterns: () => Promise<void>;
}

const useAdminStore = create<InternState>((set) => ({
    applications: [],
    allInterns: [],

    getApplicationsLoader: false,
    getAllInternsLoader: false,

    getApplications: async () => {
        set({ getApplicationsLoader: true });
        try {
            const response = await axiosInstance.get(`/api/v5/admin/application`);
            set({
                applications: response.data,
            });
        } catch (error) {
            console.error("Error fetching applications:", error);
        } finally {
            set({ getApplicationsLoader: false });
        }
    },
    getAllInterns: async () => {
        set({ getAllInternsLoader: true });
        try {
            const response = await axiosInstance.get(`/api/v5/admin/intern`);
            set({
                allInterns: response.data,
            });
        } catch (error) {
            console.error("Error fetching interns:", error);
        } finally {
            set({ getAllInternsLoader: false });
        }
    },
}));

export default useAdminStore;
