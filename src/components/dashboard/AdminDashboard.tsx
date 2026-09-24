import { useEffect, useMemo, useState } from "react";
import { Download, FileSpreadsheet, Loader2 } from "lucide-react";
import axiosInstance from "../../lib/axios";
import { toast } from "react-toastify";
import useAdminStore from "../../store/useAdminStore";
import { batchOptions } from "../../lib/batches";

const AdminDashboard = () => {
    const { allInterns, getAllInterns, getAllInternsLoader } = useAdminStore();
    const [month, setMonth] = useState(() => {
        const now = new Date();
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
    });
    const [downloadBatch, setDownloadBatch] = useState<number>(0);
    const [downloadDomain, setDownloadDomain] = useState("web");
    const [downloadLocation, setDownloadLocation] = useState("remote");
    const [excelLoader, setExcelLoader] = useState(false);
    const [downloadCount, setDownloadCount] = useState(() =>
        Number(localStorage.getItem("attendanceExcelCount") || 0)
    );

    useEffect(() => {
        if (allInterns.length !== 0) return;
        getAllInterns();
    }, [getAllInterns]);

    const stats = useMemo(() => {
        const byDomain: Record<string, number> = { web: 0, ai: 0, app: 0 };
        allInterns.forEach((intern) => {
            const domain = intern.batch?.domain;
            if (domain) byDomain[domain] = (byDomain[domain] ?? 0) + 1;
        });
        return {
            byDomain,
        };
    }, [allInterns, batchOptions]);

    const handleDownload = async () => {
        if (!downloadBatch) {
            toast.info("Select a batch first.");
            return;
        }

        try {
            setExcelLoader(true);
            const response = await axiosInstance.get("/api/v5/admin/attendance/excel", {
                params: {
                    month,
                    batchId: downloadBatch,
                    domain: downloadDomain,
                    location: downloadLocation,
                },
                responseType: "blob",
            });

            const url = window.URL.createObjectURL(new Blob([response.data]));
            const link = document.createElement("a");
            link.href = url;
            const nextCount = downloadCount + 1;
            link.download = `${nextCount}_attendance_batch${downloadBatch}_${downloadDomain}_${downloadLocation}_${month}.xlsx`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
            setDownloadCount(nextCount);
            localStorage.setItem("attendanceExcelCount", String(nextCount));
        } catch (error: any) {
            toast.error(error.response?.data?.message || "Failed to download attendance.");
        } finally {
            setExcelLoader(false);
        }
    };

    if (getAllInternsLoader) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#F7F8F8]">
                <Loader2 className="h-8 w-8 animate-spin text-[#0A7E84]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F7F8F8] px-3 py-6 sm:px-6">
            <div className="mx-auto max-w-3xl">
                {/* Summary stats */}
                <div className="mb-5 grid min-w-0 grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Interns</p>
                        <p className="mt-1 break-words text-2xl font-semibold text-[#0F2D3A]">
                            {allInterns.length}
                        </p>
                    </div>

                    <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Batches</p>
                        <p className="mt-1 break-words text-2xl font-semibold text-[#0F2D3A]">
                            {batchOptions.length}
                        </p>
                    </div>

                    <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Remote / Onsite</p>
                        <p className="mt-1 break-words text-2xl font-semibold text-[#0F2D3A]">
                            {allInterns.filter((intern) => intern.batch?.location === "remote").length}{" "}
                            /{" "}
                            {allInterns.filter((intern) => intern.batch?.location !== "remote").length}
                        </p>
                    </div>

                    <div className="min-w-0 rounded-lg border border-slate-200 bg-white p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Web / AI / APP</p>
                        <p className="mt-1 break-words text-2xl font-semibold text-[#0F2D3A]">
                            {stats.byDomain.web} / {stats.byDomain.ai} / {stats.byDomain.app}
                        </p>
                    </div>
                </div>

                {/* Monthly attendance excel export */}
                <div className="rounded-lg border border-slate-200 bg-white p-4">
                    <div className="mb-3 flex min-w-0 items-center gap-2">
                        <FileSpreadsheet className="h-4 w-4 shrink-0 text-[#0A7E84]" />
                        <div className="min-w-0">
                            <h2 className="text-sm font-semibold text-[#0F2D3A]">
                                Monthly Attendance (Excel)
                            </h2>
                            <p className="break-words text-xs text-slate-500">
                                Download the monthly attendance sheet of a batch
                            </p>
                        </div>
                    </div>

                    <div className="flex flex-col gap-3 sm:flex-row sm:items-end">
                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                            <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                                Month
                            </label>
                            <input
                                type="month"
                                value={month}
                                onChange={(e) => setMonth(e.target.value)}
                                className="h-10 w-full min-w-0 rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#0A7E84] focus:ring-1 focus:ring-[#0A7E84] [&::-webkit-datetime-edit]:block [&::-webkit-datetime-edit]:w-full [&::-webkit-datetime-edit-fields-wrapper]:flex [&::-webkit-datetime-edit-fields-wrapper]:flex-nowrap [&::-webkit-datetime-edit-fields-wrapper]:overflow-visible"
                            />
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                            <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                                Batch
                            </label>
                            <select
                                value={downloadBatch}
                                onChange={(e) => setDownloadBatch(Number(e.target.value))}
                                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#0A7E84] focus:ring-1 focus:ring-[#0A7E84]"
                            >
                                <option value={0}>Select Batch</option>
                                {batchOptions.map((batch) => (
                                    <option key={batch} value={batch}>
                                        Batch {batch}
                                    </option>
                                ))}
                            </select>
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                            <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                                Domain
                            </label>
                            <select
                                value={downloadDomain}
                                onChange={(e) => setDownloadDomain(e.target.value)}
                                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#0A7E84] focus:ring-1 focus:ring-[#0A7E84]"
                            >
                                <option value="web">Web</option>
                                <option value="ai">AI</option>
                                <option value="app">App</option>
                            </select>
                        </div>

                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                            <label className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">
                                Location
                            </label>
                            <select
                                value={downloadLocation}
                                onChange={(e) => setDownloadLocation(e.target.value)}
                                className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#0A7E84] focus:ring-1 focus:ring-[#0A7E84]"
                            >
                                <option value="remote">Remote</option>
                                <option value="onsite">Onsite</option>
                            </select>
                        </div>

                        <button
                            onClick={handleDownload}
                            disabled={excelLoader}
                            className="flex h-10 items-center justify-center gap-2 rounded-md bg-[#0A7E84] px-4 text-sm font-medium text-white transition hover:bg-[#075F64] disabled:cursor-not-allowed disabled:opacity-50"
                        >
                            {excelLoader ? (
                                <Loader2 className="h-4 w-4 animate-spin" />
                            ) : (
                                <Download className="h-4 w-4" />
                            )}
                            Download
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard