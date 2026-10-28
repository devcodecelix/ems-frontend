import { useEffect, useState, type FormEvent } from "react";
import axiosInstance from "../lib/axios";
import { toast } from "react-toastify";
import useAuthStore from "../store/useAuthStore";
import { Loader2 } from "lucide-react";
import { batchOptions } from "../lib/batches";

interface FormState {
    batchId: string;
    domain: string;
    rollNo: string;
    name: string;
    location: string;
}

interface FieldErrors {
    batchId?: string;
    domain?: string;
    rollNo?: string;
    name?: string;
    location?: string;
}

// Roll no 01 - 50
const ROLL_NUMBERS = Array.from({ length: 50 }, (_, i) =>
    String(i + 1).padStart(2, "0")
);

const fieldClass = (hasError?: boolean) =>
    `h-11 w-full rounded-md border bg-white px-3 text-sm text-slate-700 outline-none transition focus:ring-1 disabled:cursor-not-allowed disabled:opacity-60 ${
        hasError
            ? "border-red-400 focus:border-red-500 focus:ring-red-500"
            : "border-slate-200 focus:border-[#0A7E84] focus:ring-[#0A7E84]"
    }`;

const Application = () => {
    const { user, updateUser } = useAuthStore();
    const [form, setForm] = useState<FormState>({
        batchId: "",
        domain: "",
        rollNo: "",
        name: "",
        location: "",
    });

    const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [alreadySubmitted, setAlreadySubmitted] = useState(false);

    useEffect(() => {
        if (user?.role === "applied") {
            setAlreadySubmitted(true);
        }
    }, [user]);

    // B17-web-01
    const referenceNo =
        form.batchId && form.domain && form.rollNo
            ? `B${form.batchId}-${form.domain}-${form.rollNo}`
            : "";

    const handleChange = (field: keyof FormState, value: string) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        setFieldErrors((prev) => ({ ...prev, [field]: undefined }));
    };

    const validate = (): boolean => {
        const { batchId, domain, rollNo, name, location } = form;
        const errors: FieldErrors = {};

        if (!name.trim()) errors.name = "Name is required.";
        if (!batchId) errors.batchId = "Please select your batch.";
        if (!domain) errors.domain = "Please select your domain.";
        if (!rollNo) errors.rollNo = "Please select your roll number.";
        if (!location) errors.location = "Please select your location.";

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validate()) return;

        setIsSubmitting(true);

        try {
            const response = await axiosInstance.post("/api/v2/application", {
                batchId: Number(form.batchId),
                domain: form.domain,
                rollNo: form.rollNo,
                name: form.name.trim(),
                location: form.location,
            });

            updateUser(response.data);
            setAlreadySubmitted(true);

            toast.success("Application submitted successfully!");
        } catch (error: any) {
            toast.error(
                error.response?.data?.message || "Failed to submit application."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormComplete =
        !!form.name.trim() &&
        !!form.batchId &&
        !!form.domain &&
        !!form.rollNo &&
        !!form.location;

    return (
        <div className="flex min-h-screen items-center justify-center bg-[#F7F8F8] px-4 py-10">
            <div className="w-full max-w-sm">
                {/* Header */}
                <div className="mb-8 flex flex-col items-center text-center">
                    <img
                        src="/codecelix-logo.png"
                        alt="Codecelix"
                        className="h-14 w-auto"
                    />

                    <h1 className="mt-4 text-xl font-semibold text-[#0F2D3A]">
                        Internship Application
                    </h1>

                    {!alreadySubmitted && (
                        <p className="mt-2 text-sm text-slate-500">
                            Complete your application to continue
                        </p>
                    )}
                </div>

                {/* Card */}
                <div className="rounded-lg border border-slate-200 bg-white p-6">
                    {alreadySubmitted ? (
                        <div className="py-6 text-center">
                            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-green-100">
                                <svg
                                    xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 24 24"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="2"
                                    className="h-6 w-6 text-green-600"
                                >
                                    <path
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                        d="m5 12 4 4L19 6"
                                    />
                                </svg>
                            </div>

                            <h2 className="text-lg font-semibold text-[#0F2D3A]">
                                Application Submitted
                            </h2>

                            <p className="mt-2 text-sm text-slate-500">
                                Your application has been submitted
                                successfully.
                            </p>

                            <p className="mt-1 text-sm text-slate-500">
                                Please wait for further updates.
                            </p>
                        </div>
                    ) : (
                        <form
                            onSubmit={handleSubmit}
                            className="space-y-5"
                            noValidate
                        >
                            {/* Name */}
                            <div>
                                <label
                                    htmlFor="name"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Name
                                </label>

                                {fieldErrors.name && (
                                    <p className="mb-1 text-sm text-red-500">
                                        {fieldErrors.name}
                                    </p>
                                )}

                                <input
                                    id="name"
                                    type="text"
                                    value={form.name}
                                    disabled={isSubmitting}
                                    onChange={(e) =>
                                        handleChange("name", e.target.value)
                                    }
                                    placeholder="Enter your full name"
                                    className={fieldClass(!!fieldErrors.name)}
                                />
                            </div>

                            {/* Batch */}
                            <div>
                                <label
                                    htmlFor="batchId"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Batch
                                </label>

                                {fieldErrors.batchId && (
                                    <p className="mb-1 text-sm text-red-500">
                                        {fieldErrors.batchId}
                                    </p>
                                )}

                                <select
                                    id="batchId"
                                    value={form.batchId}
                                    disabled={isSubmitting}
                                    onChange={(e) =>
                                        handleChange("batchId", e.target.value)
                                    }
                                    className={fieldClass(!!fieldErrors.batchId)}
                                >
                                    <option value="">Select your batch</option>
                                    {batchOptions.map((b) => (
                                        <option key={b} value={b}>
                                            Batch {b}
                                        </option>
                                    ))}
                                </select>
                            </div>

                            {/* Domain */}
                            <div>
                                <label
                                    htmlFor="domain"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Domain
                                </label>

                                {fieldErrors.domain && (
                                    <p className="mb-1 text-sm text-red-500">
                                        {fieldErrors.domain}
                                    </p>
                                )}

                                <select
                                    id="domain"
                                    value={form.domain}
                                    disabled={isSubmitting}
                                    onChange={(e) =>
                                        handleChange("domain", e.target.value)
                                    }
                                    className={fieldClass(!!fieldErrors.domain)}
                                >
                                    <option value="">Select your domain</option>
                                    <option value="WEB">Web Development</option>
                                    <option value="AI">Artificial Intelligence</option>
                                    <option value="APP">App Development</option>
                                    <option value="UIUX">UI/UX Design</option>
                                </select>
                            </div>

                            {/* Roll No */}
                            <div>
                                <label
                                    htmlFor="rollNo"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Roll No
                                </label>

                                {fieldErrors.rollNo && (
                                    <p className="mb-1 text-sm text-red-500">
                                        {fieldErrors.rollNo}
                                    </p>
                                )}

                                <select
                                    id="rollNo"
                                    value={form.rollNo}
                                    disabled={isSubmitting}
                                    onChange={(e) =>
                                        handleChange("rollNo", e.target.value)
                                    }
                                    className={fieldClass(!!fieldErrors.rollNo)}
                                >
                                    <option value="">Select your roll number</option>
                                    {ROLL_NUMBERS.map((r) => (
                                        <option key={r} value={r}>
                                            {r}
                                        </option>
                                    ))}
                                </select>

                                {referenceNo && (
                                    <p className="mt-2 text-xs text-slate-500">
                                        Reference No:{" "}
                                        <span className="font-semibold text-[#0A7E84]">
                                            {referenceNo}
                                        </span>
                                    </p>
                                )}
                            </div>

                            {/* Location */}
                            <div>
                                <label
                                    htmlFor="location"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Location
                                </label>

                                {fieldErrors.location && (
                                    <p className="mb-1 text-sm text-red-500">
                                        {fieldErrors.location}
                                    </p>
                                )}

                                <select
                                    id="location"
                                    value={form.location}
                                    disabled={isSubmitting}
                                    onChange={(e) =>
                                        handleChange("location", e.target.value)
                                    }
                                    className={fieldClass(!!fieldErrors.location)}
                                >
                                    <option value="">Select your location</option>
                                    <option value="onsite">Onsite</option>
                                    <option value="remote">Remote</option>
                                </select>
                            </div>

                            {/* Submit */}
                            <button
                                type="submit"
                                disabled={isSubmitting || !isFormComplete}
                                className="flex w-full items-center justify-center gap-2 rounded-md bg-[#0A7E84] px-4 py-3 text-sm font-medium text-white transition hover:bg-[#075F64] disabled:cursor-not-allowed disabled:opacity-70"
                            >
                                {isSubmitting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                        Submitting...
                                    </>
                                ) : (
                                    "Submit Application"
                                )}
                            </button>
                        </form>
                    )}
                </div>

                {/* logout */}
                {alreadySubmitted && (
                    <div className="mt-6 text-center">
                        <button
                            onClick={useAuthStore.getState().logout}
                            className="flex w-full items-center justify-center gap-2 rounded-md bg-[#0A7E84] py-3 text-sm font-medium text-white transition hover:bg-[#075F64]"
                        >
                            Logout
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Application;