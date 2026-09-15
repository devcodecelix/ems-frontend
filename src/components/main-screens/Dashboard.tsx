import useAuthStore from "../../store/useAuthStore";
import AdminDashboard from "../dashboard/AdminDashboard";
import InternDashboard from "../dashboard/InternDashboard";

const Dashboard = () => {
    const { user } = useAuthStore();
    return (
        <>
            {user?.role === "admin" && <AdminDashboard />}
            {user?.role === "intern" && <InternDashboard />}
        </>
    );
};

export default Dashboard;
