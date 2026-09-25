import { Check, Users, X } from 'lucide-react';
import type { User } from '../../interface';

const AttendanceList = ({
    allTeamMembers,
    presentIds,
    toggleId,
    alreadyMarked
}: {
    allTeamMembers: User[],
    presentIds: string[],
    toggleId: (id: string) => void,
    alreadyMarked: boolean
}) => {
    return (
        <>
            {allTeamMembers.length === 0 ? (
                <div className="rounded-lg border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
                    No team members found.
                </div>
            ) : (
                <div className="space-y-3">
                    {allTeamMembers.map((member) => {
                        const isPresent = presentIds.includes(member._id);

                        return (
                            <div
                                key={member._id}
                                className="flex flex-col items-start justify-between gap-3 rounded-lg border border-slate-200 bg-white p-4 sm:flex-row sm:items-center"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100">
                                        <Users className="h-5 w-5 text-[#0A7E84]" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="wrap-break-word text-sm font-medium text-slate-700">
                                            {member.name ?? "-"}
                                        </p>
                                        <p className="break-all text-xs text-slate-500">
                                            {member.email}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => toggleId(member._id)}
                                    disabled={alreadyMarked}
                                    className={`flex w-full items-center justify-center gap-1.5 rounded-md px-3 py-2 text-xs font-medium transition sm:w-auto sm:px-4 disabled:cursor-not-allowed disabled:opacity-60 ${isPresent
                                        ? "bg-green-600 text-white"
                                        : "bg-slate-100 text-slate-600 hover:bg-slate-200"
                                        }`}
                                >
                                    {isPresent ? (
                                        <Check className="h-3.5 w-3.5" />
                                    ) : (
                                        <X className="h-3.5 w-3.5" />
                                    )}
                                    {isPresent ? "Present" : "Absent"}
                                </button>
                            </div>
                        );
                    })}
                </div>
            )}
        </>
    )
}

export default AttendanceList
