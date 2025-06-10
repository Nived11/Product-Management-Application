import React, { useContext, useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import "./ProductDetails.css";
import {
  MdArrowBack,
  MdStar,
  MdFavorite,
  MdShoppingCart,
  MdLocalShipping,
  MdSecurity,
  MdCheckCircle,
} from "react-icons/md";
import Nav from "./Nav";
import { AppContext } from "./AppContext";
import { toast, ToastContainer } from "react-toastify";
import axios from "axios";
import apiPath from "../path";

function ProductDetails() {
  const { state } = useLocation();
  const product = state?.product;
  const navigate = useNavigate();
  const { wishlist, setWishlist, cart, setCart } = useContext(AppContext);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [quantity, setQuantity] = useState(1);

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
        }
      }
    }
  };

  const handleWishlist = (productId) => {
    if (!isAuthenticated) {
      toast.info("Please login to add items to wishlist");
      navigate("/login");
      return;
    }

    const isInWishlist = wishlist.includes(productId);
    setWishlist((prev) =>
      isInWishlist
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );

    toast.success(
      isInWishlist ? "Removed from wishlist!" : "Added to wishlist!"
    );
  };

  const handleAddToCart = () => {
    if (!isAuthenticated) {
      toast.info("Please login to add items to cart");
      navigate("/login");
      return;
    }

    for (let i = 0; i < quantity; i++) {
      setCart((prev) => [...prev, product]);
    }

    toast.success(`${quantity} x ${product.title} added to cart!`);
  };

  const handleBuyNow = () => {
    if (!isAuthenticated) {
      toast.info("Please login to purchase");
      navigate("/login");
      return;
    }

    for (let i = 0; i < quantity; i++) {
      setCart((prev) => [...prev, product]);
    }

    toast.success("Proceeding to checkout...");
  };

  if (!product) {
    return (
      <div className="product-details-container">
        <h2>Product not found</h2>
        <button onClick={() => navigate("/")}>Back to Home</button>
      </div>
    );
  }

  const discount =
    product.originalPrice > product.price
      ? Math.round(
          ((product.originalPrice - product.price) / product.originalPrice) *
            100
        )
      : 0;

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
      <Nav />
      <div className="product-details-wrapper">
        <button className="back-btn" onClick={() => navigate(-1)}>
          <MdArrowBack size={20} /> Back
        </button>

        <div className="product-image-section">
          <div className="product-imagee-container">
            <img
              className="product-main-image"
              src={product.image}
              alt={product.title}
              onError={(e) => {
                e.target.style.display = "none";
                e.target.nextSibling.style.display = "flex";
              }}
            />
            <div className="product-placeholder" style={{ display: "none" }}>
              {product.category.charAt(0)}
            </div>
            <button
              className={`wishlist-icon ${
                wishlist.includes(product.id) ? "favorited" : ""
              }`}
              onClick={() => handleWishlist(product.id)}
              title="Add to Wishlist"
            >
              <MdFavorite size={24} />
            </button>
            {discount > 0 && (
              <div className="discount-badge">{discount}% OFF</div>
            )}
          </div>
        </div>

        <div className="product-info-section">
          <div className="product-details-info">
            <div className="product-category-badge">{product.category}</div>
            <h1 className="product-title">{product.title}</h1>

            <div className="product-rating">
              <div className="stars">
                {[...Array(5)].map((_, i) => (
                  <MdStar
                    key={i}
                    size={20}
                    color={
                      i < Math.floor(product.rating) ? "#ffc107" : "#e0e0e0"
                    }
                  />
                ))}
              </div>
              <span className="rating-text">
                {product.rating} ({product.reviews} reviews)
              </span>
            </div>

            <div className="product-pricing">
              <div className="price-section">
                <div className="current-price">${product.price}</div>
                {product.originalPrice > product.price && (
                  <div className="original-price">${product.originalPrice}</div>
                )}
              </div>
              {discount > 0 && (
                <div className="savings">
                  You save ${product.originalPrice - product.price}
                </div>
              )}
            </div>

            <div className="product-features">
              <div className="feature">
                <MdLocalShipping size={20} /> Free shipping on orders over $50
              </div>
              <div className="feature">
                <MdSecurity size={20} /> 1 year warranty included
              </div>
              <div className="feature">
                <MdCheckCircle size={20} /> In stock and ready to ship
              </div>
            </div>

            <div className="quantity-section">
              <label htmlFor="quantity">Quantity:</label>
              <div className="quantity-controls">
                <button
                  className="quantity-btn"
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  disabled={quantity <= 1}
                >
                  -
                </button>
                <span className="quantity-display">{quantity}</span>
                <button
                  className="quantity-btn"
                  onClick={() => setQuantity(quantity + 1)}
                >
                  +
                </button>
              </div>
            </div>

            <div className="action-buttons">
              <button className="buy-now-btn" onClick={handleBuyNow}>
                Buy Now
              </button>
              <button className="add-to-cart-btnn" onClick={handleAddToCart}>
                <MdShoppingCart size={20} /> Add to Cart
              </button>
            </div>

            <div className="product-description">
              <h3>Product Description</h3>
              <p>
                Experience the best of {product.category.toLowerCase()} with the{" "}
                {product.title}. It's designed for exceptional performance and
                reliability. Perfect for any tech enthusiast.
              </p>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default ProductDetails;
