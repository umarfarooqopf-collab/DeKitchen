'use client';

import React, { useEffect, useState, useMemo } from 'react';
import AdminSidebar from '@/components/AdminSidebar';
import { MenuItem, FoodCategory } from '@/types';
import {
  Plus,
  Search,
  SlidersHorizontal,
  Edit2,
  Trash2,
  Check,
  X,
  AlertCircle,
  RotateCw,
  UtensilsCrossed,
  DollarSign,
  Star,
  CheckCircle2,
} from 'lucide-react';

export default function AdminMenuPage() {
  const [items, setItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<FoodCategory>('all');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);

  // New item form state
  const [newItemName, setNewItemName] = useState('');
  const [newItemCategory, setNewItemCategory] = useState<any>('burgers');
  const [newItemPrice, setNewItemPrice] = useState('9.99');
  const [newItemDesc, setNewItemDesc] = useState('');
  const [newItemImage, setNewItemImage] = useState('');
  const [newItemBadge, setNewItemBadge] = useState('');
  const [formError, setFormError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const fetchItems = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/menu');
      const data = await res.json();
      if (data.success && data.data) {
        setItems(data.data);
      }
    } catch (err) {
      console.error('Error fetching menu items:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const handleToggleStock = async (item: MenuItem) => {
    const updatedStock = !item.inStock;
    try {
      const res = await fetch(`/api/menu/${item.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ inStock: updatedStock }),
      });
      if (res.ok) {
        setItems((prev) =>
          prev.map((i) => (i.id === item.id ? { ...i, inStock: updatedStock } : i))
        );
      }
    } catch (err) {
      console.error('Stock toggle error:', err);
    }
  };

  const handleDeleteItem = async (id: string) => {
    if (!confirm('Are you sure you want to delete this menu dish?')) return;
    try {
      const res = await fetch(`/api/menu/${id}`, { method: 'DELETE' });
      if (res.ok) {
        setItems((prev) => prev.filter((i) => i.id !== id));
      }
    } catch (err) {
      console.error('Delete item error:', err);
    }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError('');

    if (!newItemName.trim() || !newItemPrice) {
      setFormError('Please provide item name and price.');
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch('/api/menu', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: newItemName.trim(),
          category: newItemCategory,
          price: parseFloat(newItemPrice),
          description: newItemDesc.trim(),
          image: newItemImage.trim() || 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80',
          badge: newItemBadge.trim() || undefined,
          inStock: true,
        }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || 'Failed to add item');
      }

      setItems((prev) => [data.data, ...prev]);
      setIsAddModalOpen(false);
      // Reset form
      setNewItemName('');
      setNewItemPrice('9.99');
      setNewItemDesc('');
      setNewItemImage('');
      setNewItemBadge('');
    } catch (err: any) {
      setFormError(err.message || 'Error creating dish');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;

    try {
      const res = await fetch(`/api/menu/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: editingItem.name,
          price: Number(editingItem.price),
          description: editingItem.description,
          badge: editingItem.badge,
        }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setItems((prev) =>
          prev.map((i) => (i.id === editingItem.id ? data.data : i))
        );
        setEditingItem(null);
      }
    } catch (err) {
      console.error('Save edit error:', err);
    }
  };

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const matchesCat = selectedCategory === 'all' || item.category === selectedCategory;
      const q = searchQuery.toLowerCase();
      const matchesSearch =
        q === '' ||
        item.name.toLowerCase().includes(q) ||
        item.description.toLowerCase().includes(q);
      return matchesCat && matchesSearch;
    });
  }, [items, selectedCategory, searchQuery]);

  return (
    <div className="flex flex-col lg:flex-row min-h-[calc(100vh-5rem)]">
      <AdminSidebar />

      <main className="flex-1 p-6 sm:p-10 space-y-8 overflow-y-auto">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-dark-800 pb-6">
          <div>
            <span className="text-xs text-primary font-bold uppercase tracking-wider block">
              Catalog Management
            </span>
            <h1 className="text-3xl font-black text-white tracking-tight mt-0.5">
              Menu Items & Pricing ({items.length})
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={fetchItems}
              className="p-2.5 rounded-xl border border-dark-700 text-gray-400 hover:text-white transition"
              title="Refresh Catalog"
            >
              <RotateCw className="w-4 h-4" />
            </button>

            <button
              onClick={() => setIsAddModalOpen(true)}
              className="px-5 py-2.5 rounded-xl bg-primary text-dark-950 font-bold text-xs flex items-center gap-2 hover:bg-primary-hover shadow-glow transition"
            >
              <Plus className="w-4 h-4 stroke-[3]" />
              <span>Add New Dish</span>
            </button>
          </div>
        </div>

        {/* Toolbar: Search and Category Filter */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search dishes by name or ingredient..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-dark-900 border border-dark-700 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-gray-500 focus:outline-none focus:border-primary"
            />
          </div>

          <div className="flex items-center gap-2 w-full md:w-auto overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {(['all', 'burgers', 'pizzas', 'sides', 'drinks', 'desserts'] as FoodCategory[]).map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold capitalize whitespace-nowrap transition ${
                  selectedCategory === cat
                    ? 'bg-primary text-dark-950 shadow-glow'
                    : 'bg-dark-900 border border-dark-700 text-gray-400 hover:text-white'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Menu Items Table / Cards */}
        {loading ? (
          <div className="py-20 text-center text-gray-400 text-sm">Loading catalog items...</div>
        ) : filteredItems.length === 0 ? (
          <div className="py-20 text-center bg-dark-900 border border-dark-800 rounded-3xl">
            <UtensilsCrossed className="w-10 h-10 text-dark-600 mx-auto mb-2" />
            <p className="text-sm text-gray-400">No dishes match your query.</p>
          </div>
        ) : (
          <div className="bg-dark-900 border border-dark-700/80 rounded-3xl overflow-hidden shadow-xl divide-y divide-dark-800">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 hover:bg-dark-850/60 transition"
              >
                <div className="flex items-center gap-4">
                  <div className="w-16 h-16 rounded-2xl overflow-hidden bg-dark-800 flex-shrink-0">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover"
                    />
                  </div>

                  <div className="space-y-1">
                    <div className="flex items-center gap-2.5">
                      <h3 className="text-sm font-bold text-white">{item.name}</h3>
                      {item.badge && (
                        <span className="text-[10px] bg-primary/20 text-primary font-bold px-2 py-0.5 rounded-md">
                          {item.badge}
                        </span>
                      )}
                      <span className="text-[10px] text-gray-500 uppercase font-semibold">
                        ({item.category})
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 line-clamp-1 max-w-md">
                      {item.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center justify-between md:justify-end gap-6 pt-3 md:pt-0 border-t md:border-0 border-dark-800">
                  <div className="text-right">
                    <span className="text-[10px] text-gray-500 block uppercase font-medium">Price</span>
                    <span className="text-base font-black text-white">${item.price.toFixed(2)}</span>
                  </div>

                  {/* In Stock Toggle */}
                  <button
                    onClick={() => handleToggleStock(item)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold transition flex items-center gap-1.5 ${
                      item.inStock
                        ? 'bg-green-500/20 text-green-400 border border-green-500/30'
                        : 'bg-red-500/20 text-red-400 border border-red-500/30'
                    }`}
                  >
                    {item.inStock ? <Check className="w-3.5 h-3.5" /> : <X className="w-3.5 h-3.5" />}
                    <span>{item.inStock ? 'In Stock' : 'Sold Out'}</span>
                  </button>

                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setEditingItem(item)}
                      className="p-2 rounded-xl border border-dark-700 text-gray-400 hover:text-white hover:bg-dark-800 transition"
                      title="Edit Item Details"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>

                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="p-2 rounded-xl border border-dark-700 text-gray-400 hover:text-accent-red hover:bg-dark-800 transition"
                      title="Delete Item"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Add Item Modal */}
        {isAddModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-lg bg-dark-900 border border-dark-700 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-dark-800 pb-4">
                <h3 className="text-xl font-bold text-white">Add New Food Dish</h3>
                <button
                  onClick={() => setIsAddModalOpen(false)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {formError && (
                <div className="p-3 rounded-xl bg-red-500/10 text-red-400 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4" />
                  <span>{formError}</span>
                </div>
              )}

              <form onSubmit={handleCreateItem} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-gray-300 font-semibold">Dish Name *</label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Truffle Mushroom Burger"
                    value={newItemName}
                    onChange={(e) => setNewItemName(e.target.value)}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-gray-300 font-semibold">Category *</label>
                    <select
                      value={newItemCategory}
                      onChange={(e) => setNewItemCategory(e.target.value)}
                      className="w-full bg-dark-800 border border-dark-700 rounded-xl px-3 py-2.5 text-white focus:outline-none focus:border-primary capitalize"
                    >
                      <option value="burgers">Burgers</option>
                      <option value="pizzas">Pizzas</option>
                      <option value="sides">Sides</option>
                      <option value="drinks">Drinks</option>
                      <option value="desserts">Desserts</option>
                    </select>
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-300 font-semibold">Price ($) *</label>
                    <input
                      type="number"
                      step="0.01"
                      required
                      value={newItemPrice}
                      onChange={(e) => setNewItemPrice(e.target.value)}
                      className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-semibold">Description</label>
                  <textarea
                    rows={2}
                    placeholder="Brief description of the ingredients..."
                    value={newItemDesc}
                    onChange={(e) => setNewItemDesc(e.target.value)}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <label className="text-gray-300 font-semibold">Image URL</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={newItemImage}
                      onChange={(e) => setNewItemImage(e.target.value)}
                      className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-gray-300 font-semibold">Badge (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. Chef Special, Spicy 🔥"
                      value={newItemBadge}
                      onChange={(e) => setNewItemBadge(e.target.value)}
                      className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsAddModalOpen(false)}
                    className="px-4 py-2 rounded-xl border border-dark-700 text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    disabled={submitting}
                    className="px-6 py-2 rounded-xl bg-primary text-dark-950 font-bold hover:bg-primary-hover shadow-glow"
                  >
                    {submitting ? 'Saving...' : 'Add Dish'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* Edit Item Modal */}
        {editingItem && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm animate-fadeIn">
            <div className="w-full max-w-md bg-dark-900 border border-dark-700 rounded-3xl p-6 sm:p-8 space-y-6 shadow-2xl">
              <div className="flex items-center justify-between border-b border-dark-800 pb-4">
                <h3 className="text-xl font-bold text-white">Edit Dish Details</h3>
                <button
                  onClick={() => setEditingItem(null)}
                  className="text-gray-400 hover:text-white"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleSaveEdit} className="space-y-4 text-xs">
                <div className="space-y-1">
                  <label className="text-gray-300 font-semibold">Dish Name</label>
                  <input
                    type="text"
                    value={editingItem.name}
                    onChange={(e) => setEditingItem({ ...editingItem, name: e.target.value })}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-semibold">Price ($)</label>
                  <input
                    type="number"
                    step="0.01"
                    value={editingItem.price}
                    onChange={(e) => setEditingItem({ ...editingItem, price: parseFloat(e.target.value) || 0 })}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-semibold">Description</label>
                  <textarea
                    rows={3}
                    value={editingItem.description}
                    onChange={(e) => setEditingItem({ ...editingItem, description: e.target.value })}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-gray-300 font-semibold">Badge</label>
                  <input
                    type="text"
                    value={editingItem.badge || ''}
                    onChange={(e) => setEditingItem({ ...editingItem, badge: e.target.value })}
                    className="w-full bg-dark-800 border border-dark-700 rounded-xl px-4 py-2.5 text-white focus:outline-none focus:border-primary"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setEditingItem(null)}
                    className="px-4 py-2 rounded-xl border border-dark-700 text-gray-400 hover:text-white"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-6 py-2 rounded-xl bg-primary text-dark-950 font-bold hover:bg-primary-hover shadow-glow"
                  >
                    Save Changes
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </main>
    </div>
  );
}
