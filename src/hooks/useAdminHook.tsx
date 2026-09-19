import { useEffect, useMemo, useState } from 'react'
import useAdminStore from '../store/useAdminStore';
import axiosInstance from '../lib/axios';
import { toast } from 'react-toastify';

const useAdminHook = () => {
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const { allInterns, getAllInterns, getAllInternsLoader } = useAdminStore();
    const [batchFilter, setBatchFilter] = useState(14);
    const [domainFilter, setDomainFilter] = useState("web");
    const [searchQuery, setSearchQuery] = useState("");
    const [locationFilter, setLocationFilter] = useState("remote");
    const [selectedIntern, setSelectedIntern] = useState<
        (typeof allInterns)[number] | null
    >(null);
    const [batchLoader, setBatchLoader] = useState(false);
    const [deleteInternLoader, setDeleteInternLoader] = useState(false);

    useEffect(() => {
        if (allInterns.length !== 0) return;
        getAllInterns();
    }, [getAllInterns]);

    const batchOptions = [14, 15, 16];

    const filteredInterns = useMemo(() => {
        if (!batchFilter || !domainFilter) {
            return [];
        }

        return allInterns
            .filter((intern) => {
                const matchesBatch =
                    intern.batch?.batchId === batchFilter;

                const matchesDomain =
                    intern.batch?.domain === domainFilter;

                const matchesLocation =
                    locationFilter === "remote"
                        ? intern.batch?.location === "remote"
                        : intern.batch?.location !== "remote";

                const matchesSearch =
                    intern.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    intern.email?.toLowerCase().includes(searchQuery.toLowerCase());

                return matchesBatch && matchesDomain && matchesLocation && matchesSearch;
            })
            .sort((a, b) => {
                if (a.batch?.leader && !b.batch?.leader) return -1;
                if (!a.batch?.leader && b.batch?.leader) return 1;
                return 0;
            });
    }, [allInterns, batchFilter, domainFilter, searchQuery, locationFilter]);

    const makeBatchLeader = async (internId: string, domain: string, batchId: number) => {
        try {
            setBatchLoader(true);
            await axiosInstance.post(`/api/v5/admin/admin/make-batch-leader`, {
                internId,
            });

            useAdminStore.setState((state) => ({
                allInterns: state.allInterns.map((intern) => {
                    const isSameBatch =
                        intern.batch?.domain === domain && intern.batch?.batchId === batchId;

                    if (!isSameBatch) return intern;

                    return {
                        ...intern,
                        batch: {
                            ...intern.batch,
                            leader: intern._id === internId,
                        },
                    };
                }),
            }));

            setSelectedIntern(null);
        } catch (error) {
            toast.error("Failed to make batch leader.");
        } finally {
            setBatchLoader(false);
        }
    };

    const deleteIntern = async (internId: string) => {
        setDeleteInternLoader(true);
        try {
            await axiosInstance.delete(`/api/v5/admin/intern/${internId}`);
            useAdminStore.setState((state) => ({
                allInterns: state.allInterns.filter((intern) => intern._id !== internId),
            }));
            setSelectedIntern(null);
        } catch (error) {
            console.error("Error deleting intern:", error);
        }
        finally {
            setDeleteInternLoader(false);
        }
    }

    return {
        batchFilter,
        setBatchFilter,
        domainFilter,
        setDomainFilter,
        searchQuery,
        setSearchQuery,
        selectedIntern,
        setSelectedIntern,
        batchOptions,
        filteredInterns,
        getAllInternsLoader,
        batchLoader,
        setBatchLoader,
        makeBatchLeader,
        deleteIntern,
        deleteInternLoader,
        setConfirmingDelete,
        confirmingDelete,
        locationFilter,
        setLocationFilter,
    }
}

export default useAdminHook
