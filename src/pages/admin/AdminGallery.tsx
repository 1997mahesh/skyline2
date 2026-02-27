import React, { useState, useEffect } from 'react';
import { Plus, Search, Trash2, Edit2, Upload, X, Loader2, Image as ImageIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { toast } from 'sonner';

interface GalleryImage {
  id: number;
  image_url: string;
  title: string;
  created_at: string;
}

const AdminGallery = () => {
  const [images, setImages] = useState<GalleryImage[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingImage, setEditingImage] = useState<GalleryImage | null>(null);
  const [uploading, setUploading] = useState(false);

  const [formData, setFormData] = useState({
    title: '',
    image_url: ''
  });

  useEffect(() => {
    fetchImages();
  }, []);

  const fetchImages = async () => {
    try {
      const res = await fetch('/api/admin/gallery');
      if (res.ok) {
        const data = await res.json();
        setImages(data);
      }
    } catch (err) {
      toast.error('Failed to fetch gallery images');
    } finally {
      setLoading(false);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formDataUpload = new FormData();
    formDataUpload.append('image', file);

    setUploading(true);
    try {
      const res = await fetch('/api/admin/gallery/upload', {
        method: 'POST',
        body: formDataUpload
      });
      if (res.ok) {
        const data = await res.json();
        setFormData({ ...formData, image_url: data.imageUrl });
        toast.success('Image uploaded successfully');
      } else {
        toast.error('Upload failed');
      }
    } catch (err) {
      toast.error('Something went wrong during upload');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const url = editingImage ? `/api/admin/gallery/${editingImage.id}` : '/api/admin/gallery';
    const method = editingImage ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (res.ok) {
        toast.success(editingImage ? 'Image updated' : 'Image added to gallery');
        setIsModalOpen(false);
        setEditingImage(null);
        setFormData({ title: '', image_url: '' });
        fetchImages();
      } else {
        const data = await res.json();
        toast.error(data.error || 'Operation failed');
      }
    } catch (err) {
      toast.error('Something went wrong');
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this image?')) return;

    try {
      const res = await fetch(`/api/admin/gallery/${id}`, {
        method: 'DELETE'
      });
      if (res.ok) {
        toast.success('Image deleted');
        fetchImages();
      }
    } catch (err) {
      toast.error('Failed to delete image');
    }
  };

  const openEditModal = (image: GalleryImage) => {
    setEditingImage(image);
    setFormData({ title: image.title, image_url: image.image_url });
    setIsModalOpen(true);
  };

  const filteredImages = images.filter(img => 
    img.title?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="space-y-8">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h1 className="text-3xl font-black uppercase tracking-tight">Gallery Management</h1>
          <p className="text-stone-500 text-sm uppercase tracking-widest font-bold">Manage your portfolio and showcase images</p>
        </div>
        <button 
          onClick={() => {
            setEditingImage(null);
            setFormData({ title: '', image_url: '' });
            setIsModalOpen(true);
          }}
          className="btn-primary px-6 py-3 flex items-center space-x-2"
        >
          <Plus className="w-5 h-5" />
          <span>Add New Image</span>
        </button>
      </div>

      <div className="glass-card p-6">
        <div className="relative mb-8">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-stone-500" />
          <input 
            type="text"
            placeholder="Search by title..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-white/5 border border-white/10 rounded-2xl pl-12 pr-6 py-4 outline-none focus:border-primary transition-all"
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-10 h-10 text-primary animate-spin mb-4" />
            <p className="text-stone-500 uppercase tracking-widest font-bold text-xs">Loading Gallery...</p>
          </div>
        ) : filteredImages.length === 0 ? (
          <div className="text-center py-20 border-2 border-dashed border-white/5 rounded-3xl">
            <ImageIcon className="w-16 h-16 text-stone-700 mx-auto mb-4" />
            <p className="text-stone-500 font-bold uppercase tracking-widest">No images found</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredImages.map((image) => (
              <motion.div 
                key={image.id}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                className="group relative glass-card overflow-hidden"
              >
                <div className="aspect-square overflow-hidden">
                  <img 
                    src={image.image_url} 
                    alt={image.title} 
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </div>
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                  <button 
                    onClick={() => openEditModal(image)}
                    className="p-3 bg-white text-black rounded-full hover:bg-primary transition-colors"
                  >
                    <Edit2 className="w-5 h-5" />
                  </button>
                  <button 
                    onClick={() => handleDelete(image.id)}
                    className="p-3 bg-red-500 text-white rounded-full hover:bg-red-600 transition-colors"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
                {image.title && (
                  <div className="p-4 bg-black/80 backdrop-blur-sm absolute bottom-0 left-0 right-0">
                    <p className="text-xs font-bold uppercase tracking-widest truncate">{image.title}</p>
                  </div>
                )}
              </motion.div>
            ))}
          </div>
        )}
      </div>

      {/* Add/Edit Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsModalOpen(false)}
              className="absolute inset-0 bg-black/90 backdrop-blur-sm"
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative w-full max-w-lg glass-card p-8 md:p-10"
            >
              <button 
                onClick={() => setIsModalOpen(false)}
                className="absolute right-6 top-6 text-stone-500 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>

              <h2 className="text-2xl font-black uppercase tracking-tight mb-8">
                {editingImage ? 'Edit Image' : 'Add New Image'}
              </h2>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Image Title (Optional)</label>
                  <input 
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 outline-none focus:border-primary transition-all"
                    placeholder="e.g. Modern Living Room Setup"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-stone-500 ml-1">Image Upload</label>
                  <div className="flex flex-col items-center justify-center border-2 border-dashed border-white/10 rounded-3xl p-8 bg-white/5 hover:bg-white/10 transition-all group relative overflow-hidden">
                    {formData.image_url ? (
                      <div className="relative w-full aspect-video rounded-xl overflow-hidden">
                        <img src={formData.image_url} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                          type="button"
                          onClick={() => setFormData({ ...formData, image_url: '' })}
                          className="absolute top-2 right-2 p-2 bg-red-500 text-white rounded-full"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </div>
                    ) : (
                      <>
                        <Upload className={`w-12 h-12 mb-4 ${uploading ? 'text-primary animate-bounce' : 'text-stone-700 group-hover:text-primary transition-colors'}`} />
                        <p className="text-xs font-bold uppercase tracking-widest text-stone-500">
                          {uploading ? 'Uploading...' : 'Click to upload image'}
                        </p>
                        <input 
                          type="file"
                          accept="image/*"
                          onChange={handleFileUpload}
                          className="absolute inset-0 opacity-0 cursor-pointer"
                          disabled={uploading}
                        />
                      </>
                    )}
                  </div>
                </div>

                <button 
                  type="submit"
                  disabled={!formData.image_url || uploading}
                  className="w-full btn-primary py-5 rounded-2xl font-black uppercase tracking-widest flex items-center justify-center space-x-3 disabled:opacity-50"
                >
                  <span>{editingImage ? 'Update Image' : 'Add to Gallery'}</span>
                </button>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default AdminGallery;
