import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './context/CartContext';
import { CategoryProvider } from './context/CategoryContext';
import { SidebarProvider, useSidebar } from './context/SidebarContext';
import Navbar from './components/Navbar';
import LeftSidebar from './components/LeftSidebar';
import Hero from './components/Hero';
import Categories from './components/Categories';
import FeaturedProducts from './components/FeaturedProducts';
import Philosophy from './components/Philosophy';
import ShippingPayment from './components/ShippingPayment';
import Footer from './components/Footer';
import ProductDetail from './pages/ProductDetail';
import CollectionPage from './pages/CollectionPage';
import AdminLogin from './pages/AdminLogin';
import Admin from './pages/Admin';
import Toast from './components/Toast';

function Home({ onShowToast }) {
  return (
    <>
      <Hero />
      <Categories />
      <FeaturedProducts />
      <Philosophy />
      <ShippingPayment />
    </>
  );
}

function HomeLayout({ onShowToast }) {
  const { isCollapsed } = useSidebar();
  return (
    <>
      <LeftSidebar />
      <main className={`min-h-screen transition-all duration-300 ${isCollapsed ? 'md:ml-16' : 'md:ml-56'}`}>
        <Home onShowToast={onShowToast} />
      </main>
    </>
  );
}

function AppContent({ showToast, hideToast, toastMessage }) {
  const location = useLocation();
  const { isCollapsed } = useSidebar();
  const isHome = location.pathname === '/';
  const mainMargin = isHome ? (isCollapsed ? 'md:ml-16' : 'md:ml-56') : '';

  return (
    <div className="min-h-screen bg-off-white">
      <Navbar onShowToast={showToast} />
      <Routes>
        <Route path="/" element={<HomeLayout onShowToast={showToast} />} />
        <Route path="/product/:id" element={<ProductDetail />} />
        <Route path="/collection" element={<CollectionPage />} />
        <Route path="/collection/:slug" element={<CollectionPage />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/admin" element={<Admin />} />
      </Routes>
      <div className={`transition-all duration-300 ${mainMargin}`}>
        <Footer onShowToast={showToast} />
      </div>
      {toastMessage && (
        <Toast message={toastMessage} onClose={hideToast} />
      )}
    </div>
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
      <CategoryProvider>
        <Router>
          <SidebarProvider>
          <AppContent
            showToast={showToast}
            hideToast={hideToast}
            toastMessage={toastMessage}
          />
          </SidebarProvider>
        </Router>
      </CategoryProvider>
    </CartProvider>
  );
}

export default App;
