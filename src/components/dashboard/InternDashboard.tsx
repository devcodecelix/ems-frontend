import useInternStore from "../../store/useInternStore";
import { Loader2, Users } from "lucide-react";

const InternDashboard = () => {

    const { stats, allTeamMembers, getAllTeamMembersLoader } = useInternStore();

    if (getAllTeamMembersLoader) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#F7F8F8]">
                <Loader2 className="h-8 w-8 animate-spin text-[#0A7E84]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F7F8F8] px-3 py-6 sm:px-6">
            <div className="mx-auto max-w-4xl">
                {/* Summary stats */}
                <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-2">
                    <div className="rounded-lg border border-slate-200 bg-white p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Team Members</p>
                        <p className="mt-1 text-2xl font-semibold text-[#0F2D3A]">
                            {stats.batchInternCount}
                        </p>
                    </div>
                    <div className="rounded-lg border border-slate-200 bg-white p-4">
                        <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-slate-400">Leader</p>
                        <p className="mt-1 text-2xl font-semibold text-[#0F2D3A]">
                            {stats.batchLeader}
                        </p>
                    </div>
                </div>

                {
                    allTeamMembers.length === 0 ? (
                        <div className="rounded-lg border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
                            No interns found.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-1">
                            {allTeamMembers.map((intern) => (
                                <div
                                    key={intern._id}
                                    className="min-w-0 rounded-lg border border-slate-200 bg-white p-4"
                                >
                                    <div className="flex flex-col lg:flex-row items-start justify-between gap-3">
                                        <div className="flex min-w-0 items-center gap-3">
                                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100">
                                                <Users className="h-5 w-5 text-[#0A7E84]" />
                                            </div>

                                            <div className="min-w-0">
                                                <p className="break-all text-sm font-medium text-slate-700">
                                                    {intern.email}
                                                </p>
                                                <p className="mt-0.5 break-words text-xs text-slate-500">
                                                    {intern.name ?? "-"}
                                                </p>
                                            </div>
                                        </div>
                                        {intern.batch?.leader && (
                                            <span className="mt-3 inline-block shrink-0 rounded-full bg-[#BFE9E6] px-2 py-1 text-xs font-medium text-[#0A7E84]">
                                                Batch Leader
                                            </span>
                                        )}
                                    </div>

                                    <div className="mt-3 grid min-w-0 grid-cols-3 gap-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
                                        <div className="min-w-0 break-words">
                                            <span className="text-slate-400">Batch: </span>
                                            {intern.batch?.batchId ?? "-"}
                                        </div>
                                        <div className="min-w-0 break-words">
                                            <span className="text-slate-400">Team: </span>
                                            {intern.batch?.domain ?? "-"}
                                        </div>
                                        <div className="min-w-0 break-words">
                                            <span className="text-slate-400">Ref: </span>
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