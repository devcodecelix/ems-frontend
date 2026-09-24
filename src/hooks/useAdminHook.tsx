import { useEffect, useMemo, useState } from 'react'
import useAdminStore from '../store/useAdminStore';
import axiosInstance from '../lib/axios';
import { toast } from 'react-toastify';
import { batchOptions } from '../lib/batches';

const useAdminHook = () => {
    const [confirmingDelete, setConfirmingDelete] = useState(false);
    const { allInterns, getAllInterns, getAllInternsLoader } = useAdminStore();
    const [batchFilter, setBatchFilter] = useState(0);
    const [domainFilter, setDomainFilter] = useState("all");
    const [searchQuery, setSearchQuery] = useState("");
    const [locationFilter, setLocationFilter] = useState("all");
    const [selectedIntern, setSelectedIntern] = useState<
        (typeof allInterns)[number] | null
    >(null);
    const [batchLoader, setBatchLoader] = useState(false);
    const [removeLeaderLoader, setRemoveLeaderLoader] = useState(false);
    const [deleteInternLoader, setDeleteInternLoader] = useState(false);

    useEffect(() => {
        if (allInterns.length !== 0) return;
        getAllInterns();
    }, [getAllInterns]);

    const filteredInterns = useMemo(() => {
        return allInterns
            .filter((intern) => {
                const matchesBatch =
                    batchFilter === 0 || intern.batch?.batchId === batchFilter;

                const matchesDomain =
                    domainFilter === "all" || intern.batch?.domain === domainFilter;

                const matchesLocation =
                    locationFilter === "all" ||
                    intern.batch?.location === locationFilter;

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

    const makeBatchLeader = async (internId: string, domain: string, batchId: number, location: string) => {
        const existingLeader = allInterns.find(
            (intern) =>
                intern._id !== internId &&
                intern.batch?.batchId === batchId &&
                intern.batch?.domain === domain &&
                intern.batch?.location === location &&
                intern.batch?.leader
        );

        if (existingLeader) {
            toast.info(
                "This batch already has a batch leader. Remove the current leader first."
            );
            return;
        }

        try {
            setBatchLoader(true);
            await axiosInstance.post(`/api/v5/admin/admin/make-batch-leader`, {
                internId,
            });

            useAdminStore.setState((state) => ({
                allInterns: state.allInterns.map((intern) => {
                    const isSameBatch =
                        intern.batch?.domain === domain &&
                        intern.batch?.batchId === batchId &&
                        intern.batch?.location === location;

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

    const removeBatchLeader = async (internId: string, domain: string, batchId: number, location: string) => {
        try {
            setRemoveLeaderLoader(true);
            await axiosInstance.post(`/api/v5/admin/admin/remove-batch-leader`, {
                internId,
            });

            useAdminStore.setState((state) => ({
                allInterns: state.allInterns.map((intern) => {
                    const isSameBatch =
                        intern.batch?.domain === domain &&
                        intern.batch?.batchId === batchId &&
                        intern.batch?.location === location;

                    if (!isSameBatch) return intern;

                    return {
                        ...intern,
                        batch: {
                            ...intern.batch,
                            leader: false,
                        },
                    };
                }),
            }));

            setSelectedIntern(null);
        } catch (error) {
            toast.error("Failed to remove batch leader.");
        } finally {
            setRemoveLeaderLoader(false);
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
        allInterns,
        getAllInternsLoader,
        batchLoader,
        setBatchLoader,
        makeBatchLeader,
        removeBatchLeader,
        removeLeaderLoader,
        deleteIntern,
        deleteInternLoader,
        setConfirmingDelete,
        confirmingDelete,
        locationFilter,
        setLocationFilter,
    }
}

export default useAdminHook
