import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { MdFavorite, MdShoppingCart } from "react-icons/md";
import axios from "axios";
import apiPath from "../path";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./Home.css";
import Nav from "./Nav";
import { AppContext } from "./AppContext";

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

function Home() {
  const { wishlist, setWishlist, cart, setCart } = useContext(AppContext);
  const [activeCategory, setActiveCategory] = useState("All");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const navigate = useNavigate();
  const categories = [
    "All",
    "Smartphones",
    "Laptops",
    "Tablets",
    "Audio",
    "Wearables",
    "Gaming",
    "Cameras",
  ];

  useEffect(() => {
    checkAuthenticationStatus();
  }, []);

  const checkAuthenticationStatus = async () => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const response = await axios.get(`${apiPath()}/home`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.status === 200) {
          setIsAuthenticated(true);
        }
      } catch (error) {
        console.error("Authentication check failed:", error);
        if (error.response?.status === 403) {
          localStorage.removeItem("token");
          localStorage.removeItem("currentUser");
          setIsAuthenticated(false);
          toast.error("Session expired. Please login again.");
        }
      }
    }
  };

  const handleWishlist = (e, productId) => {
    toast.success("Added to wishlist!", {
      position: "top-right",
      autoClose: 2000,
      hideProgressBar: false,
      closeOnClick: true,
      pauseOnHover: true,
      draggable: true,
      theme: "dark",
    });
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info("Please login to add items to wishlist");
      navigate("/login");
      return;
    }
    setWishlist((prev) =>
      prev.includes(productId)
        ? prev.filter((id) => id !== productId)
        : [...prev, productId]
    );
  };

  const handleAddToCart = (e, product) => {
    e.stopPropagation();

    if (!isAuthenticated) {
      toast.info("Please login to add items to cart");
      navigate("/login");
      return;
    }
    setCart((prev) => [...prev, product]);
    toast.success(`${product.title} added to cart!`);
  };

  const handleProductClick = (product) => {
    navigate(`/product/${product.id}`, { state: { product } });
  };

  const filteredProducts =
    activeCategory === "All"
      ? electronicsData
      : electronicsData.filter((p) => p.category === activeCategory);

  return (
    <>
      <ToastContainer position="top-right" autoClose={3000} theme="light" />
      <Nav />
      <div className="home-container">
        <div className="home-content">
          <div className="products-section">
            <div className="section-header">
              <div className="nav-categories">
                <div className="categories-container">
                  {categories.map((category) => (
                    <button
                      key={category}
                      className={`category-btn ${
                        activeCategory === category ? "active" : ""
                      }`}
                      onClick={() => setActiveCategory(category)}
                    >
                      {category}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="products-grid">
              {filteredProducts.map((product) => (
                <div
                  key={product.id}
                  className="product-card"
                  onClick={() => handleProductClick(product)}
                  style={{ cursor: "pointer" }}
                >
                  <div className="product-image-container">
                    <img src={product.image} className="product-image" />
                    <div
                      className="product-placeholder"
                      style={{ display: "none" }}
                    >
                      {product.category.charAt(0)}
                    </div>

                    <div className="product-actions">
                      <button
                        className={`action-btn ${
                          wishlist.includes(product.id) ? "favorited" : ""
                        }`}
                        onClick={(e) => handleWishlist(e, product.id)}
                        title="Add to Wishlist"
                      >
                        <MdFavorite size={20} />
                      </button>
                    </div>
                  </div>

                  <div className="product-info">
                    <div className="product-category">{product.category}</div>
                    <h3
                      className="product-title"
                      style={{ WebkitLineClamp: 1 }}
                    >
                      {product.title}
                    </h3>

                    <div className="product-price">
                      <span className="current-price">${product.price}</span>
                    </div>

                    <button
                      className="add-to-cart-btn"
                      onClick={(e) => handleAddToCart(e, product)}
                    >
                      <MdShoppingCart size={18} />
                      Add to Cart
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Home;
