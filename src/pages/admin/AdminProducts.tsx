import React, { useState, useEffect } from 'react';
import { Plus, Edit2, Trash2, Search, Package, X, Upload } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';
import { Product, Category } from '../../types';

const AdminProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);

  const [formData, setFormData] = useState({
    name: '',
    slug: '',
    category_id: '',
    price: '',
    stock: '',
    description: '',
    application: 'home',
    is_featured: false,
    is_new: false,
    images: ['']
  });
  const [uploading, setUploading] = useState(false);

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formDataUpload = new FormData();
    for (let i = 0; i < files.length; i++) {
      formDataUpload.append('images', files[i]);
    }

    setUploading(true);
    try {
      const res = await fetch('/api/admin/products/upload', {
        method: 'POST',
        body: formDataUpload,
      });
      if (res.ok) {
        const { filePaths } = await res.json();
        const newImages = [...formData.images.filter(img => img.trim() !== ''), ...filePaths];
        setFormData({ ...formData, images: newImages.length > 0 ? newImages : [''] });
        toast.success('Images uploaded successfully');
      }
    } catch (err) {
      toast.error('Image upload failed');
    } finally {
      setUploading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [prodRes, catRes] = await Promise.all([
        fetch('/api/products'),
        fetch('/api/categories')
      ]);
      const [prodData, catData] = await Promise.all([
        prodRes.json(),
        catRes.json()
      ]);
      setProducts(prodData);
      setCategories(catData);
    } catch (err) {
      toast.error('Failed to fetch data');
    } finally {
      setLoading(false);
    }
  };

  const handleOpenModal = (product: Product | null = null) => {
    if (product) {
      setEditingProduct(product);
      setFormData({
        name: product.name,
        slug: product.slug,
        category_id: product.category_id.toString(),
        price: product.price.toString(),
        stock: product.stock.toString(),
        description: product.description,
        application: product.application,
        is_featured: !!product.is_featured,
        is_new: !!product.is_new,
        images: Array.isArray(product.images) ? product.images : JSON.parse(product.images as any)
      });
    } else {
      setEditingProduct(null);
      setFormData({
        name: '',
        slug: '',
        category_id: categories[0]?.id.toString() || '',
        price: '',
        stock: '',
        description: '',
        application: 'home',
        is_featured: false,
        is_new: true,
        images: ['']
      });
    }
    setIsModalOpen(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingProduct ? `/api/products/${editingProduct.id}` : '/api/products';
    const method = editingProduct ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          category_id: parseInt(formData.category_id),
          price: parseFloat(formData.price),
          stock: parseInt(formData.stock),
          images: formData.images.filter(img => img.trim() !== '')
        })
      });

      if (res.ok) {
        toast.success(editingProduct ? 'Product updated' : 'Product created');
        setIsModalOpen(false);
        fetchData();
      } else {
        const err = await res.json();
        toast.error(err.error || 'Operation failed');
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  const handleDelete = async (id: number) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;

    try {
      const res = await fetch(`/api/products/${id}`, { method: 'DELETE' });
      if (res.ok) {
        toast.success('Product deleted');
        fetchData();
      }
    } catch (err) {
      toast.error('Delete failed');
    }
  };

  const filteredProducts = products.filter(p => 
    p.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    p.slug.toLowerCase().includes(searchTerm.toLowerCase())
  );

  if (loading) return <div className="p-8 text-center">Loading products...</div>;

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Products</h1>
          <p className="text-stone-500 text-sm uppercase tracking-widest font-bold">Manage your inventory</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-primary py-3 px-8 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add Product</span>
        </button>
      </div>

      <div className="glass-card p-4 flex items-center space-x-4">
        <Search className="w-5 h-5 text-stone-500" />
        <input 
          type="text"
          placeholder="Search products by name or slug..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="bg-transparent border-none outline-none w-full text-sm font-bold uppercase tracking-widest"
        />
      </div>

      <div className="glass-card overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-white/5 bg-white/5">
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-stone-500">Product</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-stone-500">Category</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-stone-500">Price</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-stone-500">Stock</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-stone-500">Status</th>
                <th className="px-6 py-4 text-[10px] font-black uppercase tracking-widest text-stone-500 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredProducts.map((product) => (
                <tr key={product.id} className="hover:bg-white/5 transition-colors">
                  <td className="px-6 py-4">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 rounded-lg bg-stone-900 overflow-hidden shrink-0">
                        <img 
                          src={Array.isArray(product.images) ? product.images[0] : JSON.parse(product.images as any)[0]} 
                          alt={product.name} 
                          className="w-full h-full object-cover"
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold uppercase tracking-tight">{product.name}</p>
                        <p className="text-[10px] text-stone-500 font-mono">{product.slug}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-bold text-stone-400 uppercase tracking-widest">{product.category_name}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-sm font-black">₹{product.price.toLocaleString()}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className={`text-xs font-bold ${product.stock < 10 ? 'text-red-400' : 'text-stone-400'}`}>
                      {product.stock} units
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex flex-wrap gap-2">
                      {product.is_featured ? <span className="px-2 py-0.5 bg-primary/20 text-primary text-[8px] font-black uppercase rounded-full">Featured</span> : null}
                      {product.is_new ? <span className="px-2 py-0.5 bg-blue-500/20 text-blue-400 text-[8px] font-black uppercase rounded-full">New</span> : null}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <button 
                        onClick={() => handleOpenModal(product)}
                        className="p-2 hover:bg-white/10 rounded-lg text-stone-400 hover:text-white transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button 
                        onClick={() => handleDelete(product.id)}
                        className="p-2 hover:bg-red-500/10 rounded-lg text-stone-400 hover:text-red-400 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/80 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-4xl bg-[#0f0f0f] border border-white/10 rounded-3xl overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
            >
              <div className="p-6 border-b border-white/5 flex items-center justify-between bg-white/5">
                <h2 className="text-xl font-black uppercase tracking-tight">
                  {editingProduct ? 'Edit Product' : 'Add New Product'}
                </h2>
                <button onClick={() => setIsModalOpen(false)} className="p-2 hover:bg-white/10 rounded-full transition-colors">
                  <X className="w-6 h-6" />
                </button>
              </div>

              <form onSubmit={handleSubmit} className="p-8 overflow-y-auto space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Product Name</label>
                    <input 
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-colors"
                      placeholder="e.g. 9W LED Bulb"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Slug (URL identifier)</label>
                    <input 
                      required
                      value={formData.slug}
                      onChange={(e) => setFormData({...formData, slug: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-colors"
                      placeholder="e.g. 9w-led-bulb"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Category</label>
                    <select 
                      required
                      value={formData.category_id}
                      onChange={(e) => setFormData({...formData, category_id: e.target.value})}
                      className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-colors appearance-none"
                    >
                      {categories.map(cat => (
                        <option key={cat.id} value={cat.id} className="bg-[#0f0f0f]">{cat.name}</option>
                      ))}
                    </select>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Price (₹)</label>
                      <input 
                        required
                        type="number"
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-colors"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Stock</label>
                      <input 
                        required
                        type="number"
                        value={formData.stock}
                        onChange={(e) => setFormData({...formData, stock: e.target.value})}
                        className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-colors"
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Description</label>
                  <textarea 
                    required
                    rows={4}
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-colors resize-none"
                    placeholder="Describe the product features and benefits..."
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Product Images</label>
                    <label className="cursor-pointer text-xs font-black uppercase tracking-widest text-primary flex items-center space-x-2 hover:opacity-80 transition-opacity">
                      <Upload className="w-4 h-4" />
                      <span>{uploading ? 'Uploading...' : 'Upload Local Files'}</span>
                      <input 
                        type="file" 
                        multiple 
                        accept="image/*" 
                        className="hidden" 
                        onChange={handleImageUpload}
                        disabled={uploading}
                      />
                    </label>
                  </div>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {formData.images.filter(img => img.trim() !== '').map((url, index) => (
                      <div key={index} className="relative group aspect-square rounded-2xl overflow-hidden bg-stone-900 border border-white/10">
                        <img src={url} alt={`Product ${index}`} className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => {
                            const newImages = formData.images.filter((_, i) => i !== index);
                            setFormData({...formData, images: newImages.length > 0 ? newImages : ['']});
                          }}
                          className="absolute top-2 right-2 p-1.5 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <X className="w-3 h-3" />
                        </button>
                      </div>
                    ))}
                  </div>

                  <div className="space-y-2">
                    <p className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Add Image via URL</p>
                    {formData.images.map((url, index) => (
                      <div key={index} className="flex space-x-2">
                        <input 
                          value={url}
                          onChange={(e) => {
                            const newImages = [...formData.images];
                            newImages[index] = e.target.value;
                            setFormData({...formData, images: newImages});
                          }}
                          className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-colors"
                          placeholder="https://example.com/image.jpg"
                        />
                        {formData.images.length > 1 && (
                          <button 
                            type="button"
                            onClick={() => {
                              const newImages = formData.images.filter((_, i) => i !== index);
                              setFormData({...formData, images: newImages});
                            }}
                            className="p-4 hover:bg-red-500/10 text-red-400 rounded-2xl transition-colors"
                          >
                            <Trash2 className="w-5 h-5" />
                          </button>
                        )}
                      </div>
                    ))}
                    <button 
                      type="button"
                      onClick={() => setFormData({...formData, images: [...formData.images, '']})}
                      className="text-xs font-black uppercase tracking-widest text-primary flex items-center space-x-2 hover:opacity-80 transition-opacity"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Add Another URL</span>
                    </button>
                  </div>
                </div>

                <div className="flex flex-wrap gap-8 pt-4">
                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.is_featured ? 'bg-primary border-primary' : 'border-white/10 group-hover:border-white/20'}`}>
                      {formData.is_featured && <X className="w-4 h-4 text-black rotate-45" />}
                    </div>
                    <input 
                      type="checkbox"
                      className="hidden"
                      checked={formData.is_featured}
                      onChange={(e) => setFormData({...formData, is_featured: e.target.checked})}
                    />
                    <span className="text-xs font-bold uppercase tracking-widest">Featured Product</span>
                  </label>

                  <label className="flex items-center space-x-3 cursor-pointer group">
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-all ${formData.is_new ? 'bg-blue-500 border-blue-500' : 'border-white/10 group-hover:border-white/20'}`}>
                      {formData.is_new && <X className="w-4 h-4 text-white rotate-45" />}
                    </div>
                    <input 
                      type="checkbox"
                      className="hidden"
                      checked={formData.is_new}
                      onChange={(e) => setFormData({...formData, is_new: e.target.checked})}
                    />
                    <span className="text-xs font-bold uppercase tracking-widest">New Arrival</span>
                  </label>
                </div>

                <div className="flex justify-end space-x-4 pt-8">
                  <button 
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="px-8 py-4 text-xs font-black uppercase tracking-widest text-stone-500 hover:text-white transition-colors"
                  >
                    Cancel
                  </button>
                  <button 
                    type="submit"
                    className="btn-primary px-12 py-4"
                  >
                    {editingProduct ? 'Save Changes' : 'Create Product'}
                  </button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminProducts;
