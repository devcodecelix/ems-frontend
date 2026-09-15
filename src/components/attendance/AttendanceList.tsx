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
                <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 shadow-lg">
                    No team members found.
                </div>
            ) : (
                <div className="space-y-3">
                    {allTeamMembers.map((member) => {
                        const isPresent = presentIds.includes(member._id);

                        return (
                            <div
                                key={member._id}
                                className="flex flex-col items-start justify-between gap-3 rounded-2xl border border-gray-200 bg-white p-4 shadow-lg sm:flex-row sm:items-center"
                            >
                                <div className="flex min-w-0 items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
                                        <Users className="h-5 w-5 text-gray-500" />
                                    </div>
                                    <div className="min-w-0">
                                        <p className="truncate text-sm font-medium text-gray-900">
                                            {member.name ?? "-"}
                                        </p>
                                        <p className="truncate text-xs text-gray-500">
                                            {member.email}
                                        </p>
                                    </div>
                                </div>

                                <button
                                    onClick={() => toggleId(member._id)}
                                    disabled={alreadyMarked}
                                    className={`flex w-full items-center justify-center gap-1.5 rounded-lg px-3 py-2 text-xs font-medium transition sm:w-auto sm:px-4 disabled:cursor-not-allowed disabled:opacity-60 ${isPresent
                                        ? "bg-green-600 text-white"
                                        : "bg-gray-100 text-gray-500 hover:bg-gray-200"
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
