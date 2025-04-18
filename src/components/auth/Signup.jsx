// File: src/components/signup/SignUpForm.jsx
import React, { useState, useCallback } from "react";
import "../../styles/Auth.css";
import { Link } from "react-router-dom"; // ✅ fixed from "react-router"
import Swal from "sweetalert2"; // ✅ Import SweetAlert2

const validationRules = {
  username: {
    required: "Username is required.",
    pattern: {
      value: /^[a-zA-Z0-9_]{3,15}$/,
      message: "Username must be 3-15 characters with no special symbols.",
    },
  },
  email: {
    required: "Email is required.",
    pattern: {
      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
      message: "Invalid email address.",
    },
  },
  password: {
    required: "Password is required.",
    pattern: {
      value: /^.{6,}$/,
      message: "Password must be at least 6 characters.",
    },
  },
  confirmPassword: {
    required: "Confirm password is required.",
  },
  agree: {
    required: "You must agree to the terms.",
  },
};

const SignUp = () => {
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
    agree: false,
  });

  const [errors, setErrors] = useState({});

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

    if (formData.password !== formData.confirmPassword) {
      formErrors.confirmPassword = "Passwords do not match.";
    }

    setErrors(formErrors);
    return Object.keys(formErrors).length === 0;
  }, [formData, validateField]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const fieldValue = type === "checkbox" ? checked : value;

    setFormData((prev) => ({ ...prev, [name]: fieldValue }));
    setErrors((prev) => ({
      ...prev,
      [name]: validateField(name, fieldValue),
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      Swal.fire({
        icon: "error",
        title: "Validation Error",
        text: "Please correct the form errors before submitting.",
      });
      return;
    }

    try {
      // Simulated success, replace with your API call
      console.log("Form Submitted:", formData);

      await Swal.fire({
        icon: "success",
        title: "Registration Successful!",
        text: "You can now log in with your account.",
        timer: 2000,
        showConfirmButton: false,
      });

      // Reset form
      setFormData({
        username: "",
        email: "",
        password: "",
        confirmPassword: "",
        agree: false,
      });
      setErrors({});
    } catch (err) {
      Swal.fire({
        icon: "error",
        title: "Server Error",
        text: "Something went wrong. Please try again later.",
      });
    }
  };

  return (
    <div className="auth-wrapper">
      <div className="bubble-wrapper">
        <div className="auth-card">
          <h1>Sign Up</h1>
          <form onSubmit={handleSubmit} noValidate>
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              required
            />
            <p className={`form-error ${!errors.username ? "hidden" : ""}`}>
              {errors.username || "placeholder"}
            </p>

            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              required
            />
            <p className={`form-error ${!errors.email ? "hidden" : ""}`}>
              {errors.email || "placeholder"}
            </p>

            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              required
            />
            <p className={`form-error ${!errors.password ? "hidden" : ""}`}>
              {errors.password || "placeholder"}
            </p>

            <input
              type="password"
              name="confirmPassword"
              placeholder="Confirm Password"
              value={formData.confirmPassword}
              onChange={handleChange}
              required
            />
            <p
              className={`form-error ${
                !errors.confirmPassword ? "hidden" : ""
              }`}
            >
              {errors.confirmPassword || "placeholder"}
            </p>

            <label style={{ fontSize: "0.95rem"}}>
              <input
                type="checkbox"
                name="agree"
                checked={formData.agree}
                onChange={handleChange}
                style={{ marginRight: "8px" }}
              />
              I agree to the Terms & Conditions
            </label>
            <p style={{marginTop: "0px"}} className={`form-error ${!errors.agree ? "hidden" : ""}`}>
              {errors.agree || "placeholder"}
            </p>

            <div style={{ marginTop: "0px" }}>
              <input type="submit" value="SIGN UP" />
            </div>
          </form>

          <div className="auth-footer">
            <p>
              Already have an account? <Link to="/login">Sign In</Link>
            </p>
          </div>

          {/* Bubble Animation */}
          <ul className="colorlib-bubbles">
            {Array.from({ length: 10 }).map((_, i) => (
              <li key={i}></li>
            ))}
          </ul>
        </div>
      </div>
    </div>
  );
};

export default SignUp;
