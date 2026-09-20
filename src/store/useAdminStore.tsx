import { create } from "zustand";
import type { User, Project } from "../interface";
import axiosInstance from "../lib/axios";

interface InternState {
    applications: User[];
    allInterns: User[];
    projects: Project[];

    getApplicationsLoader: boolean;
    getAllInternsLoader: boolean;
    getAllProjectsLoader: boolean;

    getApplications: () => Promise<void>;
    getAllInterns: () => Promise<void>;
    getAllProjects: () => Promise<void>;
    addNewProject: (project: Project) => Promise<void>;
    removeProject: (projectId: string) => Promise<void>;
}

const useAdminStore = create<InternState>((set) => ({
    applications: [],
    allInterns: [],
    projects: [],

    getApplicationsLoader: false,
    getAllInternsLoader: false,
    getAllProjectsLoader: false,

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
    getAllProjects: async () => {
        try {
            set({ getAllProjectsLoader: true });
            const response = await axiosInstance.get(`/api/v5/admin/project`);
            set({
                projects: response.data,
            });
        } catch (error) {
            console.error("Error fetching projects:", error);
        } finally {
            set({ getAllProjectsLoader: false });
        }
    },
    addNewProject: async (project: Project) => {
        set((state) => ({
            projects: [...state.projects, project],
        }));
    },
    removeProject: async (projectId: string) => {
        set((state) => ({
            projects: state.projects.filter((project) => project._id !== projectId),
        }));
    }
}));

export default useAdminStore;
