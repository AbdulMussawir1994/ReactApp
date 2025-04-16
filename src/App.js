// App.js
import React, { useEffect, useState, useCallback, createContext } from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Helpers/AppRoutes";
import Navbar from "./components/navbar/Navbar";
import authService from "./services/AuthService";

export const AuthContext = createContext();

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(!!authService.getToken());

  const checkAuth = useCallback(() => {
    const token = authService.getToken();
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [checkAuth]);

  return (
    <AuthContext.Provider value={{ isAuthenticated, setIsAuthenticated }}>
      <BrowserRouter>
        {isAuthenticated && <Navbar />}
        <AppRoutes isAuthenticated={isAuthenticated} />
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
