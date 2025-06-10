import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { MdSearch, MdFavorite, MdShoppingCart, MdMenu } from "react-icons/md";
import axios from "axios";
import apiPath from "../path";
import { toast } from "react-toastify";
import "./Nav.css";
import { AppContext } from "./AppContext";

function Nav() {
  const { wishlist, cart } = useContext(AppContext);
  const [searchQuery, setSearchQuery] = useState("");
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.get(`${apiPath()}/home`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          setUser(response.data);
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Token verification failed:", error);
        localStorage.removeItem("token");
        localStorage.removeItem("currentUser");
        setIsAuthenticated(false);
        setUser(null);
        if (error.response?.status === 403) {
          toast.error("Session expired. Please login again.");
          navigate("/login");
        }
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("currentUser");
    setIsAuthenticated(false);
    setUser(null);
    toast.success("Logged out successfully");
    navigate("/");
  };

  const handleWishlistClick = () => {
    if (!isAuthenticated) {
      toast.info("Please login to view your wishlist");
      navigate("/login");
      return;
    }
    navigate("/wishlist");
  };

  const getUserInitial = () => {
    if (user?.username) {
      return user.username.charAt(0).toUpperCase();
    }
    const email = localStorage.getItem("currentUser");
    return email ? email.charAt(0).toUpperCase() : "U";
  };

  return (
    <nav className="navbar">
      <div className="nav-container">
        <div className="nav-top">
          <div className="nav-logo">
            <Link to="/" className="logo-link">
              <div className="logo">
                <span className="logo-text">Shopy</span>
              </div>
            </Link>
          </div>

          <div className="nav-search">
            <form className="search-form">
              <div className="search-wrapper">
                <input
                  type="text"
                  className="search-input"
                  placeholder="Search for products..." 
                />
                <button type="submit" className="search-button">
                  <MdSearch size={20} />
                </button>
              </div>
            </form>
          </div>

          <div className="nav-actions">
            <div
              className="nav-icon"
              onClick={handleWishlistClick}
              style={{ cursor: "pointer" }}
              title="View Wishlist"
            >
              <MdFavorite size={24} />
              <span className="icon-badge wishlist-badge">
                {wishlist.length}
              </span>
            </div>

            <div className="nav-icon">
              <MdShoppingCart size={24} />
              <span className="icon-badge">{cart.length}</span>
            </div>

            {isAuthenticated ? (
              <div className="user-profile">
                <div className="user-avatar">{getUserInitial()}</div>
                <div className="user-dropdown">
                  <div className="dropdown-content">
                    <div className="user-info">
                      <div className="user-name">
                        {user?.username || "User"}
                      </div>
                      <div className="user-email">
                        {localStorage.getItem("currentUser")}
                      </div>
                    </div>
                    <button className="logout-btn" onClick={handleLogout}>
                      Logout
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <Link to="/login" className="signin-btn">
                Sign In
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Nav;
