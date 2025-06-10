import React, { useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { MdClose, MdShoppingCart, MdStar } from "react-icons/md";
import { AppContext } from "./AppContext";
import Nav from "./Nav";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import apiPath from "../path";
import "./wishlist.css";

const electronicsData = [
  {
    id: 1,
    title: "iPhone 15 Pro Max",
    category: "Smartphones",
    price: 1199,
    originalPrice: 1299,
    image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400",
    rating: 4.8,
    reviews: 156,
  },
  {
    id: 2,
    title: "Samsung Galaxy S24 Ultra",
    category: "Smartphones",
    price: 1099,
    originalPrice: 1199,
    image: "https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=400",
    rating: 4.7,
    reviews: 203,
  },
  {
    id: 3,
    title: "MacBook Pro 16-inch",
    category: "Laptops",
    price: 2399,
    originalPrice: 2499,
    image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400",
    rating: 4.9,
    reviews: 89,
  },
  {
    id: 4,
    title: "iPad Pro 12.9-inch",
    category: "Tablets",
    price: 1099,
    originalPrice: 1199,
    image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400",
    rating: 4.6,
    reviews: 134,
  },
  {
    id: 5,
    title: "Sony WH-1000XM5",
    category: "Audio",
    price: 349,
    originalPrice: 399,
    image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400",
    rating: 4.8,
    reviews: 421,
  },
  {
    id: 6,
    title: "Apple Watch Series 9",
    category: "Wearables",
    price: 399,
    originalPrice: 429,
    image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=400",
    rating: 4.7,
    reviews: 298,
  },
  {
    id: 7,
    title: "Nintendo Switch OLED",
    category: "Gaming",
    price: 349,
    originalPrice: 359,
    image: "https://images.unsplash.com/photo-1606144042614-b2417e99c4e3?w=400",
    rating: 4.6,
    reviews: 167,
  },
  {
    id: 8,
    title: "Canon EOS R5",
    category: "Cameras",
    price: 3899,
    originalPrice: 3999,
    image: "https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=400",
    rating: 4.9,
    reviews: 76,
  },
];

function Wishlist() {
  const { wishlist, setWishlist, cart, setCart } = useContext(AppContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuthenticationStatus();
  }, []);

  const checkAuthenticationStatus = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.get(`${apiPath()}/home`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (response.status === 200) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        if (error.response?.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("currentUser");
          setIsAuthenticated(false);
          toast.error("Session expired. Please login again.");
          navigate("/login");
        }
      }
    } else {
      navigate("/login");
    }
  };

  const wishlistProducts = electronicsData.filter((product) =>
    wishlist.includes(product.id)
  );

  const handleRemoveFromWishlist = (productId) => {
    setWishlist((prev) => prev.filter((id) => id !== productId));
    toast.success("Removed from wishlist!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
  };

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      toast.info("Please login to add items to cart");
      navigate("/login");
      return;
    }
    setCart((prev) => [...prev, product]);
    toast.success(`${product.title} added to cart!`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  const handleMoveAllToCart = () => {
    if (!isAuthenticated) {
      toast.info("Please login to add items to cart");
      navigate("/login");
      return;
    }

    wishlistProducts.forEach((product) => {
      setCart((prev) => [...prev, product]);
    });

    toast.success(`${wishlistProducts.length} items moved to cart!`, {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
  };

  const handleClearWishlist = () => {
    setWishlist([]);
    toast.success("Wishlist cleared!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "light",
    });
  };

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
      <Nav />
      <div className="wishlist-container">
        <div className="wishlist-header">
          <div className="wishlist-title">
            <h1>My Wishlist</h1>
            <span className="wishlist-count">
              ({wishlistProducts.length} items)
            </span>
          </div>

          {wishlistProducts.length > 0 && (
            <div className="wishlist-actions">
              <button className="move-all-btn" onClick={handleMoveAllToCart}>
                <MdShoppingCart size={18} />
                Move All to Cart
              </button>
              <button
                className="clear-wishlist-btn"
                onClick={handleClearWishlist}
              >
                Clear Wishlist
              </button>
            </div>
          )}
        </div>

        {wishlistProducts.length === 0 ? (
          <div className="empty-wishlist">
            <div className="empty-wishlist-icon"></div>
            <h2>Your wishlist is empty</h2>
            <p>
              Save items you love for later. Start shopping and add your
              favorite products!
            </p>
            <button
              className="start-shopping-btn"
              onClick={() => navigate("/")}
            >
              Start Shopping
            </button>
          </div>
        ) : (
          <div className="wishlist-grid">
            {wishlistProducts.map((product) => {
              return (
                <div key={product.id} className="wishlist-item">
                  <button
                    className="remove-btn"
                    onClick={() => handleRemoveFromWishlist(product.id)}
                    title="Remove from wishlist"
                  >
                    <MdClose size={20} />
                  </button>

                  <div
                    className="wishlist-item-image"
                    onClick={() => handleProductClick(product)}
                  >
                    <img
                      src={product.image}
                      alt={product.title}
                      onError={(e) => {
                        e.target.style.display = "none";
                        e.target.nextSibling.style.display = "flex";
                      }}
                    />
                    <div
                      className="product-placeholder"
                      style={{ display: "none" }}
                    >
                      {product.category.charAt(0)}
                    </div>
                  </div>

                  <div className="wishlist-item-info">
                    <div className="product-category">{product.category}</div>
                    <h3
                      className="product-title"
                      onClick={() => handleProductClick(product)}
                    >
                      {product.title}
                    </h3>

                    <div className="product-price">
                      <span className="current-price">${product.price}</span>
                    </div>

                    <button
                      className="add-to-cart-btn"
                      onClick={() => handleAddToCart(product)}
                    >
                      <MdShoppingCart size={18} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

export default Wishlist;
