import React from 'react';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from './Components/Home';
import Login from './Components/Login';
import Register from './Components/Register';
import { AppProvider } from './Components/AppContext'; 
import ProductDetails from './Components/ProductDetails';
import Wishlist from './Components/wishlist';

function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/Login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/product/:id" element={<ProductDetails />} />
          <Route path="/wishlist" element={<Wishlist />} />
          <Route path="*" element={<div style={{ height: "100vh", display: "flex", flexDirection: "column", justifyContent: "center", alignItems: "center" }}>
            <h1>404 Not Found</h1>
            <p>The page you are looking for does not exist.</p>
            <p>Please check the URL or return to the <a href="/">home page</a>.</p>
          </div>} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

export default App;