import useAuthStore from "../../store/useAuthStore";
import ProjectAdminPannel from "../project/ProjectAdminPannel";
import ProjectInternPannel from "../project/ProjectInternPannel";

const Project = () => {
    const { user } = useAuthStore();

    return (
        <div className="min-h-screen bg-[#F7F8F8] px-3 py-8 sm:px-6">
            {user?.role === "admin" && <ProjectAdminPannel />}
            {user?.role === "intern" && <ProjectInternPannel />}
        </div>
    );
};

export default Project;
