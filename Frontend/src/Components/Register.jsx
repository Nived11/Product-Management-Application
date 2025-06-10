import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
  MdEmail,
  MdVisibility,
  MdVisibilityOff,
  MdArrowForward,
  MdPerson,
} from "react-icons/md";
import axios from "axios";
import apiPath from "../path.js";
import { ToastContainer, toast } from "react-toastify";
import "./Register.css";

function Register() {
  const [data, setData] = useState({
    username: "",
    email: "",
    password: "",
    cpassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e) => {
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${apiPath()}/register`, {
        username: data.username.trim(),
        email: data.email.trim().toLowerCase(),
        password: data.password,
        cpassword: data.cpassword,
      });

      if (res.status === 201) {
        const { msg } = res.data;
        toast.success(msg || "Registration successful!", {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          theme: "dark",
        });

        setData({
          username: "",
          email: "",
          password: "",
          cpassword: "",
        });

        setTimeout(() => navigate("/login"), 3000);
      }
    } catch (error) {
      console.error("Registration error:", error);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="register-container">
        <div className="register-wrapper">
          <div className="register-image-section">
            <div className="register-image-overlay">
              <div className="register-welcome-content">
                <h2>Join Us Today!</h2>
                <p>
                  Create your account and start your amazing journey with us.
                  It's quick and easy!
                </p>
              </div>
            </div>
          </div>
          <div className="register-form-section">
            <div className="register-form-container">
              <div className="register-form-header">
                <h1>Create your account</h1>
              </div>

              <form className="register-form" onSubmit={handleSubmit}>
                <div className="register-input-group">
                  <label htmlFor="username">Full Name</label>
                  <div className="register-input-wrapper">
                    <input
                      type="text"
                      id="username"
                      name="username"
                      value={data.username}
                      onChange={handleChange}
                      placeholder="Enter your full name"
                      required
                    />
                    <div className="register-input-icon">
                      <MdPerson size={20} />
                    </div>
                  </div>
                </div>

                <div className="register-input-group">
                  <label htmlFor="email">Email Address</label>
                  <div className="register-input-wrapper">
                    <input
                      type="email"
                      id="email"
                      name="email"
                      value={data.email}
                      onChange={handleChange}
                      placeholder="Enter your email"
                      required
                    />
                    <div className="register-input-icon">
                      <MdEmail size={20} />
                    </div>
                  </div>
                </div>

                <div className="register-input-group">
                  <label htmlFor="password">Password</label>
                  <div className="register-input-wrapper">
                    <input
                      type={showPassword ? "text" : "password"}
                      id="password"
                      name="password"
                      value={data.password}
                      onChange={handleChange}
                      placeholder="Enter your password"
                      required
                      minLength={4}
                    />
                    <div
                      className="register-input-icon register-password-toggle"
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

                <div className="register-input-group">
                  <label htmlFor="cpassword">Confirm Password</label>
                  <div className="register-input-wrapper">
                    <input
                      type={showConfirmPassword ? "text" : "password"}
                      id="cpassword"
                      name="cpassword"
                      value={data.cpassword}
                      onChange={handleChange}
                      placeholder="Confirm your password"
                      required
                      minLength={4}
                    />
                    <div
                      className="register-input-icon register-password-toggle"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      style={{ cursor: "pointer" }}
                    >
                      {showConfirmPassword ? (
                        <MdVisibilityOff size={20} />
                      ) : (
                        <MdVisibility size={20} />
                      )}
                    </div>
                  </div>
                </div>

                <button type="submit" className="register-button">
                  <span>Sign Up</span>
                  <MdArrowForward size={20} />
                </button>
              </form>

              <div className="register-form-footer">
                <p>
                  Already have an account?{" "}
                  <Link to="/login" className="register-login-link">
                    Sign in here
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

export default Register;
