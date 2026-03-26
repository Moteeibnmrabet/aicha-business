const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const getAuthToken = () => {
  return localStorage.getItem('adminToken');
};

const getUserToken = () => {
  return localStorage.getItem('userToken');
};

// Message d'erreur si le backend ne répond pas (Failed to fetch)
const handleFetchError = (err) => {
  if (err instanceof TypeError && err.message === 'Failed to fetch') {
    throw new Error(
      'Serveur backend inaccessible. Démarrez-le avec : cd backend puis npm run dev (port 5000).'
    );
  }
  throw err;
};

// API calls
export const api = {
  // Products
  getProducts: async (category = null) => {
    try {
      const url = category
        ? `${API_URL}/products?category=${encodeURIComponent(category)}`
        : `${API_URL}/products`;
      const response = await fetch(url);
      if (!response.ok) throw new Error('Failed to fetch products');
      return response.json();
    } catch (err) {
      handleFetchError(err);
    }
  },

  getProduct: async (id) => {
    try {
      const response = await fetch(`${API_URL}/products/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      return response.json();
    } catch (err) {
      handleFetchError(err);
    }
  },

  createProduct: async (productData, imageFile = null) => {
    const token = getAuthToken();
    const formData = new FormData();
    
    // Ajouter tous les champs texte
    Object.keys(productData).forEach(key => {
      if (key !== 'image' && productData[key] !== null && productData[key] !== undefined) {
        if (Array.isArray(productData[key])) {
          formData.append(key, JSON.stringify(productData[key]));
        } else {
          formData.append(key, productData[key]);
        }
      }
    });
    
    // Ajouter l'image si elle existe
    if (imageFile) {
      formData.append('image', imageFile);
    } else if (productData.image) {
      // Si c'est une URL, l'ajouter comme champ texte
      formData.append('image', productData.image);
    }
    
    try {
      const response = await fetch(`${API_URL}/products`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create product');
      }
      return response.json();
    } catch (err) {
      handleFetchError(err);
    }
  },

  updateProduct: async (id, productData, imageFile = null) => {
    const token = getAuthToken();
    const formData = new FormData();
    
    // Ajouter tous les champs texte
    Object.keys(productData).forEach(key => {
      if (key !== 'image' && productData[key] !== null && productData[key] !== undefined) {
        if (Array.isArray(productData[key])) {
          formData.append(key, JSON.stringify(productData[key]));
        } else {
          formData.append(key, productData[key]);
        }
      }
    });
    
    // Ajouter l'image si elle existe
    if (imageFile) {
      formData.append('image', imageFile);
    } else if (productData.image) {
      // Si c'est une URL, l'ajouter comme champ texte
      formData.append('image', productData.image);
    }
    
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update product');
      }
      return response.json();
    } catch (err) {
      handleFetchError(err);
    }
  },

  deleteProduct: async (id) => {
    const token = getAuthToken();
    try {
      const response = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete product');
      }
      return response.json();
    } catch (err) {
      handleFetchError(err);
    }
  },

  // Settings (public + admin)
  getSettings: async () => {
    try {
      const response = await fetch(`${API_URL}/settings`);
      if (!response.ok) throw new Error('Failed to fetch settings');
      return response.json();
    } catch (err) {
      handleFetchError(err);
    }
  },

  updateSettings: async (settingsData, heroImageFile = null) => {
    const token = getAuthToken();
    const formData = new FormData();
    Object.keys(settingsData).forEach(key => {
      if (settingsData[key] !== null && settingsData[key] !== undefined) {
        if (Array.isArray(settingsData[key])) {
          formData.append(key, JSON.stringify(settingsData[key]));
        } else {
          formData.append(key, settingsData[key]);
        }
      }
    });
    if (heroImageFile) {
      formData.append('heroImage', heroImageFile);
    }
    try {
      const response = await fetch(`${API_URL}/settings`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update settings');
      }
      return response.json();
    } catch (err) {
      handleFetchError(err);
    }
  },

  // Categories (public + admin)
  getCategories: async () => {
    try {
      const response = await fetch(`${API_URL}/categories`);
      if (!response.ok) throw new Error('Failed to fetch categories');
      return response.json();
    } catch (err) {
      handleFetchError(err);
    }
  },

  createCategory: async (data, imageFile = null) => {
    const token = getAuthToken();
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    if (imageFile) formData.append('image', imageFile);
    try {
      const response = await fetch(`${API_URL}/categories`, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to create category');
      }
      return response.json();
    } catch (err) {
      handleFetchError(err);
    }
  },

  updateCategory: async (id, data, imageFile = null) => {
    const token = getAuthToken();
    const formData = new FormData();
    Object.keys(data).forEach(key => {
      if (data[key] !== null && data[key] !== undefined) {
        formData.append(key, data[key]);
      }
    });
    if (imageFile) formData.append('image', imageFile);
    try {
      const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'PUT',
        headers: { 'Authorization': `Bearer ${token}` },
        body: formData
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to update category');
      }
      return response.json();
    } catch (err) {
      handleFetchError(err);
    }
  },

  deleteCategory: async (id) => {
    const token = getAuthToken();
    try {
      const response = await fetch(`${API_URL}/categories/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Failed to delete category');
      }
      return response.json();
    } catch (err) {
      handleFetchError(err);
    }
  },

  // Payment config (no secrets)
  getConfig: async () => {
    try {
      const response = await fetch(`${API_URL}/config`);
      if (!response.ok) throw new Error('Failed to fetch config');
      return response.json();
    } catch (err) {
      handleFetchError(err);
    }
  },

  createCheckoutSession: async (items, currency = 'eur', successUrl, cancelUrl) => {
    const token = getUserToken();
    try {
      const response = await fetch(`${API_URL}/checkout/create-checkout-session`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({ items, currency, successUrl, cancelUrl })
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to create checkout session');
      }
      return response.json();
    } catch (err) {
      handleFetchError(err);
    }
  },

  createPayPalOrder: async (items, currency = 'eur') => {
    const token = getUserToken();
    try {
      const response = await fetch(`${API_URL}/checkout/create-paypal-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({ items, currency })
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to create PayPal order');
      }
      return response.json();
    } catch (err) {
      handleFetchError(err);
    }
  },

  capturePayPalOrder: async (orderId, items, total, currency) => {
    const token = getUserToken();
    try {
      const response = await fetch(`${API_URL}/checkout/capture-paypal-order`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` })
        },
        body: JSON.stringify({ orderId, items, total, currency })
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to capture PayPal order');
      }
      return response.json();
    } catch (err) {
      handleFetchError(err);
    }
  },

  // Orders (admin)
  getOrders: async () => {
    const token = getAuthToken();
    try {
      const response = await fetch(`${API_URL}/orders`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch orders');
      return response.json();
    } catch (err) {
      handleFetchError(err);
    }
  },

  getOrder: async (id) => {
    const token = getAuthToken();
    try {
      const response = await fetch(`${API_URL}/orders/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) throw new Error('Failed to fetch order');
      return response.json();
    } catch (err) {
      handleFetchError(err);
    }
  },

  updateOrder: async (id, data) => {
    const token = getAuthToken();
    try {
      const response = await fetch(`${API_URL}/orders/${id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(data)
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Failed to update order');
      }
      return response.json();
    } catch (err) {
      handleFetchError(err);
    }
  },

  refundOrder: async (id) => {
    const token = getAuthToken();
    try {
      const response = await fetch(`${API_URL}/orders/${id}/refund`, {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.message || 'Refund failed');
      }
      return response.json();
    } catch (err) {
      handleFetchError(err);
    }
  },

  // Auth - Admin
  adminLogin: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/admin/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }
      return response.json();
    } catch (err) {
      handleFetchError(err);
    }
  },

  // Auth - Customer
  customerLogin: async (email, password) => {
    try {
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Login failed');
      }
      return response.json();
    } catch (err) {
      handleFetchError(err);
    }
  },

  register: async (email, password, name = '') => {
    try {
      const response = await fetch(`${API_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, name })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Registration failed');
      }
      return response.json();
    } catch (err) {
      handleFetchError(err);
    }
  },

  googleLogin: async (credential) => {
    try {
      const response = await fetch(`${API_URL}/auth/google`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ credential })
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || 'Google login failed');
      }
      return response.json();
    } catch (err) {
      handleFetchError(err);
    }
  }
};
