import { Mail, Shield, Layers, Crown } from "lucide-react";
import useAuthStore from "../../store/useAuthStore";

const roleBadgeClass = (role?: string) =>
    role === "intern"
        ? "bg-green-100 text-green-700"
        : "bg-purple-100 text-purple-700"

const domainBadgeClass = (domain?: string) =>
    domain === "web"
        ? "bg-blue-100 text-blue-700"
        : domain === "ai"
            ? "bg-purple-100 text-purple-700"
            : domain === "app"
                ? "bg-orange-100 text-orange-700"
                : "bg-gray-100 text-gray-600";

const Profile = () => {
    const { user } = useAuthStore();

    if (!user) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <p className="text-sm text-gray-500">No user found.</p>
            </div>
        );
    }

    return (
        <div className="min-h-screen px-3 py-6 sm:px-6">
            <div className="mx-auto max-w-2xl">
                <div className="rounded-2xl border border-gray-200 bg-white p-6 shadow-lg">
                    <div className="flex items-center gap-4">
                        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-full bg-gray-100">
                            <Mail className="h-7 w-7 text-gray-500" />
                        </div>

                        <div className="min-w-0">
                            <p className="truncate text-base font-semibold text-gray-900">
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

                    <div className="mt-6 space-y-4 border-t border-gray-100 pt-5">
                        {user.role !== "admin" && <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-gray-500">
                                <Layers className="h-4 w-4" />
                                Batch
                            </span>
                            <span className="text-gray-900">
                                {user.name ?? "-"}
                                {user.batch?.batchId ? ` (#${user.batch.batchId})` : ""}
                            </span>
                        </div>}

                        {user.role !== "admin" && <div className="flex items-center justify-between text-sm">
                            <span className="flex items-center gap-2 text-gray-500">
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
                                <span className="text-gray-900">-</span>
                            )}
                        </div>}

                        {user.role !== "admin" && <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Reference No</span>
                            <span className="text-gray-900">
                                {user.batch?.referenceNo ?? "-"}
                            </span>
                        </div>}

                        <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-500">Joined</span>
                            <span className="text-gray-900">
                                {new Date(user.createdAt).toLocaleDateString()}
                            </span>
                        </div>
                    </div>

                    {user.batch?.leader && (
                        <div className="mt-5 flex items-center gap-2 rounded-xl bg-yellow-50 px-4 py-3 text-sm text-yellow-700">
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