import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, X, Save } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";

export default function GalleryManagement() {
  const [items, setItems] = useState([]);
  const [dialog, setDialog] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ image_id: null, caption: "", category: "", sort_order: 0 });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const response = await fetch('/api/gallery', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load gallery:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const openNew = () => {
    setEditing(null);
    setForm({ image_id: null, caption: "", category: "", sort_order: items.length });
    setDialog(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      image_id: item.image_id,
      caption: item.caption || "",
      category: item.category || "",
      sort_order: item.sort_order || 0
    });
    setDialog(true);
  };

  const save = async () => {
    if (!form.image_id) {
      alert('Please upload an image first');
      return;
    }

    setSaving(true);
    try {
      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `/api/gallery/${editing.id}` : '/api/gallery';

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(form)
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || errData?.message || `Save failed with status ${response.status}`);
      }

      await load(); // Reload the list
      setDialog(false);
    } catch (error) {
      console.error('Save error:', error);
      alert(`Failed to save gallery item: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!confirm("Delete this gallery item?")) return;

    try {
      const response = await fetch(`/api/gallery/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Delete failed');

      await load(); // Reload the list
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete gallery item');
    }
  };

  const handleImageUploaded = (imageData) => {
    if (imageData) {
      setForm(prev => ({ ...prev, image_id: imageData.id }));
    } else {
      setForm(prev => ({ ...prev, image_id: null }));
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-yellow-500"></div>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Gallery ({items.length} images)</h2>
        <Button onClick={openNew} className="bg-black text-white rounded-none">
          <Plus className="w-4 h-4 mr-2" /> Add Image
        </Button>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
        {items.map(item => (
          <div key={item.id} className="relative group">
            <div className="aspect-square overflow-hidden bg-gray-100">
              <img
                src={item.image_id ? `/api/images/${item.image_id}` : ''}
                alt={item.caption}
                className="w-full h-full object-cover"
              />
            </div>
            <p className="text-xs text-gray-600 mt-1 truncate">{item.caption || "No caption"}</p>
            <div className="absolute top-1 right-1 hidden group-hover:flex gap-1">
              <button onClick={() => openEdit(item)} className="w-6 h-6 bg-white rounded-full shadow flex items-center justify-center">
                <Pencil className="w-3 h-3" />
              </button>
              <button onClick={() => del(item.id)} className="w-6 h-6 bg-white rounded-full shadow flex items-center justify-center text-red-500">
                <Trash2 className="w-3 h-3" />
              </button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="col-span-6 text-center py-10 text-gray-400">No gallery images yet.</p>}
      </div>

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Image" : "Add Gallery Image"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update gallery image and caption." : "Add a new image to the gallery with optional caption."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4 py-2">
            <div>
              <Label className="text-xs uppercase tracking-wider">Image *</Label>
              <ImageUpload
                onImageUploaded={handleImageUploaded}
                currentImageId={form.image_id}
                altText={form.caption}
                onAltTextChange={(altText) => setForm({ ...form, caption: altText })}
              />
            </div>
            <div>
              <Label className="text-xs uppercase tracking-wider">Caption</Label>
              <Input
                value={form.caption}
                onChange={e => setForm({ ...form, caption: e.target.value })}
                className="rounded-none mt-1"
                placeholder="Photo caption..."
              />
            </div>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label className="text-xs uppercase tracking-wider">Category</Label>
                <Input
                  value={form.category}
                  onChange={e => setForm({ ...form, category: e.target.value })}
                  className="rounded-none mt-1"
                  placeholder="e.g. Events"
                />
              </div>
              <div>
                <Label className="text-xs uppercase tracking-wider">Sort Order</Label>
                <Input
                  type="number"
                  value={form.sort_order}
                  onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })}
                  className="rounded-none mt-1"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-none" onClick={() => setDialog(false)}><X className="w-4 h-4 mr-2" /> Cancel</Button>
            <Button
              className="bg-black text-white rounded-none"
              onClick={save}
              disabled={saving || !form.image_id}
            >
              {saving ? "Saving…" : <><Save className="w-4 h-4 mr-2" /> {editing ? "Update" : "Add Image"}</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}