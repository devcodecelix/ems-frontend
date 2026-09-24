import { Loader2, Users } from "lucide-react";
import useAdminHook from "../../hooks/useAdminHook";
import InternDetails from "../team/InternDetails";
import { Dialog } from "../ui/dialog";

const Teams = () => {
    const {
        batchFilter,
        setBatchFilter,
        domainFilter,
        setDomainFilter,
        searchQuery,
        setSearchQuery,
        setSelectedIntern,
        batchOptions,
        filteredInterns,
        allInterns,
        getAllInternsLoader,
        selectedIntern,
        batchLoader,
        makeBatchLeader,
        removeBatchLeader,
        removeLeaderLoader,
        deleteIntern,
        deleteInternLoader,
        setConfirmingDelete,
        confirmingDelete,
        locationFilter,
        setLocationFilter,
    } = useAdminHook();

    if (getAllInternsLoader) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#F7F8F8]">
                <Loader2 className="h-8 w-8 animate-spin text-[#0A7E84]" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F7F8F8] px-3 py-6 sm:px-6">
            <div className="mx-auto max-w-5xl">
                {/* Filters */}
                <div className="mb-4 flex flex-col gap-3 sm:flex-row">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search by name or email"
                        className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#0A7E84] focus:ring-1 focus:ring-[#0A7E84] sm:flex-1"
                    />

                    <select
                        value={batchFilter}
                        onChange={(e) => setBatchFilter(Number(e.target.value))}
                        className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#0A7E84] focus:ring-1 focus:ring-[#0A7E84] sm:w-48"
                    >
                        <option value={0}>All Batches</option>
                        {batchOptions.map((batch) => (
                            <option key={batch} value={batch}>
                                Batch {batch}
                            </option>
                        ))}
                    </select>

                    <select
                        value={domainFilter}
                        onChange={(e) => setDomainFilter(e.target.value)}
                        className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#0A7E84] focus:ring-1 focus:ring-[#0A7E84] sm:w-48"
                    >
                        <option value="all">All Domains</option>
                        <option value="web">Web</option>
                        <option value="ai">AI</option>
                        <option value="app">App</option>
                    </select>

                    <select
                        value={locationFilter}
                        onChange={(e) => setLocationFilter(e.target.value)}
                        className="h-10 w-full rounded-md border border-slate-200 bg-white px-3 text-sm text-slate-700 outline-none transition focus:border-[#0A7E84] focus:ring-1 focus:ring-[#0A7E84] sm:w-48"
                    >
                        <option value="all">All Locations</option>
                        <option value="remote">Remote</option>
                        <option value="onsite">On-site</option>
                    </select>
                </div>

                {filteredInterns.length === 0 ? (
                    <div className="rounded-lg border border-dashed border-slate-200 bg-white p-10 text-center text-sm text-slate-500">
                        No interns found.
                    </div>
                ) : (
                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-1">
                        {filteredInterns.map((intern) => (
                            <div
                                key={intern._id}
                                className="rounded-lg border border-slate-200 bg-white p-4"
                            >
                                <div className="flex flex-col lg:flex-row items-start justify-between gap-3">
                                    <div className="flex min-w-0 items-center gap-3">
                                        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-slate-100">
                                            <Users className="h-5 w-5 text-[#0A7E84]" />
                                        </div>

                                        <div className="min-w-0">
                                            <p className="truncate text-sm font-medium text-slate-700">
                                                {intern.email}
                                            </p>
                                            <p className="mt-0.5 text-xs text-slate-500">
                                                {intern.name ?? "-"}
                                            </p>
                                        </div>
                                    </div>
                                    {intern.batch?.leader && (
                                        <span className="mt-3 inline-block rounded-full bg-[#BFE9E6] px-2 py-1 text-xs font-medium text-[#0A7E84]">
                                            Batch Leader
                                        </span>
                                    )}
                                </div>

                                <div className="mt-3 grid grid-cols-2 gap-2 border-t border-slate-100 pt-3 text-xs text-slate-600 sm:grid-cols-4">
                                    <div>
                                        <span className="text-slate-400">Batch: </span>
                                        {intern.batch?.batchId ?? "-"}
                                    </div>
                                    <div>
                                        <span className="text-slate-400">Team: </span>
                                        {intern.batch?.domain ?? "-"}
                                    </div>
                                    <div>
                                        <span className="text-slate-400">Ref: </span>
                                        {intern.batch?.referenceNo ?? "-"}
                                    </div>
                                    <div>
                                        <span className="text-slate-400">Location: </span>
                                        {intern.batch?.location ?? "-"}
                                    </div>
                                </div>

                                <div className="mt-3 flex justify-end border-t border-slate-100 pt-3">
                                    <button
                                        onClick={() => setSelectedIntern(intern)}
                                        className="rounded-md border border-slate-200 bg-white px-3 py-1.5 text-sm font-medium text-[#0A7E84] transition-colors hover:bg-slate-50 hover:border-slate-300"
                                    >
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Intern details dialog */}
            <Dialog
                open={!!selectedIntern}
                onOpenChange={(open: any) => {
                    if (!open) {
                        setSelectedIntern(null);
                        setConfirmingDelete(false);
                    }
                }}
            >
                <InternDetails
                    selectedIntern={selectedIntern}
                    batchLoader={batchLoader}
                    hasBatchLeader={
                        !!selectedIntern &&
                        allInterns.some(
                            (intern) =>
                                intern._id !== selectedIntern._id &&
                                intern.batch?.batchId === selectedIntern.batch?.batchId &&
                                intern.batch?.domain === selectedIntern.batch?.domain &&
                                intern.batch?.location === selectedIntern.batch?.location &&
                                intern.batch?.leader
                        )
                    }
                    makeBatchLeader={makeBatchLeader}
                    removeBatchLeader={removeBatchLeader}
                    removeLeaderLoader={removeLeaderLoader}
                    deleteIntern={deleteIntern}
                    deleteInternLoader={deleteInternLoader}
                    setConfirmingDelete={setConfirmingDelete}
                    confirmingDelete={confirmingDelete}
                />
            </Dialog>
        </div>
    );
}

export default Teams