import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Categories from './components/Categories';
import FeaturedProducts from './components/FeaturedProducts';
import Philosophy from './components/Philosophy';
import Footer from './components/Footer';
import ProductDetail from './pages/ProductDetail';
import Toast from './components/Toast';

function Home({ onShowToast }) {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <Philosophy />
    </>
  );
}

function App() {
  const [toastMessage, setToastMessage] = useState(null);

  const showToast = (message) => {
    setToastMessage(message);
  };

  const hideToast = () => {
    setToastMessage(null);
  };

  return (
    <CartProvider>
      <Router>
        <div className="min-h-screen bg-off-white">
          <Navbar onShowToast={showToast} />
          <Routes>
            <Route path="/" element={<Home onShowToast={showToast} />} />
            <Route path="/product/:id" element={<ProductDetail />} />
          </Routes>
          <Footer onShowToast={showToast} />
          {toastMessage && (
            <Toast message={toastMessage} onClose={hideToast} />
          )}
        </div>
      </Router>
    </CartProvider>
  );
}

export default App;
