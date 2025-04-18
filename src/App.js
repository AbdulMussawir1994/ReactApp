import React, {
  useEffect,
  useState,
  useCallback,
  createContext,
  useMemo,
} from "react";
import { BrowserRouter } from "react-router-dom";
import AppRoutes from "./Helpers/AppRoutes";
import Navbar from "./components/navbar/Navbar";
import authService from "./services/AuthService";

export const AuthContext = createContext(null);

const App = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!authService.getToken());

  // Check auth status from token
  const checkAuth = useCallback(() => {
    const token = authService.getToken();
    setIsAuthenticated(!!token);
  }, []);

  useEffect(() => {
    checkAuth();
    window.addEventListener("storage", checkAuth);
    return () => window.removeEventListener("storage", checkAuth);
  }, [checkAuth]);

  // Avoid unnecessary re-renders by memoizing the context value
  const authContextValue = useMemo(() => ({
    isAuthenticated,
    setIsAuthenticated
  }), [isAuthenticated]);

  return (
    <BrowserRouter>
      <AuthContext.Provider value={authContextValue}>
        <div className="App">
          {isAuthenticated && <Navbar />}
          <AppRoutes isAuthenticated={isAuthenticated} />
        </div>
      </AuthContext.Provider>
    </BrowserRouter>
  );
};

export default App;

