import { Loader2, CalendarCheck, RefreshCw } from "lucide-react";

const MyAttendance = ({ getMyAttendance, getAttendanceLoader, attendance }: {
    getMyAttendance: () => void,
    getAttendanceLoader: boolean,
    attendance: { _id: string, date: string, status?: string }[] | null
}) => {

    const presentCount = attendance
        ? attendance.filter((record) => record.status !== "absent").length
        : 0;
    const absentCount = attendance ? attendance.length - presentCount : 0;

    return (
        <div className="mt-6 rounded-lg border border-slate-200 bg-white">
            <div className="flex items-center justify-between px-4 py-3">
                <h2 className="flex items-center gap-2 text-sm font-medium text-slate-700">
                    <CalendarCheck className="h-4 w-4 text-slate-400" />
                    My Attendance
                </h2>
                <button
                    onClick={getMyAttendance}
                    disabled={getAttendanceLoader}
                    className="rounded-md p-1.5 text-slate-400 transition hover:bg-slate-100 hover:text-slate-600 disabled:opacity-50"
                    title="Refresh"
                >
                    <RefreshCw className={`h-4 w-4 ${getAttendanceLoader ? "animate-spin" : ""}`} />
                </button>
            </div>

            <div className="border-t border-slate-100 p-4">
                {getAttendanceLoader ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-[#0A7E84]" />
                    </div>
                ) : !attendance || attendance.length === 0 ? (
                    <p className="py-6 text-center text-xs text-slate-400">
                        No attendance records found yet.
                    </p>
                ) : (
                    <>
                        <p className="mb-3 text-xs text-slate-500">
                            {presentCount} present · {absentCount} absent
                        </p>
                        <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                            {attendance.map((record) => {
                                console.log("record", record);
                                return (
                                    <div
                                        key={record._id}
                                        className="flex min-w-0 items-center justify-between gap-3 rounded-md border border-slate-100 bg-slate-50 px-3 py-2"
                                    >
                                        <p className="min-w-0 truncate text-sm font-medium text-slate-700">
                                            {new Date(record.date).toLocaleDateString("en-US", {
                                                weekday: "long",
                                                year: "numeric",
                                                month: "long",
                                                day: "numeric",
                                            })}
                                        </p>
                                        <span
                                            className={`shrink-0 rounded-full px-2 py-0.5 text-xs font-medium ${
                                                record.status === "present"
                                                    ? "bg-green-100 text-green-700"
                                                    : "bg-red-100 text-red-700"
                                            }`}
                                        >
                                            {record.status === "present" ? "Present" : "Absent"}
                                        </span>
                                    </div>
                                );
                            })}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MyAttendance;