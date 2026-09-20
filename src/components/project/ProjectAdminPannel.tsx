import { useEffect, useMemo, useState } from "react";
import {
    Calendar,
    CheckCircle2,
    Clock,
    AlertTriangle,
    FolderKanban,
    Plus,
    Users,
    Globe,
    MapPin,
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

const statusStyles: Record<
    ProjectStatus,
    { label: string; badge: string; icon: React.ElementType }
> = {
    submitted: {
        label: "Submitted",
        badge: "bg-green-50 text-green-600",
        icon: CheckCircle2,
    },
    pending: {
        label: "Pending",
        badge: "bg-amber-50 text-amber-600",
        icon: Clock,
    },
    overdue: {
        label: "Overdue",
        badge: "bg-red-50 text-red-600",
        icon: AlertTriangle,
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
                <div className="flex items-center gap-3">
                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-linear-to-br from-blue-500 to-blue-600 shadow-sm shadow-blue-200">
                        <FolderKanban className="h-5 w-5 text-white" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-gray-900">
                            Projects
                        </h1>
                        <p className="text-xs text-gray-500">
                            Manage projects assigned to teams/batches
                        </p>
                    </div>
                </div>

                <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                    <DialogTrigger className="flex items-center gap-2 rounded-xl bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700 active:scale-[0.99]">
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
                            className={`flex items-center gap-1.5 rounded-full border px-3.5 py-1.5 text-xs font-medium transition ${isActive
                                ? "border-blue-600 bg-blue-600 text-white"
                                : "border-gray-200 bg-white text-gray-600 hover:border-blue-200 hover:text-blue-600"
                                }`}
                        >
                            {option.label}
                            <span
                                className={`rounded-full px-1.5 text-[10px] ${isActive
                                    ? "bg-white/20 text-white"
                                    : "bg-gray-100 text-gray-500"
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
                    <Loader2 className="h-8 w-8 animate-spin text-blue-500" />
                </div>
            ) : filteredProjects.length === 0 ? (
                <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-gray-200 bg-white py-16 text-center">
                    <FolderKanban className="mb-3 h-8 w-8 text-gray-300" />
                    <p className="text-sm font-medium text-gray-500">
                        No projects in this filter
                    </p>
                </div>
            ) : (
                <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                    {filteredProjects.map((project) => {
                        const status = statusStyles[project.status];
                        const StatusIcon = status.icon;

                        return (
                            <div
                                key={project._id}
                                className="rounded-2xl border border-gray-200 bg-white p-5 shadow-sm transition hover:shadow-md"
                            >
                                <div className="mb-2 flex items-start justify-between gap-2">
                                    <h3 className="text-sm font-semibold text-gray-900">
                                        {project.title}
                                    </h3>
                                    <span
                                        className={`flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-[11px] font-medium ${status.badge}`}
                                    >
                                        <StatusIcon className="h-3 w-3" />
                                        {status.label}
                                    </span>
                                </div>

                                <p className="mb-4 text-xs text-gray-500">
                                    {project.description}
                                </p>

                                <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
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
                                    <button onClick={() => deleteProject(project._id!)} className="text-xs font-medium text-red-600 transition hover:text-red-700 active:scale-[0.98] cursor-pointer">
                                        Delete Project
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
