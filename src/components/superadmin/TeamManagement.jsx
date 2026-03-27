import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, User, X, Save } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";

export default function TeamManagement() {
  const [items, setItems] = useState([]);
  const [dialog, setDialog] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", role: "", bio: "", image_id: null, sort_order: 0 });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const response = await fetch('/api/team', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load team:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const openNew = () => {
    setEditing(null);
    setForm({ name: "", role: "", bio: "", image_id: null, sort_order: items.length });
    setDialog(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      name: item.name,
      role: item.role,
      bio: item.bio || "",
      image_id: item.image_id,
      sort_order: item.sort_order || 0
    });
    setDialog(true);
  };

  const save = async () => {
    if (!form.name || !form.role) {
      alert('Name and role are required');
      return;
    }

    setSaving(true);
    try {
      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `/api/team/${editing.id}` : '/api/team';

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
      alert(`Failed to save team member: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!confirm("Remove this team member?")) return;

    try {
      const response = await fetch(`/api/team/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Delete failed');

      await load(); // Reload the list
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete team member');
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
        <h2 className="font-semibold text-lg">Development Team ({items.length} members)</h2>
        <Button onClick={openNew} className="bg-black text-white rounded-none"> {/* Increased icon size */}
          <Plus className="w-4 h-4 mr-2" /> Add Member
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {items.map(item => (
          <div key={item.id} className="border border-gray-200 p-4 flex gap-3 items-start">
            <div className="w-14 h-14 rounded-full overflow-hidden bg-gray-100 flex-shrink-0">
              {item.image_id ? (
                <img src={`/api/images/${item.image_id}`} alt={item.name} className="w-full h-full object-cover" />
              ) : (
                <User className="w-6 h-6 text-gray-300 m-4" />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-sm">{item.name}</h3>
              <p className="text-xs text-yellow-600 mt-0.5">{item.role}</p>
              {item.bio && <p className="text-xs text-gray-500 mt-1 line-clamp-2">{item.bio}</p>}
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => openEdit(item)}> {/* Increased icon size */}
                <Pencil className="w-4 h-4" />
              </Button>
              <Button variant="ghost" size="icon" className="w-7 h-7 hover:text-red-500" onClick={() => del(item.id)}><Trash2 className="w-4 h-4" /></Button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="col-span-3 text-center py-10 text-gray-400">No team members yet.</p>}
      </div>

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Member" : "Add Team Member"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update team member information and photo." : "Add a new team member with their details and photo."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs uppercase tracking-wider">Name *</Label><Input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="rounded-none mt-1" /></div>
              <div><Label className="text-xs uppercase tracking-wider">Role/Title *</Label><Input value={form.role} onChange={e => setForm({ ...form, role: e.target.value })} className="rounded-none mt-1" placeholder="e.g. Head of Design" /></div>
            </div>
            <div><Label className="text-xs uppercase tracking-wider">Bio</Label><Textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} className="rounded-none mt-1" rows={2} /></div>
            <div>
              <Label className="text-xs uppercase tracking-wider">Photo</Label>
              <ImageUpload
                onImageUploaded={handleImageUploaded}
                currentImageId={form.image_id}
                altText={form.name}
              />
            </div>
            <div><Label className="text-xs uppercase tracking-wider">Sort Order</Label><Input type="number" value={form.sort_order} onChange={e => setForm({ ...form, sort_order: parseInt(e.target.value) || 0 })} className="rounded-none mt-1 w-24" /></div>
          </div>
          <DialogFooter> {/* Icon size is fine here */}
            <Button variant="outline" className="rounded-none" onClick={() => setDialog(false)}><X className="w-5 h-5 mr-2" /> Cancel</Button>
            <Button className="bg-black text-white rounded-none" onClick={save} disabled={saving || !form.name || !form.role}>
              {saving ? "Saving…" : <><Save className="w-5 h-5 mr-2" /> {editing ? "Update" : "Add Member"}</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}