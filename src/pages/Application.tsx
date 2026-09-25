import { useEffect, useState, type FormEvent } from "react";
import axiosInstance from "../lib/axios";
import { toast } from "react-toastify";
import useAuthStore from "../store/useAuthStore";
import { Loader2 } from "lucide-react";

interface FormState {
    batchId: string;
    domain: string;
    referenceNo: string;
    name: string;
    location: string;
}

interface FieldErrors {
    batchId?: string;
    domain?: string;
    referenceNo?: string;
    name?: string;
    location?: string;
}

const Application = () => {
    const { user, updateUser } = useAuthStore();
    const [form, setForm] = useState<FormState>({
        batchId: "",
        domain: "",
        referenceNo: "",
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

    const validate = (): boolean => {
        const { batchId, domain, referenceNo, name, location } = form;
        const errors: FieldErrors = {};

        if (!name.trim()) {
            errors.name = "Name is required.";
        }

        if (!batchId) {
            errors.batchId = "Please select your batch.";
        }

        if (!domain) {
            errors.domain = "Please select your domain.";
        }

        if (!location) {
            errors.location = "Please select your location.";
        }

        if (!referenceNo.trim()) {
            errors.referenceNo = "Please enter your reference number.";
        } else if (!referenceNo.trim().startsWith("CC")) {
            errors.referenceNo = "Invalid reference number.";
        }

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault();

        if (!validate()) {
            return;
        }

        setIsSubmitting(true);

        try {
            const response = await axiosInstance.post(
                "/api/v2/application",
                {
                    batchId: Number(form.batchId),
                    domain: form.domain,
                    referenceNo: form.referenceNo.trim(),
                    name: form.name.trim(),
                    location: form.location,
                }
            );

            updateUser(response.data);
            setAlreadySubmitted(true);

            toast.success("Application submitted successfully!");
        } catch (error: any) {
            toast.error(
                error.response?.data?.message ||
                "Failed to submit application."
            );
        } finally {
            setIsSubmitting(false);
        }
    };

    const isFormComplete =
        !!form.name.trim() &&
        !!form.batchId &&
        !!form.domain &&
        !!form.location &&
        !!form.referenceNo.trim();

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
                                    onChange={(e) => {
                                        setForm({ ...form, name: e.target.value });
                                        setFieldErrors((prev) => ({ ...prev, name: undefined }));
                                    }}
                                    placeholder="Enter your full name"
                                    className={`h-11 w-full rounded-md border bg-white px-3 text-sm text-slate-700 outline-none transition focus:ring-1 disabled:cursor-not-allowed disabled:opacity-60 ${fieldErrors.name
                                        ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                                        : "border-slate-200 focus:border-[#0A7E84] focus:ring-[#0A7E84]"
                                        }`}
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
                                    onChange={(e) => {
                                        setForm({ ...form, batchId: e.target.value });
                                        setFieldErrors((prev) => ({ ...prev, batchId: undefined }));
                                    }}
                                    className={`h-11 w-full rounded-md border bg-white px-3 text-sm text-slate-700 outline-none transition focus:ring-1 disabled:cursor-not-allowed disabled:opacity-60 ${fieldErrors.batchId
                                        ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                                        : "border-slate-200 focus:border-[#0A7E84] focus:ring-[#0A7E84]"
                                        }`}
                                >
                                    <option value="">
                                        Select your batch
                                    </option>
                                    <option value="13">Batch 13</option>
                                    <option value="14">Batch 14</option>
                                    <option value="15">Batch 15</option>
                                    <option value="16">Batch 16</option>
                                    <option value="17">Batch 17</option>
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
                                    onChange={(e) => {
                                        setForm({ ...form, domain: e.target.value });
                                        setFieldErrors((prev) => ({ ...prev, domain: undefined }));
                                    }}
                                    className={`h-11 w-full rounded-md border bg-white px-3 text-sm text-slate-700 outline-none transition focus:ring-1 disabled:cursor-not-allowed disabled:opacity-60 ${fieldErrors.domain
                                        ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                                        : "border-slate-200 focus:border-[#0A7E84] focus:ring-[#0A7E84]"
                                        }`}
                                >
                                    <option value="">
                                        Select your domain
                                    </option>
                                    <option value="web">Web Development</option>
                                    <option value="ai">Artificial Intelligence</option>
                                    <option value="app">App Development</option>
                                </select>
                            </div>

                            {/* location */}
                            <div>
                                <label
                                    htmlFor="domain"
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
                                    id="domain"
                                    value={form.location}
                                    disabled={isSubmitting}
                                    onChange={(e) => {
                                        setForm({ ...form, location: e.target.value });
                                        setFieldErrors((prev) => ({ ...prev, location: undefined }));
                                    }}
                                    className={`h-11 w-full rounded-md border bg-white px-3 text-sm text-slate-700 outline-none transition focus:ring-1 disabled:cursor-not-allowed disabled:opacity-60 ${fieldErrors.domain
                                        ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                                        : "border-slate-200 focus:border-[#0A7E84] focus:ring-[#0A7E84]"
                                        }`}
                                >
                                    <option value="">
                                        Select your domain
                                    </option>
                                    <option value="onsite">Onsite</option>
                                    <option value="remote">Remote</option>
                                </select>
                            </div>

                            {/* Reference Number */}
                            <div>
                                <label
                                    htmlFor="referenceNo"
                                    className="mb-2 block text-sm font-medium text-slate-700"
                                >
                                    Reference Number
                                </label>

                                {fieldErrors.referenceNo && (
                                    <p className="mb-1 text-sm text-red-500">
                                        {fieldErrors.referenceNo}
                                    </p>
                                )}

                                <input
                                    id="referenceNo"
                                    type="text"
                                    value={form.referenceNo}
                                    disabled={isSubmitting}
                                    onChange={(e) => {
                                        setForm({ ...form, referenceNo: e.target.value });
                                        setFieldErrors((prev) => ({ ...prev, referenceNo: undefined }));
                                    }}
                                    placeholder="CC101"
                                    className={`h-11 w-full rounded-md border bg-white px-3 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:ring-1 disabled:cursor-not-allowed disabled:opacity-60 ${fieldErrors.referenceNo
                                        ? "border-red-400 focus:border-red-500 focus:ring-red-500"
                                        : "border-slate-200 focus:border-[#0A7E84] focus:ring-[#0A7E84]"
                                        }`}
                                />
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
}

export default Application;