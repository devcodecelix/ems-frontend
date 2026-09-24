import { useEffect, useState } from "react";
import axiosInstance from "../../lib/axios";
import { toast } from "react-toastify";
import { Loader2, Check, Trash2, CalendarCheck, RefreshCw, Inbox } from "lucide-react";
import type { User } from "../../interface";
import useAdminStore from "../../store/useAdminStore";

let alreadyFetched = false;

const Applications = () => {
    const { applications, getApplications, getApplicationsLoader } = useAdminStore();
    const [actioningId, setActioningId] = useState<string | null>(null);

    useEffect(() => {
        if (!alreadyFetched) {
            getApplications();
            alreadyFetched = true;
        }
    }, [getApplications]);

    const statusChange = async (userId: string, status: boolean) => {
        setActioningId(userId);

        try {
            await axiosInstance.post(`/api/v5/admin/application/status`, {
                userId,
                status
            });

            useAdminStore.setState((state) => ({
                applications: state.applications.filter((app) => app._id !== userId)
            }));
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Failed to approve application."
            );
        } finally {
            setActioningId(null);
        }
    };

    const roleBadgeClass = (role: User["role"]) =>
        role === "intern"
            ? "bg-green-100 text-green-700"
            : role === "admin"
                ? "bg-purple-100 text-purple-700"
                : role === "applied"
                    ? "bg-yellow-100 text-yellow-700"
                    : "bg-slate-100 text-slate-600";

    if (getApplicationsLoader) {
        return (
<div className="min-h-screen bg-[#F7F8F8] px-3 py-6 sm:px-6">
            <div className="flex items-center justify-center py-24">
                <Loader2 className="h-8 w-8 animate-spin text-[#0A7E84]" />
            </div>
        </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F7F8F8] px-3 py-6 sm:px-6">
            <div className="mx-auto max-w-5xl overflow-hidden rounded-lg border border-slate-200 bg-white">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#BFE9E6]">
                            <CalendarCheck className="h-4 w-4 text-[#0A7E84]" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-[#0F2D3A]">
                                Applications
                            </h2>
                            <p className="text-xs text-slate-400">
                                {applications.length} pending review
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={getApplications}
                        disabled={getApplicationsLoader}
                        className="rounded-md p-2 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
                        title="Refresh"
                    >
                        <RefreshCw className={`h-4 w-4 ${getApplicationsLoader ? "animate-spin" : ""}`} />
                    </button>
                </div>

                {applications.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 bg-white px-6 py-12 text-center">
                        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-slate-50">
                            <Inbox className="h-5 w-5 text-slate-300" />
                        </div>
                        <p className="text-sm font-medium text-slate-700">No applications found</p>
                        <p className="text-xs text-slate-400">New applications will show up here.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-slate-100">
                        {applications.map((app) => {
                            const isActioning = actioningId === app._id;

                            return (
                                <div
                                    key={app._id}
                                    className="flex flex-col gap-4 px-5 py-4 transition-colors hover:bg-slate-50 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    {/* Identity */}
                                    <div className="flex min-w-0 flex-1 items-center gap-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-slate-100 text-sm font-semibold text-slate-700">
                                            {app.name?.charAt(0).toUpperCase() ?? "?"}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="truncate text-sm font-semibold text-slate-800">
                                                    {app.name}
                                                </p>
                                                <span
                                                    className={`shrink-0 rounded-full px-2 py-0.5 text-[11px] font-medium capitalize ${roleBadgeClass(
                                                        app.role
                                                    )}`}
                                                >
                                                    {app.role}
                                                </span>
                                            </div>
                                            <p className="truncate text-xs text-slate-500">
                                                {app.email}
                                            </p>
                                            <p className="mt-0.5 text-[11px] text-slate-400">
                                                Applied{" "}
                                                {new Date(app.createdAt).toLocaleDateString("en-US", {
                                                    year: "numeric",
                                                    month: "short",
                                                    day: "numeric",
                                                })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Batch info */}
                                    <div className="flex shrink-0 gap-4 rounded-md bg-slate-50 px-3 py-2 text-xs sm:gap-5">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wide text-slate-400">Batch</p>
                                            <p className="mt-0.5 font-medium text-slate-700">
                                                {app.batch?.batchId ?? "-"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wide text-slate-400">Domain</p>
                                            <p className="mt-0.5 truncate font-medium capitalize text-slate-700">
                                                {app.batch?.domain ?? "-"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wide text-slate-400">Ref No</p>
                                            <p className="mt-0.5 truncate font-medium text-slate-700">
                                                {app.batch?.referenceNo ?? "-"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wide text-slate-400">Location</p>
                                            <p className="mt-0.5 truncate font-medium text-slate-700">
                                                {app.batch?.location ?? "-"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex shrink-0 gap-2">
                                        <button
                                            onClick={() => statusChange(app._id, true)}
                                            disabled={isActioning || app.role === "intern"}
                                            className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-green-600 px-3.5 py-2 text-xs font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                                        >
                                            {isActioning ? (
                                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                            ) : (
                                                <Check className="h-3.5 w-3.5" />
                                            )}
                                            Accept
                                        </button>

                                        <button
                                            onClick={() => statusChange(app._id, false)}
                                            disabled={isActioning}
                                            className="flex flex-1 items-center justify-center gap-1.5 rounded-md bg-red-600 px-3.5 py-2 text-xs font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                                        >
                                            {isActioning ? (
                                                <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                            ) : (
                                                <Trash2 className="h-3.5 w-3.5" />
                                            )}
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Applications;
