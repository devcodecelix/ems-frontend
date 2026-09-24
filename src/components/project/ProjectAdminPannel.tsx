import { useEffect, useMemo, useState } from "react";
import {
    FolderKanban,
    Plus,
    Loader2,
} from "lucide-react";
import AddNewProject from "../project/AddNewProject";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "../ui/dialog";
import useAdminStore from "../../store/useAdminStore";
import type { Project } from "../../interface";
import axiosInstance from "../../lib/axios";

type ProjectStatus = "submitted" | "pending" | "overdue";

const getStatus = (project: Project): ProjectStatus => {
    if (project.status === "completed") return "submitted";
    const isOverdue = new Date(project.deadline).getTime() < Date.now();
    return isOverdue ? "overdue" : "pending";
};

const statusMeta: Record<
    ProjectStatus,
    { label: string; dot: string }
> = {
    submitted: {
        label: "Submitted",
        dot: "bg-green-500",
    },
    pending: {
        label: "Pending",
        dot: "bg-amber-500",
    },
    overdue: {
        label: "Overdue",
        dot: "bg-red-500",
    },
};

type FilterKey = "all" | "submitted" | "pending" | "not-submitted" | "overdue";

const filterOptions: { key: FilterKey; label: string }[] = [
    { key: "all", label: "All" },
    { key: "submitted", label: "Submitted" },
    { key: "pending", label: "Pending" },
    { key: "overdue", label: "Overdue" },
];


const ProjectAdminPannel = () => {
    const [activeFilter, setActiveFilter] = useState<FilterKey>("all");
    const [dialogOpen, setDialogOpen] = useState(false);

    const { getAllProjects, getAllProjectsLoader, projects } = useAdminStore();

    useEffect(() => {
        if (projects.length !== 0) return;
        getAllProjects();
    }, [getAllProjects]);

    const projectsWithStatus = useMemo(
        () =>
            (projects as unknown as Project[]).map((project) => ({
                ...project,
                status: getStatus(project),
            })),
        [projects]
    );

    const counts = useMemo(() => {
        return {
            all: projectsWithStatus.length,
            submitted: projectsWithStatus.filter((p) => p.status === "submitted")
                .length,
            pending: projectsWithStatus.filter((p) => p.status === "pending")
                .length,
            "not-submitted": projectsWithStatus.filter((p) => !p.status || p.status === "pending")
                .length,
            overdue: projectsWithStatus.filter((p) => p.status === "overdue")
                .length,
        };
    }, [projectsWithStatus]);

    const filteredProjects = useMemo(() => {
        switch (activeFilter) {
            case "submitted":
                return projectsWithStatus.filter((p) => p.status === "submitted");
            case "pending":
                return projectsWithStatus.filter((p) => p.status === "pending");
            case "overdue":
                return projectsWithStatus.filter((p) => p.status === "overdue");
            default:
                return projectsWithStatus;
        }
    }, [activeFilter, projectsWithStatus]);

    const deleteProject = async (projectId: string) => {
        useAdminStore.getState().removeProject(projectId);
        await axiosInstance.delete(`/api/v5/admin/project/${projectId}`);
    }

    return (
        <div className="mx-auto max-w-5xl">
            {/* Header */}
            <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
                    <div>
                        <h1 className="text-xl font-semibold text-[#0F2D3A]">
                            Projects
                        </h1>
                        <p className="mt-0.5 text-xs text-slate-500">
                            Manage projects assigned to teams/batches
                        </p>
                    </div>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger className="flex items-center gap-2 rounded-md bg-[#0A7E84] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#075F64]">
                        <Plus className="h-4 w-4" />
                        Add Project
                    </DialogTrigger>
                    <DialogContent className="max-w-xl p-0">
                        <DialogHeader className="sr-only">
                            <DialogTitle>Assign Project</DialogTitle>
                        </DialogHeader>
                        <AddNewProject onSuccess={() => setDialogOpen(false)} />
                    </DialogContent>
                </Dialog>
            </div>

            {/* Filters */}
            <div className="mb-6 flex flex-wrap gap-2">
                {filterOptions.map((option) => {
                    const isActive = activeFilter === option.key;
                    return (
                        <button
                            key={option.key}
                            onClick={() => setActiveFilter(option.key)}
                            className={`flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-xs font-medium transition ${isActive
                                ? "border-[#0A7E84] bg-[#BFE9E6] text-[#0A7E84]"
                                : "border-slate-200 bg-white text-slate-600 hover:border-[#0A7E84] hover:text-[#0A7E84]"
                                }`}
                        >
                            {option.label}
                            <span
                                className={`rounded-full px-1.5 text-[10px] ${isActive
                                    ? "bg-white text-[#0A7E84]"
                                    : "bg-slate-100 text-slate-500"
                                    }`}
                            >
                                {counts[option.key]}
                            </span>
                        </button>
                    );
                })}
            </div>

            {/* Project list */}
            {getAllProjectsLoader ? (
                <div className="flex items-center justify-center py-24">
                    <Loader2 className="h-8 w-8 animate-spin text-[#0A7E84]" />
                </div>
            ) : filteredProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-lg border border-dashed border-slate-200 bg-white py-12 text-center">
                    <FolderKanban className="mb-3 h-8 w-8 text-slate-300" />
                    <p className="text-sm font-medium text-slate-500">
                        No projects in this filter
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                    {filteredProjects.map((project) => {
                        const status = statusMeta[project.status];
                        const deadline = new Date(project.deadline);
                        const diffDays = Math.round(
                            (deadline.getTime() - Date.now()) / (1000 * 60 * 60 * 24)
                        );
                        const isOverdue = project.status === "overdue";
                        const dueLabel = isOverdue
                            ? diffDays <= 0
                                ? "Overdue today"
                                : `${Math.abs(diffDays)} days overdue`
                            : diffDays <= 0
                                ? "Due today"
                                : `in ${diffDays} day${diffDays === 1 ? "" : "s"}`;

                        return (
                            <div
                                key={project._id}
                                className="rounded-lg border border-slate-200 bg-white p-4 transition hover:border-slate-300"
                            >
                                <div className="mb-1.5 flex items-start justify-between gap-3">
                                    <h3 className="min-w-0 break-words text-sm font-semibold leading-snug text-[#0F2D3A]">
                                        {project.title}
                                    </h3>
                                    <span className="flex shrink-0 items-center gap-1.5 pt-0.5 text-[11px] font-medium text-slate-600">
                                        <span className={`h-1.5 w-1.5 rounded-full ${status.dot}`} />
                                        {status.label}
                                    </span>
                                </div>

                                <p className="mb-3 overflow-hidden break-words line-clamp-2 text-xs leading-relaxed text-slate-500">
                                    {project.description}
                                </p>

                                <div className="mb-3 flex items-center text-[11px]">
                                    <span className="text-slate-400">
                                        {deadline.toLocaleDateString("en-US", {
                                            month: "short",
                                            day: "numeric",
                                            year: "numeric",
                                        })}
                                    </span>
                                    <span className="mx-1.5 text-slate-300">·</span>
                                    <span className={isOverdue ? "font-medium text-red-600" : diffDays <= 0 ? "font-medium text-amber-600" : "text-slate-500"}>
                                        {dueLabel}
                                    </span>
                                </div>

                                <div className="flex items-center justify-between gap-3 border-t border-slate-100 pt-3">
                                    <div className="flex flex-wrap items-center text-[11px] text-slate-500">
                                        <span>Batch {project.batchId}</span>
                                        <span className="mx-1.5 text-slate-300">/</span>
                                        <span className="capitalize">{project.domain}</span>
                                        <span className="mx-1.5 text-slate-300">/</span>
                                        <span className="capitalize">{project.location}</span>
                                    </div>
                                    <button
                                        onClick={() => deleteProject(project._id!)}
                                        className="flex shrink-0 items-center gap-1 rounded-md border border-red-200 bg-red-50 px-2.5 py-1 text-[11px] font-medium text-red-600 transition hover:border-red-300 hover:bg-red-100 cursor-pointer"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    )
}

export default ProjectAdminPannel
