import { useEffect, useMemo, useState } from "react";
import { Loader2, FolderKanban, CheckCircle2 } from "lucide-react";
import useAdminStore from "../../store/useAdminStore";

const Project = () => {
    const { allInterns, getAllInterns, getAllInternsLoader } = useAdminStore();

    const [selectedBatch, setSelectedBatch] = useState<string>("");
    const [projectTitle, setProjectTitle] = useState("");
    const [projectDescription, setProjectDescription] = useState("");
    const [deadline, setDeadline] = useState("");
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [successMessage, setSuccessMessage] = useState<string | null>(null);
    const [errorMessage, setErrorMessage] = useState<string | null>(null);

    useEffect(() => {
        if (allInterns.length !== 0) return;
        getAllInterns();
    }, [getAllInterns]);

    const batchOptions = useMemo(() => {
        const ids = new Set<number>();
        allInterns.forEach((intern) => {
            if (intern.batch?.batchId) ids.add(intern.batch.batchId);
        });
        return Array.from(ids).sort((a, b) => b - a); // 16, 15, 14...
    }, [allInterns]);

    const memberCountByBatch = useMemo(() => {
        const counts: Record<string, number> = {};
        allInterns.forEach((intern) => {
            if (!intern.batch?.batchId) return;
            const key = String(intern.batch.batchId);
            counts[key] = (counts[key] ?? 0) + 1;
        });
        return counts;
    }, [allInterns]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setErrorMessage(null);
        setSuccessMessage(null);

        if (!selectedBatch) {
            setErrorMessage("Please select a team/batch first.");
            return;
        }
        if (!projectTitle.trim()) {
            setErrorMessage("Project title is required.");
            return;
        }

        try {
            setIsSubmitting(true);

            // TODO: replace with your actual store/API call, e.g.:
            // await useAdminStore.getState().assignProjectToBatch({
            //   batchId: Number(selectedBatch),
            //   title: projectTitle,
            //   description: projectDescription,
            //   deadline,
            // });

            await new Promise((resolve) => setTimeout(resolve, 800)); // temp mock delay

            setSuccessMessage(
                `"${projectTitle}" assigned to Batch ${selectedBatch} successfully.`
            );
            setProjectTitle("");
            setProjectDescription("");
            setDeadline("");
            setSelectedBatch("");
        } catch (err) {
            setErrorMessage("Failed to assign project. Please try again.");
        } finally {
            setIsSubmitting(false);
        }
    };

    if (getAllInternsLoader) {
        return (
            <div className="flex min-h-screen items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
            </div>
        );
    }

    return (
        <div className="min-h-screen px-3 py-6 sm:px-6">
            <div className="mx-auto max-w-xl">
                <div className="mb-5 flex items-center gap-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100">
                        <FolderKanban className="h-5 w-5 text-blue-600" />
                    </div>
                    <div>
                        <h1 className="text-lg font-semibold text-gray-900">
                            Assign Project
                        </h1>
                        <p className="text-xs text-gray-500">
                            Assign a new project to any team/batch
                        </p>
                    </div>
                </div>

                <form
                    onSubmit={handleSubmit}
                    className="space-y-4 rounded-2xl border border-gray-200 bg-white p-5 shadow-lg"
                >
                    {/* Batch/team select */}
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600">
                            Select Team (Batch)
                        </label>
                        <select
                            value={selectedBatch}
                            onChange={(e) => setSelectedBatch(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-400 focus:bg-white"
                        >
                            <option value="">-- Select a batch --</option>
                            {batchOptions.map((batchId) => (
                                <option key={batchId} value={String(batchId)}>
                                    Batch {batchId} ({memberCountByBatch[String(batchId)] ?? 0}{" "}
                                    members)
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Project title */}
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600">
                            Project Title
                        </label>
                        <input
                            type="text"
                            value={projectTitle}
                            onChange={(e) => setProjectTitle(e.target.value)}
                            placeholder="e.g. Internship Attendance System"
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-400 focus:bg-white"
                        />
                    </div>

                    {/* Description */}
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600">
                            Description
                        </label>
                        <textarea
                            value={projectDescription}
                            onChange={(e) => setProjectDescription(e.target.value)}
                            placeholder="Brief description of the project..."
                            rows={4}
                            className="w-full resize-none rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-400 focus:bg-white"
                        />
                    </div>

                    {/* Deadline */}
                    <div>
                        <label className="mb-1 block text-xs font-medium text-gray-600">
                            Deadline
                        </label>
                        <input
                            type="date"
                            value={deadline}
                            onChange={(e) => setDeadline(e.target.value)}
                            className="w-full rounded-lg border border-gray-200 bg-gray-50 px-3 py-2 text-sm text-gray-800 outline-none focus:border-blue-400 focus:bg-white"
                        />
                    </div>

                    {/* Feedback messages */}
                    {errorMessage && (
                        <p className="text-xs font-medium text-red-600">{errorMessage}</p>
                    )}
                    {successMessage && (
                        <p className="flex items-center gap-1.5 text-xs font-medium text-green-600">
                            <CheckCircle2 className="h-3.5 w-3.5" />
                            {successMessage}
                        </p>
                    )}

                    <button
                        type="submit"
                        disabled={isSubmitting}
                        className="flex w-full items-center justify-center gap-2 rounded-lg bg-blue-600 py-2.5 text-sm font-medium text-white transition hover:bg-blue-700 disabled:cursor-not-allowed disabled:opacity-50"
                    >
                        {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
                        {isSubmitting ? "Assigning..." : "Assign Project"}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default Project;