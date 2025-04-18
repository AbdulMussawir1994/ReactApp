// src/services/AuthService.js
import axios from "axios";
import configuration from "../configuration/Configurations";

class AuthService {
  constructor() {
    this.tokenKey = "accessToken";

    this.http = axios.create({
      baseURL: configuration.BackEndServer,
      headers: { "Content-Type": "application/json" },
      timeout: 10000,
    });

    this.setInterceptors();
  }

  getToken = () => {
    try {
      const token = sessionStorage.getItem(this.tokenKey);
      return token && token !== "null" && token !== "undefined" ? token : null;
    } catch (error) {
      console.error("[AuthService] Failed to get token:", error);
      return null;
    }
  };

  saveToken = async (token) => {
    try {
      if (!token) throw new Error("Invalid token");
      sessionStorage.setItem(this.tokenKey, token);
    } catch (error) {
      console.error("[AuthService] Failed to save token:", error);
    }
  };

  logOut = async () => {
    try {
      sessionStorage.removeItem(this.tokenKey);
    } catch (error) {
      console.error("[AuthService] Logout error:", error);
    }
  };

  setInterceptors = () => {
    this.http.interceptors.request.use(
      async (config) => {
        try {
          const token = await this.getToken();
          if (token) config.headers.Authorization = `Bearer ${token}`;
        } catch (error) {
          console.warn("[AuthService] Request token error:", error);
        }
        return config;
      },
      (error) => {
        console.error("[AuthService] Request Interceptor Error:", error);
        return Promise.reject(error);
      }
    );

    this.http.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.warn("[AuthService] 401 Unauthorized. Logging out.");
          this.logOut();
        }
        console.error("[AuthService] Response Interceptor Error:", error);
        return Promise.reject(error);
      }
    );
  };

  get = async (endpoint, config = {}) => {
    try {
      return await this.http.get(endpoint, config);
    } catch (error) {
      console.error(`[AuthService] GET ${endpoint} failed:`, error);
      throw error;
    }
  };

  post = async (endpoint, data, config = {}) => {
    try {
      return await this.http.post(endpoint, data, config);
    } catch (error) {
      console.error(`[AuthService] POST ${endpoint} failed:`, error.message);
      throw error.message;
    }
  };

  put = async (endpoint, data, config = {}) => {
    try {
      return await this.http.put(endpoint, data, config);
    } catch (error) {
      console.error(`[AuthService] PUT ${endpoint} failed:`, error.data.message);
      throw error;
    }
  };

  delete = async (endpoint, config = {}) => {
    try {
      return await this.http.delete(endpoint, config);
    } catch (error) {
      console.error(`[AuthService] DELETE ${endpoint} failed:`, error);
      throw error;
    }
  };
}

const authService = new AuthService();
export default authService;
