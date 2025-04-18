// File: src/components/signin/SignInForm.jsx
import React, { useState, useCallback, useContext } from "react";
import { useNavigate } from "react-router-dom";
import authService from "../../services/AuthService";
import "../../styles/Auth.css";
import { Link } from "react-router-dom";
import { AuthContext } from "../../App";
import Swal from "sweetalert2";

const validationRules = {
  cnic: {
    required: "CNIC is required.",
    pattern: {
      value: /^\d{13}$/,
      message: "CNIC must be exactly 13 digits.",
    },
  },
  password: {
    required: "Password is required.",
    pattern: {
      value: /^.{6,}$/,
      message: "Password must be at least 6 characters.",
    },
  },
};

const SignIn = () => {
  const { setIsAuthenticated } = useContext(AuthContext);
  const [formData, setFormData] = useState({ cnic: "", password: "" });
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  const validateField = useCallback((name, value) => {
    const rules = validationRules[name];
    if (!rules) return "";
    if (rules.required && !value) return rules.required;
    if (rules.pattern && !rules.pattern.value.test(value))
      return rules.pattern.message;
    return "";
  }, []);

  const validateForm = useCallback(() => {
    const formErrors = {};
    Object.entries(formData).forEach(([key, value]) => {
      const error = validateField(key, value);
      if (error) formErrors[key] = error;
    });
    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  }, [formData, validateField]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    setErrors((prev) => ({ ...prev, [name]: validateField(name, value) }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await authService.post("User/LoginUser", formData);
      if (response.data.status.isSuccess) {
        authService.saveToken(response.data.content.accessToken);
        setIsAuthenticated(true);
        await Swal.fire({
          icon: "success",
          title: "Login Successful",
          timer: 1500,
          showConfirmButton: false,
        });
        navigate("/dashboard");
      } else {
        Swal.fire({
          icon: "error",
          title: "Login Failed",
          text: response.data.status.statusMessage,
        });
      }
    } catch (error) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: error ?? "An unexpected error occurred. Please try again.",
      });
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="bubble-wrapper">
        <div className="auth-card">
          <h1>Sign In</h1>
          <form onSubmit={handleSubmit} noValidate>
            <input
              type="text"
              name="cnic"
              placeholder="Enter CNIC"
              value={formData.cnic}
              onChange={handleChange}
              required
            />
            <p className={`form-error ${!errors.cnic ? "hidden" : ""}`}>
              {errors.cnic || "placeholder"}
            </p>

            <input
              type="password"
              name="password"
              placeholder="Enter Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <p className={`form-error ${!errors.password ? "hidden" : ""}`}>
              {errors.password || "placeholder"}
            </p>

            <input type="submit" value="SIGN IN" />
          </form>

          <div className="auth-footer">
            <p>
              Don't have an account? <Link to="/register">Sign Up</Link>
            </p>
          </div>
        </div>

        {/* Bubble Animation */}
        <ul className="colorlib-bubbles">
          {Array.from({ length: 10 }).map((_, i) => (
            <li key={i}></li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default SignIn;
