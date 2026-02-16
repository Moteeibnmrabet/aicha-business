import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { nameToSlug } from '../utils/categorySlug';

const CategoryFilter = ({ selectedCategory, onSelectCategory }) => {
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    api.getCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const handleSelect = (categoryName) => {
    if (onSelectCategory) {
      onSelectCategory(categoryName);
      return;
    }
    if (categoryName) {
      const slug = nameToSlug(categoryName);
      navigate(`/category/${slug}`);
    } else {
      navigate('/');
    }
  };

  return (
    <div className="flex flex-wrap justify-center gap-2 mb-12">
      <button
        type="button"
        onClick={() => handleSelect(null)}
        className={`px-6 py-2 font-sans font-light text-sm tracking-wider uppercase transition-colors ${
          !selectedCategory
            ? 'bg-deep-black text-white'
            : 'bg-white border border-deep-black/30 text-deep-black hover:border-deep-black/60'
        }`}
      >
        Tous
      </button>
      {categories.map((cat) => (
        <button
          key={cat._id || cat.name}
          type="button"
          onClick={() => handleSelect(cat.name)}
          className={`px-6 py-2 font-sans font-light text-sm tracking-wider uppercase transition-colors ${
            selectedCategory === cat.name
              ? 'bg-deep-black text-white'
              : 'bg-white border border-deep-black/30 text-deep-black hover:border-deep-black/60'
          }`}
        >
          {cat.name}
        </button>
      ))}
    </div>
  );
};

export default CategoryFilter;
