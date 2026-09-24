import {
  AlertCircle,
  Calendar,
  FileText,
  FolderKanban,
  Globe,
  Loader2,
  MapPin,
  Users,
} from 'lucide-react';
import { DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { useEffect, useState } from 'react';
import useAdminStore from '../../store/useAdminStore';
import { batchOptions } from '../../lib/batches';
import { toast } from 'react-toastify';
import axiosInstance from '../../lib/axios';

const AddNewProject = ({ onSuccess }: { onSuccess: () => void }) => {
  const { allInterns, getAllInterns, getAllInternsLoader } = useAdminStore();

  const [selectedBatch, setSelectedBatch] = useState<string>("");
  const [selectedDomain, setSelectedDomain] = useState<string>("");
  const [selectedLocation, setSelectedLocation] = useState<string>("");
  const [projectTitle, setProjectTitle] = useState("");
  const [projectDescription, setProjectDescription] = useState("");
  const [deadline, setDeadline] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const getTodayLocal = () => {
    const now = new Date();
    const offset = now.getTimezoneOffset();
    const local = new Date(now.getTime() - offset * 60 * 1000);
    return local.toISOString().split("T")[0];
  };

  const getMaxDate = () => {
    const now = new Date();
    now.setMonth(now.getMonth() + 3);
    const offset = now.getTimezoneOffset();
    const local = new Date(now.getTime() - offset * 60 * 1000);
    return local.toISOString().split("T")[0];
  };

  useEffect(() => {
    if (allInterns.length !== 0) return;
    getAllInterns();
  }, [getAllInterns]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!selectedBatch) {
      setErrorMessage("Please select a batch");
      return;
    }

    if (!selectedDomain) {
      setErrorMessage("Please select a domain.");
      return;
    }

    if (!selectedLocation) {
      setErrorMessage("Please select a location.");
      return;
    }

    if (!projectTitle.trim()) {
      setErrorMessage("Project title is required.");
      return;
    }

    if (!deadline) {
      setErrorMessage("Please select a deadline.");
      return;
    }

    try {
      setIsSubmitting(true);

      const response = await axiosInstance.post("/api/v5/admin/project", {
        title: projectTitle,
        description: projectDescription,
        batchId: selectedBatch,
        domain: selectedDomain,
        location: selectedLocation,
        deadline: deadline,
      });

      onSuccess();
      useAdminStore.getState().addNewProject(response.data);
      toast.success("Project assigned successfully!");

      setProjectTitle("");
      setProjectDescription("");
      setDeadline("");
      setSelectedBatch("");
      setSelectedDomain("");
      setSelectedLocation("");
    } catch (error: any) {
      toast.error(error?.response?.data?.message || "Failed to assign project. Please try again.");
      setErrorMessage("Failed to assign project. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const selectClass =
    "w-full appearance-none rounded-md border border-slate-200 bg-white px-3 py-2.5 pl-9 text-sm text-slate-700 outline-none transition focus:border-[#0A7E84] focus:ring-1 focus:ring-[#0A7E84]";

  const inputClass =
    "w-full rounded-md border border-slate-200 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-[#0A7E84] focus:ring-1 focus:ring-[#0A7E84]";

  return (
    <DialogContent className="sm:max-w-lg">
      <DialogHeader>
        <DialogTitle className="flex items-center gap-3">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-md bg-[#0A7E84]">
            <FolderKanban className="h-5 w-5 text-white" />
          </div>
          <div className="min-w-0">
            <p className="truncate text-sm font-semibold text-slate-800">
              Assign Project
            </p>
            <p className="truncate text-xs font-normal text-slate-500">
              Assign a new project to any team/batch
            </p>
          </div>
        </DialogTitle>
      </DialogHeader>

      {getAllInternsLoader ? (
        <div className="flex items-center justify-center py-16">
          <Loader2 className="h-6 w-6 animate-spin text-[#0A7E84]" />
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-5 pt-2">
          {/* Batch / Domain / Location — grouped */}
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">
                Team (Batch)
              </label>
              <div className="relative">
                <Users className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select
                  value={selectedBatch}
                  onChange={(e) => setSelectedBatch(e.target.value)}
                  className={selectClass}
                >
                  <option value="">Select</option>
                  {batchOptions.map((batch) => (
                    <option key={batch} value={batch}>
                      Batch {batch}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">
                Team (Domain)
              </label>
              <div className="relative">
                <Globe className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select
                  value={selectedDomain}
                  onChange={(e) => setSelectedDomain(e.target.value)}
                  className={selectClass}
                >
                  <option value="">Select</option>
                  <option value="web">Web</option>
                  <option value="app">App</option>
                  <option value="ai">AI</option>
                </select>
              </div>
            </div>

            <div>
              <label className="mb-1.5 block text-xs font-medium text-slate-600">
                Team (Location)
              </label>
              <div className="relative">
                <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" />
                <select
                  value={selectedLocation}
                  onChange={(e) => setSelectedLocation(e.target.value)}
                  className={selectClass}
                >
                  <option value="">Select</option>
                  <option value="remote">Remote</option>
                  <option value="onsite">On-site</option>
                </select>
              </div>
            </div>
          </div>

          <div className="h-px bg-slate-100" />

          {/* Project title */}
          <div>
            <label className="mb-1.5 block text-xs font-medium text-slate-600">
              Project Title
            </label>
            <input
              type="text"
              value={projectTitle}
              onChange={(e) => setProjectTitle(e.target.value)}
              placeholder="e.g. Internship Attendance System"
              className={inputClass}
            />
          </div>

          {/* Description */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-600">
              <FileText className="h-3.5 w-3.5" />
              Description
            </label>
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              placeholder="Brief description of the project..."
              rows={4}
              className={`${inputClass} resize-none`}
            />
          </div>

          {/* Deadline */}
          <div>
            <label className="mb-1.5 flex items-center gap-1.5 text-xs font-medium text-slate-600">
              <Calendar className="h-3.5 w-3.5" />
              Deadline
            </label>
            <input
              type="date"
              value={deadline}
              min={getTodayLocal()}
              max={getMaxDate()}
              onChange={(e) => setDeadline(e.target.value)}
              className={inputClass}
            />
          </div>

          {/* Feedback messages */}
          {errorMessage && (
            <div className="flex items-start gap-2 rounded-md bg-red-50 px-3.5 py-2.5 text-xs font-medium text-red-600">
              <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {errorMessage}
            </div>
          )}

          <button
            type="submit"
            disabled={isSubmitting}
            className="flex w-full items-center justify-center gap-2 rounded-md bg-[#0A7E84] py-3 text-sm font-medium text-white transition hover:bg-[#075F64] disabled:cursor-not-allowed disabled:opacity-50"
          >
            {isSubmitting && <Loader2 className="h-4 w-4 animate-spin" />}
            {isSubmitting ? "Assigning..." : "Assign Project"}
          </button>
        </form>
      )}
    </DialogContent>
  );
};

export default AddNewProject;