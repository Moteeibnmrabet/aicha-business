import React, { useState, useEffect } from 'react';
import { NavLink, useParams, useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { slugToName, nameToSlug } from '../utils/categorySlug';
import ProductCard from '../components/ProductCard';
import ProductModal from '../components/ProductModal';

const CollectionPage = () => {
  const { slug } = useParams();
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const categoryName = slug ? slugToName(slug, categories) : null;

  useEffect(() => {
    api.getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = categoryName
          ? await api.getProducts(categoryName)
          : await api.getProducts();
        setProducts(data);
      } catch (err) {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, [categoryName]);

  const handleProductClick = (product) => {
    setSelectedProduct(product);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedProduct(null);
  };

  const pageTitle = categoryName || (slug ? slug.replace(/-/g, ' ') : 'Toute la collection');

  return (
    <div className="min-h-screen mt-16 bg-off-white flex flex-col md:flex-row">
      <aside className="w-full md:w-64 flex-shrink-0 border-r border-light-gray bg-white/50 hidden md:block">
        <nav className="sticky top-24 py-8 px-6">
          <p className="text-xs font-sans font-light text-deep-black/50 uppercase tracking-wider mb-4">
            Catégories
          </p>
          <ul className="space-y-1">
            <li>
              <NavLink
                to="/collection"
                end
                className={({ isActive }) =>
                  `block py-2 font-sans font-light text-sm transition-colors ${
                    isActive ? 'text-deep-black' : 'text-deep-black/70 hover:text-deep-black'
                  }`
                }
              >
                Tous
              </NavLink>
            </li>
            {categories.map((cat) => {
              const catSlug = nameToSlug(cat.name);
              return (
                <li key={cat._id || cat.name}>
                  <NavLink
                    to={`/collection/${catSlug}`}
                    className={({ isActive }) =>
                      `block py-2 font-sans font-light text-sm transition-colors ${
                        isActive ? 'text-deep-black' : 'text-deep-black/70 hover:text-deep-black'
                      }`
                    }
                  >
                    {cat.name}
                  </NavLink>
                </li>
              );
            })}
          </ul>
        </nav>
      </aside>

      {/* Mobile: category filter dropdown */}
      <div className="md:hidden w-full border-b border-light-gray bg-white/50 px-4 py-3">
        <select
          className="w-full px-4 py-2 border border-light-gray font-sans font-light text-sm bg-off-white"
          value={slug || ''}
          onChange={(e) => {
            const val = e.target.value;
            navigate(val ? `/collection/${val}` : '/collection');
          }}
        >
          <option value="">Tous</option>
          {categories.map((cat) => (
            <option key={cat._id || cat.name} value={nameToSlug(cat.name)}>
              {cat.name}
            </option>
          ))}
        </select>
      </div>

      {/* Main content */}
      <main className="flex-1 py-8 md:py-12 px-6">
        <h1 className="text-3xl md:text-4xl font-serif font-light mb-2 tracking-tight text-deep-black">
          {pageTitle}
        </h1>
        <p className="font-sans font-light text-deep-black/60 text-sm mb-10">
          {products.length} produit{products.length !== 1 ? 's' : ''}
        </p>

        {loading ? (
          <div className="text-center py-16">
            <p className="font-sans font-light text-deep-black/70">Chargement...</p>
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="font-sans font-light text-deep-black/70">Aucun produit dans cette catégorie.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.map((product, index) => (
              <ProductCard
                key={product._id || product.id}
                product={product}
                index={index}
                onProductClick={handleProductClick}
              />
            ))}
          </div>
        )}
      </main>

      {selectedProduct && (
        <ProductModal
          product={selectedProduct}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </div>
  );
};

export default CollectionPage;
