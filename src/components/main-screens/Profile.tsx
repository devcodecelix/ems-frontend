import { Shield, Layers, Crown } from "lucide-react";
import useAuthStore from "../../store/useAuthStore";

const roleBadgeClass = (role?: string) =>
    role === "intern"
        ? "bg-green-100 text-green-700"
        : "bg-purple-100 text-purple-700"

const domainBadgeClass = (domain?: string) =>
    domain === "web"
        ? "bg-[#BFE9E6] text-[#0A7E84]"
        : domain === "ai"
            ? "bg-purple-100 text-purple-700"
            : domain === "app"
                ? "bg-orange-100 text-orange-700"
                : "bg-slate-100 text-slate-600";

const Profile = () => {
    const { user } = useAuthStore();

    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center bg-[#F7F8F8]">
                <p className="text-sm text-slate-500">No user found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-[#F7F8F8] px-3 py-6 sm:px-6">
            <div className="mx-auto max-w-2xl">
                <div className="rounded-lg border border-slate-200 bg-white p-6">
                    <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-slate-100 text-lg font-semibold text-slate-700">
                            {user.email.charAt(0).toUpperCase()}
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-base font-semibold text-[#0F2D3A]">
                                {user.email}
                            </p>

                            <span
                                className={`mt-1 inline-block rounded-full px-2 py-1 text-xs font-medium ${roleBadgeClass(
                                    user.role
                                )}`}
                            >
                                {user.role}
                            </span>
                        </div>
                    </div>

                    <div className="mt-6 space-y-4 border-t border-slate-100 pt-5">
                        {user.role !== "admin" && <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-slate-500">
                                <Layers className="h-4 w-4" />
                                Batch
                            </span>
                            <span className="text-slate-700">
                                {user.name ?? "-"}
                                {user.batch?.batchId ? ` (#${user.batch.batchId})` : ""}
                            </span>
                        </div>}

                        {user.role !== "admin" && <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-slate-500">
                                <Shield className="h-4 w-4" />
                                Team
                            </span>
                            {user.batch?.domain ? (
                                <span
                                    className={`rounded-full px-2 py-1 text-xs font-medium ${domainBadgeClass(
                                        user.batch.domain
                                    )}`}
                                >
                                    {user.batch.domain}
                                </span>
                            ) : (
                                <span className="text-slate-700">-</span>
                            )}
                        </div>}

                        {user.role !== "admin" && <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Reference No</span>
                            <span className="text-slate-700">
                                {user.batch?.referenceNo ?? "-"}
                            </span>
                        </div>}

                        <div className="flex items-center justify-between text-sm">
                            <span className="text-slate-500">Joined</span>
                            <span className="text-slate-700">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    {user.batch?.leader && (
                        <div className="mt-5 flex items-center gap-2 rounded-md bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
                            <Crown className="h-4 w-4" />
                            You are the batch leader
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;