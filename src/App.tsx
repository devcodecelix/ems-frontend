import { Navigate, Route, Routes } from "react-router-dom";
import { useEffect } from "react";

import Login from "./pages/Login";
import Home from "./pages/Home";
import Application from "./pages/Application";
import Loader from "./components/loader";
import useAuthStore from "./store/useAuthStore";

function App() {
  const {
    verify,
    isAuthLoading,
    isAuthenticated,
    user,
  } = useAuthStore();

  useEffect(() => {
    verify();
  }, [verify]);

  if (isAuthLoading) {
    return <Loader />;
  }

  return (
    <div className="w-full">
      <Routes>
        {/* Login */}
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login />
            ) : (user?.role === "unverified" || user?.role === "applied") ? (
              <Navigate to="/application" replace />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />

        {/* Home */}
        <Route
          path="/"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : (user?.role === "unverified" || user?.role === "applied") ? (
              <Navigate to="/application" replace />
            ) : (
              <Home />
            )
          }
        />

        {/* Application */}
        <Route
          path="/application"
          element={
            !isAuthenticated ? (
              <Navigate to="/login" replace />
            ) : (user?.role === "unverified" || user?.role === "applied") ? (
              <Application />
            ) : (
              <Navigate to="/" replace />
            )
          }
        />
      </Routes>
    </div>
  );
}

export default App;