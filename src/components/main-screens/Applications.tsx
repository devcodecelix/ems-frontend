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
                    : "bg-gray-100 text-gray-600";

    if (getApplicationsLoader) {
        return (
            <div className="min-h-screen px-3 py-6 sm:px-6">
                <div className="mx-auto max-w-5xl rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 shadow-sm">
                    <div className="flex items-center justify-center">
                        <Loader2 className="h-8 w-8 animate-spin text-gray-400" />
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-3 py-6 sm:px-6">
            <div className="mx-auto max-w-5xl overflow-hidden rounded-2xl border border-gray-200 bg-white shadow-sm">
                {/* Header */}
                <div className="flex items-center justify-between border-b border-gray-100 px-5 py-4">
                    <div className="flex items-center gap-2">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue-50">
                            <CalendarCheck className="h-4 w-4 text-blue-600" />
                        </div>
                        <div>
                            <h2 className="text-sm font-semibold text-gray-900">
                                Applications
                            </h2>
                            <p className="text-xs text-gray-400">
                                {applications.length} pending review
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={getApplications}
                        disabled={getApplicationsLoader}
                        className="rounded-lg p-2 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
                        title="Refresh"
                    >
                        <RefreshCw className={`h-4 w-4 ${getApplicationsLoader ? "animate-spin" : ""}`} />
                    </button>
                </div>

                {applications.length === 0 ? (
                    <div className="flex flex-col items-center gap-2 bg-white px-6 py-16 text-center">
                        <div className="flex h-12 w-12 items-center justify-center rounded-full bg-gray-50">
                            <Inbox className="h-5 w-5 text-gray-300" />
                        </div>
                        <p className="text-sm font-medium text-gray-500">No applications found</p>
                        <p className="text-xs text-gray-400">New applications will show up here.</p>
                    </div>
                ) : (
                    <div className="divide-y divide-gray-100">
                        {applications.map((app) => {
                            const isActioning = actioningId === app._id;

                            return (
                                <div
                                    key={app._id}
                                    className="flex flex-col gap-4 px-5 py-4 transition-colors hover:bg-gray-50/60 sm:flex-row sm:items-center sm:justify-between"
                                >
                                    {/* Identity */}
                                    <div className="flex min-w-0 flex-1 items-center gap-3">
                                        <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-gray-100 text-sm font-semibold text-gray-600">
                                            {app.name?.charAt(0).toUpperCase() ?? "?"}
                                        </div>
                                        <div className="min-w-0">
                                            <div className="flex flex-wrap items-center gap-2">
                                                <p className="truncate text-sm font-semibold text-gray-900">
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
                                            <p className="truncate text-xs text-gray-500">
                                                {app.email}
                                            </p>
                                            <p className="mt-0.5 text-[11px] text-gray-400">
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
                                    <div className="flex shrink-0 gap-4 rounded-xl bg-gray-50 px-3 py-2 text-xs sm:gap-5">
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wide text-gray-400">Batch</p>
                                            <p className="mt-0.5 font-medium text-gray-700">
                                                {app.batch?.batchId ?? "-"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wide text-gray-400">Domain</p>
                                            <p className="mt-0.5 truncate font-medium capitalize text-gray-700">
                                                {app.batch?.domain ?? "-"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wide text-gray-400">Ref No</p>
                                            <p className="mt-0.5 truncate font-medium text-gray-700">
                                                {app.batch?.referenceNo ?? "-"}
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-[10px] uppercase tracking-wide text-gray-400">Location</p>
                                            <p className="mt-0.5 truncate font-medium text-gray-700">
                                                {app.batch?.location ?? "-"}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Actions */}
                                    <div className="flex shrink-0 gap-2">
                                        <button
                                            onClick={() => statusChange(app._id, true)}
                                            disabled={isActioning || app.role === "intern"}
                                            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-green-600 px-3.5 py-2 text-xs font-medium text-white transition hover:bg-green-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
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
                                            className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-600 px-3.5 py-2 text-xs font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
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
