import { useEffect, useMemo } from "react";
import { Loader2 } from "lucide-react";
import useAdminStore from "../../store/useAdminStore";
import { batchOptions } from "../../lib/batches";

const AdminDashboard = () => {
    const { allInterns, getAllInterns, getAllInternsLoader } = useAdminStore();

    useEffect(() => {
        if (allInterns.length !== 0) return;
        getAllInterns();
    }, [getAllInterns]);

    const stats = useMemo(() => {
        const byDomain: Record<string, number> = { web: 0, ai: 0, app: 0 };
        allInterns.forEach((intern) => {
            const domain = intern.batch?.domain;
            if (domain) byDomain[domain] = (byDomain[domain] ?? 0) + 1;
        });
        return {
            byDomain,
        };
    }, [allInterns, batchOptions]);

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
                {/* Summary stats */}
                <div className="mb-5 grid grid-cols-2 gap-3 sm:grid-cols-4">
                    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
                        <p className="text-xs text-gray-400">Interns</p>
                        <p className="mt-1 text-2xl font-bold text-gray-900">
                            {allInterns.length}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
                        <p className="text-xs text-gray-400">Batches</p>
                        <p className="mt-1 text-2xl font-bold text-gray-900">
                            {batchOptions.length}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
                        <p className="text-xs text-gray-400">Remote / Onsite</p>
                        <p className="mt-1 text-2xl font-bold text-gray-900">
                            {allInterns.filter((intern) => intern.batch?.location === "remote").length}{" "}
                            /{" "}
                            {allInterns.filter((intern) => intern.batch?.location !== "remote").length}
                        </p>
                    </div>

                    <div className="rounded-2xl border border-gray-200 bg-white p-4 shadow-lg">
                        <p className="text-xs text-gray-400">Web / AI / APP</p>
                        <p className="mt-1 text-2xl font-bold text-gray-900">
                            {stats.byDomain.web} / {stats.byDomain.ai} / {stats.byDomain.app}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default AdminDashboard
