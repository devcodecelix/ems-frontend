import { useEffect, useMemo, useState } from "react";
import useInternStore from "../store/useInternStore";
import useAuthStore from "../store/useAuthStore";
import { toast } from "react-toastify";
import axiosInstance from "../lib/axios";

let hasFetchedInitialData = false;

const useAttendanceHook = () => {
    const {
        getStats,
        allTeamMembers,
        getAllTeamMembers,
        getAllTeamMembersLoader,
        getMyAttendance,
        attendance,
        getAttendanceLoader,
    } = useInternStore();
    const { user } = useAuthStore();

    const isIntern = user?.role === "intern";

    const today = useMemo(() => new Date().toISOString().split("T")[0], []);

    const [presentIds, setPresentIds] = useState<string[]>([]);
    const [isSaving, setIsSaving] = useState(false);
    const [isCheckingStatus, setIsCheckingStatus] = useState(true);
    const [alreadyMarked, setAlreadyMarked] = useState(false);

    // initial fetches — guarded inside the effect, not before the hooks
    useEffect(() => {
        if (!isIntern || hasFetchedInitialData) return;

        hasFetchedInitialData = true;

        getStats();
        getAllTeamMembers();
        getMyAttendance();
    }, [isIntern]);

    useEffect(() => {
        if (!isIntern || allTeamMembers.length === 0) return;
        if (!user.batch?.leader) return;

        const batchId = allTeamMembers[0]?.batch?.batchId;
        const domain = allTeamMembers[0]?.batch?.domain;

        if (!batchId || !domain) {
            setIsCheckingStatus(false);
            return;
        }

        const checkStatus = async () => {
            try {
                setIsCheckingStatus(true);
                const res = await axiosInstance.post("/api/v4/attendance/check-todays-attendance-marked", { batchId, domain });
                setAlreadyMarked(Boolean(res.data?.marked));
            } catch (error) {
                setAlreadyMarked(false);
            } finally {
                setIsCheckingStatus(false);
            }
        };

        checkStatus();
    }, [isIntern, allTeamMembers, today]);

    // default everyone to "present" once members load
    useEffect(() => {
        if (!isIntern || allTeamMembers.length === 0) return;
        setPresentIds((prev) => {
            const existing = new Set(prev);
            const next = [...prev];
            allTeamMembers.forEach((member) => {
                if (!existing.has(member._id)) {
                    next.push(member._id);
                }
            });
            return next;
        });
    }, [isIntern, allTeamMembers]);

    const toggleId = (internId: string) => {
        if (alreadyMarked) return;
        setPresentIds((prev) =>
            prev.includes(internId)
                ? prev.filter((id) => id !== internId)
                : [...prev, internId]
        );
    };

    const handleSave = async () => {
        if (alreadyMarked) return;

        try {
            setIsSaving(true);

            const presentReferenceNos = allTeamMembers
                .filter((member) => presentIds.includes(member._id))
                .map((member) => member.batch.referenceNo);

            const absentReferenceNos = allTeamMembers
                .filter((member) => !presentIds.includes(member._id))
                .map((member) => member.batch.referenceNo);

            await axiosInstance.post("/api/v4/attendance", {
                batchId: allTeamMembers[0]?.batch.batchId,
                domain: allTeamMembers[0]?.batch.domain,
                referenceNos: presentReferenceNos,
                absentReferenceNos,
            });

            toast.success("Attendance saved successfully.");
            setAlreadyMarked(true);
        } catch (error) {
            toast.error("Failed to save attendance.");
        } finally {
            setIsSaving(false);
        }
    };

    return {
        today,
        allTeamMembers,
        presentIds,
        isSaving,
        isCheckingStatus,
        alreadyMarked,
        toggleId,
        handleSave,
        getAllTeamMembersLoader,
        user,
        attendance,
        getMyAttendance,
        getAttendanceLoader,
    };
};

export default useAttendanceHook;