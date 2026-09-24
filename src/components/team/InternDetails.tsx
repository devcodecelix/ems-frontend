import { useEffect, useState } from "react";
import {
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "../ui/dialog";
import { Crown, Hash, Layers, Mail, Users, Trash2, CalendarCheck, Loader2 } from 'lucide-react';
import { toast } from "react-toastify";
import axiosInstance from "../../lib/axios";

type AttendanceRecord = {
    date: string;
    status?: string;
};

const InternDetails = ({
    selectedIntern,
    batchLoader,
    hasBatchLeader,
    makeBatchLeader,
    removeBatchLeader,
    removeLeaderLoader,
    deleteIntern,
    deleteInternLoader,
    setConfirmingDelete,
    confirmingDelete,
}: {
    selectedIntern: any;
    batchLoader: boolean;
    hasBatchLeader: boolean;
    makeBatchLeader: (internId: string, domain: string, batchId: number, location: string) => void;
    removeBatchLeader: (internId: string, domain: string, batchId: number, location: string) => void;
    removeLeaderLoader: boolean;
    deleteIntern: (internId: string) => void;
    deleteInternLoader: boolean;
    setConfirmingDelete: (value: boolean) => void;
    confirmingDelete: boolean;
}) => {
    const [internAttendanceLoader, setInternAttendanceLoader] = useState(false);
    const [internAttendance, setInternAttendance] = useState<AttendanceRecord[]>([]);

    const getInternAttendance = async (referenceNo: string) => {
        setInternAttendanceLoader(true);
        try {
            const response = await axiosInstance.get(
                `/api/v5/admin/intern/${referenceNo}`,
            );
            setInternAttendance(response.data ?? []);
        } catch (error) {
            toast.error("Failed to load intern attendance.");
            console.error("Error fetching intern attendance:", error);
        } finally {
            setInternAttendanceLoader(false);
        }
    };

    useEffect(() => {
        if (selectedIntern?.batch?.referenceNo) {
            getInternAttendance(selectedIntern.batch.referenceNo);
        }
    }, [selectedIntern]);

    return (
        <DialogContent className="sm:max-w-lg">
            <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100">
                        <Users className="h-5 w-5 text-slate-500" />
                    </div>
                    <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-slate-800">
                            {selectedIntern?.name ?? "-"}
                        </p>
                        <p className="truncate text-xs font-normal text-slate-500">
                            {selectedIntern?.email}
                        </p>
                    </div>
                </DialogTitle>
            </DialogHeader>

            {selectedIntern && (
                <div className="mt-2 max-h-[70vh] space-y-3 overflow-y-auto pr-1">
                    <div className="flex items-center gap-3 rounded-md bg-slate-50 p-3">
                        <Mail className="h-4 w-4 shrink-0 text-slate-400" />
                        <div className="min-w-0">
                            <p className="text-[11px] uppercase tracking-wide text-slate-400">
                                Email
                            </p>
                            <p className="truncate text-sm font-medium text-slate-700">
                                {selectedIntern.email}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-md bg-slate-50 p-3">
                            <p className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-slate-400">
                                <Hash className="h-3 w-3" />
                                Batch
                            </p>
                            <p className="mt-0.5 text-sm font-medium text-slate-700">
                                {selectedIntern.batch?.batchId ?? "-"}
                            </p>
                        </div>

                        <div className="rounded-md bg-slate-50 p-3">
                            <p className="flex items-center gap-1 text-[11px] uppercase tracking-wide text-slate-400">
                                <Layers className="h-3 w-3" />
                                Team
                            </p>
                            <p className="mt-0.5 text-sm font-medium capitalize text-slate-700">
                                {selectedIntern.batch?.domain ?? "-"}
                            </p>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                        <div className="rounded-md bg-slate-50 p-3">
                            <p className="text-[11px] uppercase tracking-wide text-slate-400">
                                Reference No
                            </p>
                            <p className="mt-0.5 text-sm font-medium text-slate-700">
                                {selectedIntern.batch?.referenceNo ?? "-"}
                            </p>
                        </div>

                        <div className="rounded-md bg-slate-50 p-3">
                            <p className="text-[11px] uppercase tracking-wide text-slate-400">
                                Location
                            </p>
                            <p className="mt-0.5 text-sm font-medium text-slate-700">
                                {selectedIntern.batch?.location ?? "-"}
                            </p>
                        </div>
                    </div>

                    {/* Attendance */}
                    <div className="rounded-md border border-slate-100">
                        <p className="flex items-center gap-1.5 border-b border-slate-100 px-3 py-2 text-[11px] font-medium uppercase tracking-wide text-slate-400">
                            <CalendarCheck className="h-3.5 w-3.5" />
                            Attendance
                        </p>

                        {internAttendanceLoader ? (
                            <div className="flex items-center justify-center py-6">
                                <Loader2 className="h-5 w-5 animate-spin text-slate-400" />
                            </div>
                        ) : internAttendance.length === 0 ? (
                            <p className="px-3 text-center text-xs text-slate-400">
                                No attendance records found.
                            </p>
                        ) : (
                            <div className="max-h-48 divide-y divide-slate-50 overflow-y-auto">
                                <p className="px-3 py-2 text-sm text-slate-500">
                                    {internAttendance.filter((record) => record.status !== "absent").length} present ·{" "}
                                    {internAttendance.filter((record) => record.status === "absent").length} absent
                                </p>
                                {internAttendance.map((record) => {
                                    const dateObj = new Date(record.date);
                                    const isPresent = record.status !== "absent";
                                    return (
                                        <div
                                            key={record.date}
                                            className="flex items-center justify-between px-3 py-2 text-sm"
                                        >
                                            <div className="min-w-0">
                                                <p className="font-medium text-slate-700">
                                                    {dateObj.toLocaleDateString("en-US", { weekday: "long" })}
                                                </p>
                                                <p className="text-xs text-slate-400">
                                                    {dateObj.toLocaleDateString("en-US", {
                                                        year: "numeric",
                                                        month: "short",
                                                        day: "numeric",
                                                    })}
                                                </p>
                                            </div>
                                            <span
                                                className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                                                    isPresent
                                                        ? "bg-green-100 text-green-700"
                                                        : "bg-red-100 text-red-700"
                                                }`}
                                            >
                                                {isPresent ? "Present" : "Absent"}
                                            </span>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className="flex flex-col-reverse gap-2 pt-1 sm:flex-row sm:items-center sm:justify-between">
                        {confirmingDelete ? (
                            <div className="flex w-full flex-col gap-2 rounded-md bg-red-50 p-3 sm:flex-row sm:items-center sm:justify-between">
                                <p className="text-xs font-medium text-red-700">
                                    Delete this intern permanently?
                                </p>
                                <div className="flex gap-2">
                                    <button
                                        onClick={() => setConfirmingDelete(false)}
                                        className="flex-1 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-xs font-medium text-slate-600 transition hover:bg-slate-50 sm:flex-none"
                                    >
                                        Cancel
                                    </button>
                                    <button
                                        onClick={() => deleteIntern(selectedIntern._id)}
                                        disabled={deleteInternLoader}
                                        className="flex flex-1 items-center justify-center gap-1.5 rounded-lg bg-red-600 px-3 py-1.5 text-xs font-medium text-white transition hover:bg-red-700 disabled:cursor-not-allowed disabled:opacity-50 sm:flex-none"
                                    >
                                        {deleteInternLoader && <Loader2 className="h-3 w-3 animate-spin" />}
                                        {deleteInternLoader ? "Deleting..." : "Confirm"}
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <>
                                <button
                                    onClick={() => setConfirmingDelete(true)}
                                    className="flex items-center justify-center gap-1.5 rounded-lg border border-red-200 px-3 py-1.5 text-sm font-medium text-red-600 transition hover:bg-red-50"
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                    Delete Intern
                                </button>

                                {selectedIntern.batch?.leader ? (
                                    <button
                                        onClick={() =>
                                            removeBatchLeader(
                                                selectedIntern._id,
                                                selectedIntern.batch?.domain ?? "",
                                                selectedIntern.batch?.batchId ?? 0,
                                                selectedIntern.batch?.location ?? "",
                                            )
                                        }
                                        disabled={removeLeaderLoader}
                                        className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        {removeLeaderLoader ? (
                                            <Loader2 className="h-3.5 w-3.5 animate-spin" />
                                        ) : (
                                            <Crown className="h-3.5 w-3.5" />
                                        )}
                                        Remove Batch Leader
                                    </button>
                                ) : hasBatchLeader ? (
                                    <p className="flex items-center justify-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5 text-xs font-medium text-slate-600">
                                        <Crown className="h-3.5 w-3.5 shrink-0 text-[#0A7E84]" />
                                        Already has a leader in this batch
                                    </p>
                                ) : (
                                    <button
                                        onClick={() =>
                                            makeBatchLeader(
                                                selectedIntern._id,
                                                selectedIntern.batch?.domain ?? "",
                                                selectedIntern.batch?.batchId ?? 0,
                                                selectedIntern.batch?.location ?? "",
                                            )
                                        }
                                        disabled={batchLoader}
                                        className="flex cursor-pointer items-center justify-center gap-1.5 rounded-lg bg-[#0A7E84] px-3 py-1.5 text-sm font-medium text-white transition hover:bg-[#075F64] disabled:cursor-not-allowed disabled:opacity-50"
                                    >
                                        <Crown className="h-3.5 w-3.5" />
                                        Make Batch Leader
                                    </button>
                                )}
                            </>
                        )}
                    </div>
                </div>
            )}
        </DialogContent>
    )
}

export default InternDetails
