import useInternStore from "../../store/useInternStore";
import { Loader2, Users } from "lucide-react";

const InternDashboard = () => {

    const { stats, allTeamMembers, getAllTeamMembersLoader } = useInternStore();

    if (getAllTeamMembersLoader) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen px-3 py-6 sm:px-6">
            <div className="mx-auto max-w-5xl">
                {/* Summary stats */}
                <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-2">
                    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
                        <p className="text-xs text-gray-400">Team Members</p>
                        <p className="mt-1 text-2xl font-bold text-gray-900">
                            {stats.batchInternCount}
                        </p>
                    </div>
                    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
                        <p className="text-xs text-gray-400">Leader</p>
                        <p className="mt-1 text-2xl font-bold text-gray-900">
                            {stats.batchLeader}
                        </p>
                    </div>
                </div>

                {
                    allTeamMembers.length === 0 ? (
                        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 shadow-lg">
                            No interns found.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-1">
                            {allTeamMembers.map((intern) => (
                                <div
                                    key={intern._id}
                                    className="rounded-2xl border border-gray-200 bg-white p-4 shadow-lg"
                                >
                                    <div className="flex flex-col lg:flex-row items-start justify-between gap-3">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-gray-100">
                                                <Users className="h-5 w-5 text-gray-500" />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="truncate text-sm font-medium text-gray-900">
                                                    {intern.email}
                                                </p>
                                                <p className="mt-0.5 text-xs text-gray-500">
                                                    {intern.name ?? "-"}
                                                </p>
                                            </div>
                                        </div>
                                        {intern.batch?.leader && (
                                            <span className="mt-3 inline-block rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                                                Batch Leader
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-3 grid grid-cols-3 gap-2 text-xs text-gray-600">
                                        <div>
                                            <span className="text-gray-400">Batch: </span>
                                            {intern.batch?.batchId ?? "-"}
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Team: </span>
                                            {intern.batch?.domain ?? "-"}
                                        </div>
                                        <div>
                                            <span className="text-gray-400">Ref: </span>
                                            {intern.batch?.referenceNo ?? "-"}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}

            </div>
        </div>
    );
}

export default InternDashboard