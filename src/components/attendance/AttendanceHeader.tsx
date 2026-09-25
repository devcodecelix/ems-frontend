import { CalendarDays, Loader2 } from 'lucide-react'
import type { User } from '../../interface';

const AttendanceHeader = ({
    today,
    allTeamMembers,
    isSaving,
    alreadyMarked,
    handleSave,
}: {
    today: string,
    allTeamMembers: User[],
    isSaving: boolean,
    alreadyMarked: boolean,
    handleSave: () => void,
}) => {

    return (
        <div className="mb-5 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
                <h1 className="text-lg font-semibold text-[#0F2D3A]">
                    Mark Attendance
                </h1>
                <p className="mt-0.5 flex items-center gap-1.5 text-xs text-slate-500">
                    <CalendarDays className="h-3.5 w-3.5" />
                    {new Date(today).toLocaleDateString("en-US", {
                        weekday: "long",
                        year: "numeric",
                        month: "long",
                        day: "numeric",
                    })}
                </p>
            </div>

            <div className="flex items-center gap-3">
                {!alreadyMarked && (
                    <button
                        onClick={handleSave}
                        disabled={isSaving || allTeamMembers.length === 0}
                        className="flex items-center gap-2 rounded-lg bg-[#0A7E84] px-4 py-2 text-sm font-medium text-white transition hover:bg-[#075F64] disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSaving && <Loader2 className="h-4 w-4 animate-spin" />}
                        {isSaving ? "Saving..." : "Save Attendance"}
                    </button>
                )}
            </div>
        </div>
    )
}

export default AttendanceHeader
