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
        getAllInternsLoader,
        selectedIntern,
        batchLoader,
        makeBatchLeader,
        deleteIntern,
        deleteInternLoader,
        setConfirmingDelete,
        confirmingDelete,
        locationFilter,
        setLocationFilter,
    } = useAdminHook();

    if (getAllInternsLoader) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen px-3 py-6 sm:px-6">
            <div className="mx-auto max-w-5xl">
                <div className="mx-auto max-w-5xl">
                    {/* Filters */}
                    <div className="mb-5 flex flex-col gap-3 sm:flex-row">

                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Search by name or email"
                            className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition placeholder:text-gray-400 focus:border-gray-900 focus:ring-1 focus:ring-gray-900 sm:flex-1"
                        />

                        <select
                            value={batchFilter}
                            onChange={(e) => setBatchFilter(Number(e.target.value))}
                            className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 sm:w-48"
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
                            className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 sm:w-48"
                        >
                            <option value="all">All Domains</option>
                            <option value="web">Web</option>
                            <option value="ai">AI</option>
                            <option value="app">App</option>
                        </select>

                        <select
                            value={locationFilter}
                            onChange={(e) => setLocationFilter(e.target.value)}
                            className="h-11 w-full rounded-xl border border-gray-300 bg-white px-3 text-sm text-gray-700 outline-none transition focus:border-gray-900 focus:ring-1 focus:ring-gray-900 sm:w-48"
                        >
                            <option value="all">All Locations</option>
                            <option value="remote">Remote</option>
                            <option value="onsite">On-site</option>
                        </select>
                    </div>

                    {filteredInterns.length === 0 ? (
                        <div className="rounded-2xl border border-gray-200 bg-white p-8 text-center text-sm text-gray-500 shadow-lg">
                            No interns found.
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 gap-3 sm:grid-cols-1">
                            {filteredInterns.map((intern) => (
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


                                    <div className="mt-3 grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs text-gray-600">
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
                                        <div>
                                            <span className="text-gray-400">Location: </span>
                                            {intern.batch?.location ?? "-"}
                                        </div>
                                    </div>

                                    <div className="flex justify-end py-3">
                                        <button
                                            onClick={() => setSelectedIntern(intern)}
                                            className="rounded-lg text-blue-600 text-sm font-medium hover:underline"
                                        >
                                            View Details
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
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
                    makeBatchLeader={makeBatchLeader}
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
