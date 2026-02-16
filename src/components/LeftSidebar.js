import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { api } from '../services/api';
import { useCategory } from '../context/CategoryContext';
import { useSidebar } from '../context/SidebarContext';
import { scrollToSection } from '../utils/smoothScroll';

const LeftSidebar = () => {
  const [categories, setCategories] = useState([]);
  const location = useLocation();
  const { selectedCategory, setSelectedCategory } = useCategory();
  const { isCollapsed, toggleSidebar } = useSidebar();

  useEffect(() => {
    api.getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const handleSelect = (category) => {
    setSelectedCategory(category);
    if (location.pathname !== '/') {
      window.location.href = `/#featured-products`;
    } else {
      scrollToSection('featured-products');
    }
  };

  return (
    <aside
      className={`fixed left-0 top-0 z-40 h-screen pt-24 pb-8 border-r border-light-gray bg-off-white/95 backdrop-blur-sm hidden md:block transition-all duration-300 ease-in-out ${
        isCollapsed ? 'w-16' : 'w-56'
      }`}
      aria-label="Navigation par catégories"
    >
      <nav className={`h-full flex flex-col ${isCollapsed ? 'px-0 items-center' : 'px-6'}`}>
        {!isCollapsed && (
          <>
            <p className="text-xs font-sans font-light text-deep-black/50 uppercase tracking-wider mb-4">
              Catégories
            </p>
            <ul className="space-y-1 flex-1">
              <li>
                <button
                  type="button"
                  onClick={() => handleSelect(null)}
                  className={`block w-full text-left py-2.5 font-sans font-light text-sm transition-colors ${
                    selectedCategory === null
                      ? 'text-deep-black'
                      : 'text-deep-black/70 hover:text-deep-black'
                  }`}
                >
                  Tous
                </button>
              </li>
              {categories.map((cat) => (
                <li key={cat._id || cat.name}>
                  <button
                    type="button"
                    onClick={() => handleSelect(cat.name)}
                    className={`block w-full text-left py-2.5 font-sans font-light text-sm transition-colors truncate ${
                      selectedCategory === cat.name
                        ? 'text-deep-black'
                        : 'text-deep-black/70 hover:text-deep-black'
                    }`}
                    title={cat.name}
                  >
                    {cat.name}
                  </button>
                </li>
              ))}
            </ul>
          </>
        )}

        <button
          type="button"
          onClick={toggleSidebar}
          className="mt-auto flex items-center justify-center w-full py-3 text-deep-black/70 hover:text-deep-black transition-colors"
          aria-label={isCollapsed ? 'Ouvrir le menu' : 'Réduire le menu'}
          title={isCollapsed ? 'Ouvrir le menu' : 'Réduire le menu'}
        >
          <svg
            className={`w-5 h-5 transition-transform duration-300 ${isCollapsed ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 19l-7-7 7-7" />
          </svg>
        </button>
      </nav>
    </aside>
  );
};

export default LeftSidebar;
