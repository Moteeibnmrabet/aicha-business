import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { api } from '../services/api';
import { getImageUrl } from '../utils/imageUtils';

const TABS = ['Produits', 'Commandes', 'Hero', 'Catégories', 'Philosophie', 'Livraison & Paiement', 'Footer'];

const Admin = () => {
  const [activeTab, setActiveTab] = useState('Produits');
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [categories, setCategories] = useState([]);
  const [settings, setSettings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [orderTracking, setOrderTracking] = useState({ tracking_number: '', shipping_status: '' });
  const [orderUpdating, setOrderUpdating] = useState(false);
  const [orderRefunding, setOrderRefunding] = useState(null);
  const [error, setError] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [formData, setFormData] = useState({
    name: '',
    price: '',
    image: '',
    category: 'Grandes Trousses',
    description: '',
    materials: ['Lin', 'Coton', 'Velours']
  });
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('adminToken');
    if (!token) {
      navigate('/admin/login');
      return;
    }
    loadData();
  }, [navigate]);

  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, categoriesData, settingsData, ordersData] = await Promise.all([
        api.getProducts(),
        api.getCategories(),
        api.getSettings(),
        api.getOrders().catch(() => [])
      ]);
      setProducts(productsData);
      setCategories(categoriesData);
      setSettings(settingsData);
      setOrders(ordersData);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    localStorage.removeItem('adminUser');
    navigate('/admin/login');
  };

  // --- Produits ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingProduct) {
        await api.updateProduct(editingProduct._id, formData, imageFile);
      } else {
        await api.createProduct(formData, imageFile);
      }
      await loadData();
      setShowForm(false);
      setEditingProduct(null);
      setImageFile(null);
      setImagePreview(null);
      setFormData({ name: '', price: '', image: '', category: 'Grandes Trousses', description: '', materials: ['Lin', 'Coton', 'Velours'] });
    } catch (err) {
      setError(err.message);
    }
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setFormData({
      name: product.name,
      price: String(product.price),
      image: product.image || '',
      category: product.category,
      description: product.description || '',
      materials: product.materials || ['Lin', 'Coton', 'Velours']
    });
    setImageFile(null);
    setImagePreview(product.image ? getImageUrl(product.image) : null);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Supprimer ce produit ?')) return;
    try {
      await api.deleteProduct(id);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingProduct(null);
    setImageFile(null);
    setImagePreview(null);
    setFormData({ name: '', price: '', image: '', category: 'Grandes Trousses', description: '', materials: ['Lin', 'Coton', 'Velours'] });
  };

  const handleImageChange = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
      setFormData((prev) => ({ ...prev, image: '' }));
    }
  };

  // --- Settings (Hero, Philosophie, Footer) ---
  const [settingsForm, setSettingsForm] = useState({});
  const [heroImageFile, setHeroImageFile] = useState(null);

  useEffect(() => {
    if (settings) {
      setSettingsForm({
        heroImage: settings.heroImage || '',
        heroTitle: settings.heroTitle || '',
        heroSubtitle: settings.heroSubtitle || '',
        heroButtonText: settings.heroButtonText || 'Explorer',
        philosophyTitle: settings.philosophyTitle || '',
        philosophyParagraphs: Array.isArray(settings.philosophyParagraphs) ? settings.philosophyParagraphs.join('\n\n') : '',
        shippingTitle: settings.shippingTitle || 'Livraison mondiale',
        shippingText: settings.shippingText || '',
        paymentTitle: settings.paymentTitle || 'Paiement sécurisé',
        paymentText: settings.paymentText || '',
        paymentMethods: Array.isArray(settings.paymentMethods) ? settings.paymentMethods.join(', ') : 'Visa, Mastercard, PayPal',
        footerTitle: settings.footerTitle || '',
        footerSubtitle: settings.footerSubtitle || '',
        copyrightText: settings.copyrightText || ''
      });
    }
  }, [settings]);

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const payload = {
        ...settingsForm,
        philosophyParagraphs: typeof settingsForm.philosophyParagraphs === 'string'
          ? settingsForm.philosophyParagraphs.split('\n\n').filter(Boolean)
          : settingsForm.philosophyParagraphs,
        paymentMethods: typeof settingsForm.paymentMethods === 'string'
          ? settingsForm.paymentMethods.split(',').map((p) => p.trim()).filter(Boolean)
          : settingsForm.paymentMethods
      };
      await api.updateSettings(payload, heroImageFile);
      setHeroImageFile(null);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  // --- Categories admin ---
  const [categoryForm, setCategoryForm] = useState({ name: '', image: '', description: '', order: 0 });
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryImageFile, setCategoryImageFile] = useState(null);

  const handleCategorySubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (editingCategory) {
        await api.updateCategory(editingCategory._id, categoryForm, categoryImageFile);
      } else {
        await api.createCategory(categoryForm, categoryImageFile);
      }
      setEditingCategory(null);
      setCategoryForm({ name: '', image: '', description: '', order: categories.length });
      setCategoryImageFile(null);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!window.confirm('Supprimer cette catégorie ?')) return;
    try {
      await api.deleteCategory(id);
      await loadData();
    } catch (err) {
      setError(err.message);
    }
  };

  const handleRefund = async (orderId) => {
    if (!window.confirm('Déclencher un remboursement pour cette commande ?')) return;
    setOrderRefunding(orderId);
    setError('');
    try {
      await api.refundOrder(orderId);
      await loadData();
      setSelectedOrder(null);
    } catch (err) {
      setError(err.message);
    } finally {
      setOrderRefunding(null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center mt-16 bg-off-white">
        <p className="font-sans font-light text-deep-black/70">Chargement...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen mt-16 bg-off-white py-12 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-4xl font-serif font-light tracking-tight">Administration</h1>
          <button
            onClick={handleLogout}
            className="px-6 py-2 border border-deep-black/30 text-deep-black font-sans font-light text-sm tracking-wider uppercase hover:border-deep-black transition-colors"
          >
            Déconnexion
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 border-b border-light-gray mb-8">
          {TABS.map((tab) => (
            <button
              key={tab}
              type="button"
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 font-sans font-light text-sm uppercase tracking-wider transition-colors ${
                activeTab === tab
                  ? 'border-b-2 border-deep-black text-deep-black'
                  : 'text-deep-black/60 hover:text-deep-black'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700">{error}</div>
        )}

        {/* Tab: Produits */}
        {activeTab === 'Produits' && (
          <>
            <div className="flex gap-4 mb-6">
              <button
                onClick={() => setShowForm(true)}
                className="px-6 py-2 bg-deep-black text-white font-sans font-light text-sm tracking-wider uppercase hover:bg-deep-black/90 transition-colors"
              >
                + Ajouter un produit
              </button>
            </div>
            {showForm && (
              <div className="mb-8 bg-white p-8 border border-light-gray">
                <h2 className="text-2xl font-serif font-light mb-6">
                  {editingProduct ? 'Modifier le produit' : 'Nouveau produit'}
                </h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-sans font-light mb-2">Nom</label>
                      <input type="text" value={formData.name} onChange={(e) => setFormData({ ...formData, name: e.target.value })} required className="w-full px-4 py-2 border border-light-gray focus:outline-none focus:border-deep-black/30" />
                    </div>
                    <div>
                      <label className="block text-sm font-sans font-light mb-2">Prix (€)</label>
                      <input type="number" step="0.01" value={formData.price} onChange={(e) => setFormData({ ...formData, price: e.target.value })} required className="w-full px-4 py-2 border border-light-gray focus:outline-none focus:border-deep-black/30" />
                    </div>
                    <div className="md:col-span-2">
                      <label className="block text-sm font-sans font-light mb-2">Image</label>
                      <input type="file" accept="image/*" onChange={handleImageChange} className="w-full px-4 py-2 border border-light-gray" />
                      {imagePreview && <img src={imagePreview} alt="Preview" className="mt-4 w-48 h-48 object-cover border border-light-gray" />}
                      {!imageFile && (
                        <input type="url" value={formData.image} onChange={(e) => { setFormData({ ...formData, image: e.target.value }); if (e.target.value) setImagePreview(e.target.value); }} placeholder="URL image" className="mt-2 w-full px-4 py-2 border border-light-gray" />
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-sans font-light mb-2">Catégorie</label>
                      <select value={formData.category} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full px-4 py-2 border border-light-gray">
                        <option>Grandes Trousses</option>
                        <option>Vanity</option>
                        <option>Accessoires</option>
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-sans font-light mb-2">Description</label>
                    <textarea value={formData.description} onChange={(e) => setFormData({ ...formData, description: e.target.value })} required rows={4} className="w-full px-4 py-2 border border-light-gray" />
                  </div>
                  <div className="flex gap-4">
                    <button type="submit" className="px-6 py-2 bg-deep-black text-white font-sans font-light text-sm tracking-wider uppercase">{editingProduct ? 'Modifier' : 'Créer'}</button>
                    <button type="button" onClick={handleCancel} className="px-6 py-2 border border-deep-black/30 text-deep-black font-sans font-light text-sm uppercase">Annuler</button>
                  </div>
                </form>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <div key={product._id} className="bg-white border border-light-gray p-6">
                  <img src={getImageUrl(product.image)} alt={product.name} className="w-full h-48 object-cover mb-4" />
                  <h3 className="text-lg font-serif font-light mb-2">{product.name}</h3>
                  <p className="text-sm font-sans font-thin text-deep-black/70 mb-2">{product.price}€</p>
                  <p className="text-xs font-sans font-light text-deep-black/60 mb-4">{product.category}</p>
                  <div className="flex gap-2">
                    <button onClick={() => handleEdit(product)} className="flex-1 px-4 py-2 bg-deep-black text-white font-sans font-light text-xs uppercase">Modifier</button>
                    <button onClick={() => handleDelete(product._id)} className="flex-1 px-4 py-2 border border-red-300 text-red-700 font-sans font-light text-xs uppercase">Supprimer</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Tab: Commandes */}
        {activeTab === 'Commandes' && (
          <>
            <div className="mb-6">
              <p className="font-sans font-light text-deep-black/70 text-sm">Statut paiement mis à jour uniquement via webhook Stripe/PayPal. Remboursement via API.</p>
            </div>
            <div className="overflow-x-auto border border-light-gray">
              <table className="w-full font-sans text-sm">
                <thead>
                  <tr className="border-b border-light-gray bg-light-gray/30">
                    <th className="text-left p-4 font-light">Date</th>
                    <th className="text-left p-4 font-light">Total</th>
                    <th className="text-left p-4 font-light">Méthode</th>
                    <th className="text-left p-4 font-light">Statut paiement</th>
                    <th className="text-left p-4 font-light">Livraison</th>
                    <th className="text-left p-4 font-light">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((o) => (
                    <tr key={o._id} className="border-b border-light-gray hover:bg-off-white/50">
                      <td className="p-4 font-light">{o.created_at ? new Date(o.created_at).toLocaleString('fr-FR') : '-'}</td>
                      <td className="p-4 font-light">{o.total} {o.currency}</td>
                      <td className="p-4 font-light">{o.payment_method}</td>
                      <td className="p-4 font-light">{o.payment_status}</td>
                      <td className="p-4 font-light">{o.shipping_status || 'pending'}{o.tracking_number ? ` · ${o.tracking_number}` : ''}</td>
                      <td className="p-4">
                        <button type="button" onClick={() => { setSelectedOrder(o); setOrderTracking({ tracking_number: o.tracking_number || '', shipping_status: o.shipping_status || 'pending' }); }} className="text-deep-black/70 hover:text-deep-black font-light mr-2">Détails</button>
                        {o.payment_status === 'paid' && (
                          <button type="button" onClick={() => handleRefund(o._id)} disabled={orderRefunding === o._id} className="text-red-600 hover:text-red-700 font-light disabled:opacity-50">Rembourser</button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {orders.length === 0 && <p className="font-sans font-light text-deep-black/60 py-8 text-center">Aucune commande</p>}

            {selectedOrder && (
              <div className="fixed inset-0 z-50 flex items-center justify-center bg-deep-black/40 p-4" onClick={() => setSelectedOrder(null)}>
                <div className="bg-off-white max-w-2xl w-full max-h-[90vh] overflow-y-auto p-8" onClick={(e) => e.stopPropagation()}>
                  <div className="flex justify-between items-start mb-6">
                    <h2 className="text-2xl font-serif font-light">Commande {selectedOrder._id}</h2>
                    <button type="button" onClick={() => setSelectedOrder(null)} className="text-deep-black/70 hover:text-deep-black">Fermer</button>
                  </div>
                  <div className="space-y-4 mb-6">
                    <p><span className="font-light text-deep-black/60">Total :</span> {selectedOrder.total} {selectedOrder.currency}</p>
                    <p><span className="font-light text-deep-black/60">Paiement :</span> {selectedOrder.payment_method} · {selectedOrder.payment_status}</p>
                    <p><span className="font-light text-deep-black/60">Email :</span> {selectedOrder.customer_email || '-'}</p>
                    <div>
                      <p className="font-light text-deep-black/60 mb-2">Articles :</p>
                      <ul className="list-disc pl-6">
                        {selectedOrder.items && selectedOrder.items.map((it, i) => (
                          <li key={i}>{it.name} × {it.quantity} — {it.price} {selectedOrder.currency}</li>
                        ))}
                      </ul>
                    </div>
                  </div>
                  <form onSubmit={async (e) => { e.preventDefault(); setOrderUpdating(true); try { await api.updateOrder(selectedOrder._id, orderTracking); await loadData(); setSelectedOrder(null); } catch (err) { setError(err.message); } finally { setOrderUpdating(false); } }} className="space-y-4">
                    <div>
                      <label className="block text-sm font-sans font-light mb-2">Statut livraison</label>
                      <input type="text" value={orderTracking.shipping_status} onChange={(e) => setOrderTracking((t) => ({ ...t, shipping_status: e.target.value }))} placeholder="pending, shipped, delivered" className="w-full px-4 py-2 border border-light-gray" />
                    </div>
                    <div>
                      <label className="block text-sm font-sans font-light mb-2">Numéro de suivi</label>
                      <input type="text" value={orderTracking.tracking_number} onChange={(e) => setOrderTracking((t) => ({ ...t, tracking_number: e.target.value }))} placeholder="Tracking number" className="w-full px-4 py-2 border border-light-gray" />
                    </div>
                    <button type="submit" disabled={orderUpdating} className="px-6 py-2 bg-deep-black text-white font-sans font-light text-sm uppercase disabled:opacity-50">Enregistrer</button>
                  </form>
                </div>
              </div>
            )}
          </>
        )}

        {/* Tab: Hero */}
        {activeTab === 'Hero' && settings && (
          <div className="bg-white p-8 border border-light-gray max-w-2xl">
            <h2 className="text-2xl font-serif font-light mb-6">Section Hero</h2>
            <form onSubmit={handleSettingsSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-sans font-light mb-2">Image de fond</label>
                <input type="file" accept="image/*" onChange={(e) => setHeroImageFile(e.target.files?.[0] || null)} className="w-full px-4 py-2 border border-light-gray" />
                {settings.heroImage && !heroImageFile && (
                  <img src={getImageUrl(settings.heroImage)} alt="Hero" className="mt-2 w-full h-48 object-cover" />
                )}
              </div>
              <div>
                <label className="block text-sm font-sans font-light mb-2">Titre</label>
                <input type="text" value={settingsForm.heroTitle || ''} onChange={(e) => setSettingsForm({ ...settingsForm, heroTitle: e.target.value })} className="w-full px-4 py-2 border border-light-gray" />
              </div>
              <div>
                <label className="block text-sm font-sans font-light mb-2">Sous-titre (lignes séparées par Entrée)</label>
                <textarea value={settingsForm.heroSubtitle || ''} onChange={(e) => setSettingsForm({ ...settingsForm, heroSubtitle: e.target.value })} rows={3} className="w-full px-4 py-2 border border-light-gray" />
              </div>
              <div>
                <label className="block text-sm font-sans font-light mb-2">Texte du bouton</label>
                <input type="text" value={settingsForm.heroButtonText || ''} onChange={(e) => setSettingsForm({ ...settingsForm, heroButtonText: e.target.value })} className="w-full px-4 py-2 border border-light-gray" />
              </div>
              <button type="submit" className="px-6 py-2 bg-deep-black text-white font-sans font-light text-sm tracking-wider uppercase">Enregistrer</button>
            </form>
          </div>
        )}

        {/* Tab: Catégories */}
        {activeTab === 'Catégories' && (
          <>
            <div className="bg-white p-8 border border-light-gray mb-8 max-w-2xl">
              <h2 className="text-2xl font-serif font-light mb-6">{editingCategory ? 'Modifier la catégorie' : 'Nouvelle catégorie'}</h2>
              <form onSubmit={handleCategorySubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-sans font-light mb-2">Nom</label>
                  <input type="text" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} required className="w-full px-4 py-2 border border-light-gray" />
                </div>
                <div>
                  <label className="block text-sm font-sans font-light mb-2">Image</label>
                  <input type="file" accept="image/*" onChange={(e) => setCategoryImageFile(e.target.files?.[0] || null)} className="w-full px-4 py-2 border border-light-gray" />
                  {!categoryImageFile && (
                    <input type="url" value={categoryForm.image} onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.value })} placeholder="URL image" className="mt-2 w-full px-4 py-2 border border-light-gray" />
                  )}
                </div>
                <div>
                  <label className="block text-sm font-sans font-light mb-2">Description</label>
                  <input type="text" value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} className="w-full px-4 py-2 border border-light-gray" />
                </div>
                <div>
                  <label className="block text-sm font-sans font-light mb-2">Ordre</label>
                  <input type="number" value={categoryForm.order} onChange={(e) => setCategoryForm({ ...categoryForm, order: Number(e.target.value) })} className="w-full px-4 py-2 border border-light-gray" />
                </div>
                <div className="flex gap-4">
                  <button type="submit" className="px-6 py-2 bg-deep-black text-white font-sans font-light text-sm uppercase">{editingCategory ? 'Modifier' : 'Créer'}</button>
                  {editingCategory && (
                    <button type="button" onClick={() => { setEditingCategory(null); setCategoryForm({ name: '', image: '', description: '', order: categories.length }); }} className="px-6 py-2 border border-deep-black/30 text-deep-black font-sans font-light text-sm uppercase">Annuler</button>
                  )}
                </div>
              </form>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {categories.map((cat) => (
                <div key={cat._id} className="bg-white border border-light-gray p-6">
                  <img src={getImageUrl(cat.image)} alt={cat.name} className="w-full h-40 object-cover mb-4" />
                  <h3 className="text-lg font-serif font-light mb-2">{cat.name}</h3>
                  <p className="text-sm font-sans font-light text-deep-black/70 mb-4">{cat.description}</p>
                  <div className="flex gap-2">
                    <button onClick={() => { setEditingCategory(cat); setCategoryForm({ name: cat.name, image: cat.image || '', description: cat.description || '', order: cat.order ?? 0 }); }} className="flex-1 px-4 py-2 bg-deep-black text-white font-sans font-light text-xs uppercase">Modifier</button>
                    <button onClick={() => handleDeleteCategory(cat._id)} className="flex-1 px-4 py-2 border border-red-300 text-red-700 font-sans font-light text-xs uppercase">Supprimer</button>
                  </div>
                </div>
              ))}
            </div>
          </>
        )}

        {/* Tab: Philosophie */}
        {activeTab === 'Philosophie' && settings && (
          <div className="bg-white p-8 border border-light-gray max-w-2xl">
            <h2 className="text-2xl font-serif font-light mb-6">Section Philosophie</h2>
            <form onSubmit={handleSettingsSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-sans font-light mb-2">Titre</label>
                <input type="text" value={settingsForm.philosophyTitle || ''} onChange={(e) => setSettingsForm({ ...settingsForm, philosophyTitle: e.target.value })} className="w-full px-4 py-2 border border-light-gray" />
              </div>
              <div>
                <label className="block text-sm font-sans font-light mb-2">Paragraphes (séparés par une ligne vide)</label>
                <textarea value={settingsForm.philosophyParagraphs || ''} onChange={(e) => setSettingsForm({ ...settingsForm, philosophyParagraphs: e.target.value })} rows={10} className="w-full px-4 py-2 border border-light-gray" placeholder="Un paragraphe par bloc, séparez par une ligne vide" />
              </div>
              <button type="submit" className="px-6 py-2 bg-deep-black text-white font-sans font-light text-sm tracking-wider uppercase">Enregistrer</button>
            </form>
          </div>
        )}

        {/* Tab: Footer */}
        {activeTab === 'Footer' && settings && (
          <div className="bg-white p-8 border border-light-gray max-w-2xl">
            <h2 className="text-2xl font-serif font-light mb-6">Pied de page</h2>
            <form onSubmit={handleSettingsSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-sans font-light mb-2">Titre newsletter</label>
                <input type="text" value={settingsForm.footerTitle || ''} onChange={(e) => setSettingsForm({ ...settingsForm, footerTitle: e.target.value })} className="w-full px-4 py-2 border border-light-gray" />
              </div>
              <div>
                <label className="block text-sm font-sans font-light mb-2">Sous-titre newsletter</label>
                <input type="text" value={settingsForm.footerSubtitle || ''} onChange={(e) => setSettingsForm({ ...settingsForm, footerSubtitle: e.target.value })} className="w-full px-4 py-2 border border-light-gray" />
              </div>
              <div>
                <label className="block text-sm font-sans font-light mb-2">Copyright</label>
                <input type="text" value={settingsForm.copyrightText || ''} onChange={(e) => setSettingsForm({ ...settingsForm, copyrightText: e.target.value })} className="w-full px-4 py-2 border border-light-gray" />
              </div>
              <button type="submit" className="px-6 py-2 bg-deep-black text-white font-sans font-light text-sm tracking-wider uppercase">Enregistrer</button>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Admin;
