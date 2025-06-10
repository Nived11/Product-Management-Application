import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MdEmail,
  MdVisibility,
  MdVisibilityOff,
  MdArrowForward,
} from "react-icons/md";
import axios from "axios";
import apiPath from "../path";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Login.css";

function Login() {
  const [data, setData] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${apiPath()}/login`, {
        email: data.email,
        password: data.password,
      });

      if (res.status === 200) {
        const { token, msg } = res.data;
        if (token) {
          console.log("Token received:", token);
          localStorage.setItem("token", token);
          localStorage.setItem("currentUser", data.email);

          toast.success(msg, {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
          });

          setData({ email: "", password: "" });
          setTimeout(() => navigate("/"), 3000);
        } else {
          toast.error("Login failed. No token received.", {
            position: "top-right",
            autoClose: 5000,
            hideProgressBar: false,
            closeOnClick: true,
            pauseOnHover: true,
            draggable: true,
            theme: "dark",
          });
        }
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error(error.response?.data?.msg, {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="login-container">
        <div className="login-wrapper">
          <div className="login-image-section">
            <div className="image-overlay">
              <div className="welcome-content">
                <h2>Welcome Back!</h2>
                <p>
                  We're excited to see you again. Sign in to continue your
                  journey with us.
                </p>
              </div>
            </div>
          </div>

          <div className="login-form-section">
            <div className="form-container">
              <div className="form-header">
                <h1>Sign in to your account</h1>
              </div>

              <form className="login-form" onSubmit={handleSubmit}>
                <div className="input-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="input-wrapper">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={data.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                    <div className="input-icon">
                      <MdEmail size={20} />
                    </div>
                  </div>
                </div>

                <div className="input-group">
                  <label htmlFor="password">Password</label>
                  <div className="input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={data.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                    />
                    <div
                      className="input-icon password-toggle"
                      onClick={() => setShowPassword(!showPassword)}
                      style={{ cursor: "pointer" }}
                    >
                      {showPassword ? (
                        <MdVisibilityOff size={20} />
                      ) : (
                        <MdVisibility size={20} />
                      )}
                    </div>
                  </div>
                </div>

                <div className="form-options">
                  <Link to="#" className="forgot-password">
                    Forgot Password?
                  </Link>
                </div>

                <button type="submit" className="signin-button">
                  <span>Sign In</span>
                  <MdArrowForward size={20} />
                </button>
              </form>

              <div className="form-footer">
                <p>
                  Don't have an account?{" "}
                  <Link to="/register" className="signup-link">
                    Sign up here
                  </Link>
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Login;
