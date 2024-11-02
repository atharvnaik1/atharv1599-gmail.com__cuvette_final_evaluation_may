import React, { useEffect, useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const AppContext = React.createContext();

function AppLayout() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null); // Initialize as null

  const validateSession = async () => {
    try {
      const response = await userApi.verifyToken();
      if (response?.message === "ok") {
        setUser(response?.name);
      } else {
        navigate("/login");
      }
    } catch (error) {
      navigate("/login");
      console.error(error);
    }
  };

  useEffect(() => {
    validateSession();
  }, [navigate]);

  const appProps = {
    username: user,
  };

  return (
    <AppContext.Provider value={appProps}>
    <div style={{ display: "flex" }}>
      <Sidebar />
      <Outlet />
    </div>
  </AppContext.Provider>
  );
}

export function useAppContext() {
  return React.useContext(AppContext);
}

export default AppLayout;
