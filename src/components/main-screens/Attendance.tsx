import { Loader2 } from "lucide-react";
import AttendanceList from "../attendance/AttendanceList";
import AlreadyMarked from "../attendance/AlreadyMarked";
import AttendanceHeader from "../attendance/AttendanceHeader";
import MyAttendance from "../attendance/MyAttendance";
import useAttendanceHook from "../../hooks/useAttendanceHook";

const Attendance = () => {
    const {
        today,
        allTeamMembers,
        presentIds,
        isSaving,
        isCheckingStatus,
        alreadyMarked,
        toggleId,
        handleSave,
        getAllTeamMembersLoader,
        attendance,
        user,
        getMyAttendance,
        getAttendanceLoader
    } = useAttendanceHook();

    if (getAllTeamMembersLoader) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#F7F8F8]">
                <Loader2 className="h-8 w-8 animate-spin text-[#0A7E84]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F7F8F8] px-3 py-3 sm:px-6">
            <div className="mx-auto max-w-5xl">

                {/* Leader-only marking flow */}
                {user?.batch.leader && (
                    <>
                        {isCheckingStatus ? (
                            <div className="flex items-center gap-2 rounded-lg bg-slate-200 px-4 py-2 animate-pulse">
                                <div className="h-4 w-4 rounded-full bg-slate-300" />
                                <div className="h-4 w-28 rounded bg-slate-300" />
                            </div>
                        ) : alreadyMarked ? (
                            <AlreadyMarked />
                        ) : (
                            <>
                                <AttendanceHeader
                                    today={today}
                                    allTeamMembers={allTeamMembers}
                                    isSaving={isSaving}
                                    alreadyMarked={alreadyMarked}
                                    handleSave={handleSave}
                                />

                                <AttendanceList
                                    allTeamMembers={allTeamMembers}
                                    presentIds={presentIds}
                                    toggleId={toggleId}
                                    alreadyMarked={alreadyMarked}
                                />
                            </>
                        )}
                    </>
                )}

                {/* Every user's own attendance history */}
                <MyAttendance
                    getMyAttendance={getMyAttendance}
                    getAttendanceLoader={getAttendanceLoader}
                    attendance={attendance}
                />
            </div>
        </div>
    );
}

export default Attendance;
