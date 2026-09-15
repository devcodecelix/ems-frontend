import { Loader2, CalendarCheck, RefreshCw } from "lucide-react";

const MyAttendance = ({ getMyAttendance, getAttendanceLoader, attendance }: {
    getMyAttendance: () => void,
    getAttendanceLoader: boolean,
    attendance: { _id: string, date: string }[] | null
}) => {

    return (
        <div className="mt-6 rounded-2xl border border-gray-200 bg-white shadow-lg">
            <div className="flex items-center justify-between px-4 py-3">
                <h2 className="flex items-center gap-2 text-sm font-medium text-gray-900">
                    <CalendarCheck className="h-4 w-4 text-gray-400" />
                    My Attendance
                </h2>
                <button
                    onClick={getMyAttendance}
                    disabled={getAttendanceLoader}
                    className="rounded-lg p-1.5 text-gray-400 transition hover:bg-gray-100 hover:text-gray-600 disabled:opacity-50"
                    title="Refresh"
                >
                    <RefreshCw className={`h-4 w-4 ${getAttendanceLoader ? "animate-spin" : ""}`} />
                </button>
            </div>

            <div className="border-t border-gray-100 p-4">
                {getAttendanceLoader ? (
                    <div className="flex items-center justify-center py-8">
                        <Loader2 className="h-6 w-6 animate-spin text-gray-400" />
                    </div>
                ) : !attendance || attendance.length === 0 ? (
                    <p className="py-6 text-center text-xs text-gray-400">
                        No attendance records found yet.
                    </p>
                ) : (
                    <>
                        <p className="mb-3 text-xs text-gray-500">
                            Present on {attendance.length}{" "}
                            {attendance.length === 1 ? "day" : "days"}
                        </p>
                        <div className="max-h-72 space-y-2 overflow-y-auto pr-1">
                            {attendance.map((record) => (
                                <div
                                    key={record._id}
                                    className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 px-3 py-2"
                                >
                                    <p className="text-sm font-medium text-gray-800">
                                        {new Date(record.date).toLocaleDateString("en-US", {
                                            weekday: "long",
                                            year: "numeric",
                                            month: "long",
                                            day: "numeric",
                                        })}
                                    </p>
                                    <span className="rounded-full bg-green-100 px-2 py-0.5 text-xs font-medium text-green-700">
                                        Present
                                    </span>
                                </div>
                            ))}
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default MyAttendance;