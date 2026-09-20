import { useEffect } from "react";
import {
  Loader2,
  FolderKanban,
  Users,
  Globe,
  MapPin,
  CheckCircle2,
  Calendar,
} from "lucide-react";
import useInternStore from "../../store/useInternStore";
import type { Project } from "../../interface";
import useAuthStore from "../../store/useAuthStore";
import axiosInstance from "../../lib/axios";
import { toast } from "react-toastify";

const ProjectInternPannel = () => {
  const { getAllProjects, getAllProjectsLoader, projects } = useInternStore();
  const { user } = useAuthStore();

  useEffect(() => {
    if (projects.length !== 0) return;
    getAllProjects();
  }, [getAllProjects]);

  const markAsCompleted = async (projectId: string) => {
    try {
      useInternStore.setState((state) => ({
        projects: state.projects.map((project) =>
          project._id === projectId
            ? { ...project, status: "completed" }
            : project
        ),
      }));
      await axiosInstance.patch(`/api/v6/project/${projectId}/status`);
      toast.success("Project marked as completed");
    } catch (error: any) {
      toast.error(error.response?.data?.message || "Failed to mark project as completed");
      console.error("Failed to mark project as completed:", error);
    }
  };

  if (getAllProjectsLoader) {
    return (
      <div className="flex items-center justify-center py-24">
        <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
      </div>
    );
  }

  const projectList = projects as Project[];

  if (projectList.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
        <FolderKanban className="mb-3 h-8 w-8 text-gray-300" />
        <p className="text-sm font-medium text-gray-500">
          No projects assigned yet
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 px-3 py-8 sm:px-6">
      <div className="mx-auto max-w-5xl">
        {/* Header */}
        <div className="mb-6 flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-blue-600 shadow-sm shadow-blue-200">
            <FolderKanban className="h-5 w-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">
              My Projects
            </h1>
            <p className="text-xs text-gray-500">
              Projects assigned to your batch
            </p>
          </div>
        </div>

        {/* Project cards */}
        <div className="space-y-4">
          {projectList.map((project) => (
            <div
              key={project._id}
              className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
            >
              <div className="mb-2 flex items-start justify-between gap-3">
                <h3 className="text-sm font-semibold text-gray-900">
                  {project.title}
                </h3>
                {project.status === "completed" && (
                  <span className="flex shrink-0 items-center gap-1 rounded-full bg-green-50 px-2 py-0.5 text-[11px] font-medium text-green-600">
                    <CheckCircle2 className="h-3 w-3" />
                    Completed
                  </span>
                )}
              </div>

              <p className="mb-4 text-xs text-gray-500">
                {project.description}
              </p>

              {/* Left: batch/domain/location — Right: action button */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-gray-100 pt-3">
                <div className="flex flex-wrap items-center gap-3 text-[11px] text-gray-500">
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    Batch {project.batchId}
                  </span>
                  <span className="flex items-center gap-1 capitalize">
                    <Globe className="h-3.5 w-3.5" />
                    {project.domain}
                  </span>
                  <span className="flex items-center gap-1 capitalize">
                    <MapPin className="h-3.5 w-3.5" />
                    {project.location}
                  </span>
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3.5 w-3.5" />
                    {new Date(project.deadline).toLocaleDateString(
                      "en-US",
                      { month: "short", day: "numeric", year: "numeric" }
                    )}
                  </span>
                </div>

                {user?.batch.leader && new Date(project.deadline) < new Date() && (
                  <button
                    onClick={() => markAsCompleted(project._id!)}
                    disabled={project.status === "completed"}
                    className="flex shrink-0 items-center gap-2 rounded-lg bg-blue-600 px-3.5 py-2 text-xs font-medium text-white transition hover:bg-blue-700 active:scale-[0.99] disabled:cursor-not-allowed disabled:bg-gray-200 disabled:text-gray-400"
                  >
                    Mark as Completed
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProjectInternPannel;