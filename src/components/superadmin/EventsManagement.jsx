import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, Calendar, MapPin } from "lucide-react";
import ImageUpload from "@/components/ui/ImageUpload";

export default function EventsManagement() {
  const [items, setItems] = useState([]);
  const [dialog, setDialog] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", description: "", date: "", location: "", image_id: null });
  const [saving, setSaving] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const response = await fetch('/api/events', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load events:', error);
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  const openNew = () => {
    setEditing(null);
    setForm({ title: "", description: "", date: "", location: "", image_id: null });
    setDialog(true);
  };

  const openEdit = (item) => {
    setEditing(item);
    setForm({
      title: item.title,
      description: item.description || "",
      date: item.date ? item.date.split('T')[0] : "",
      location: item.location || "",
      image_id: item.image_id
    });
    setDialog(true);
  };

  const save = async () => {
    if (!form.title) {
      alert('Title is required');
      return;
    }

    setSaving(true);
    try {
      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `/api/events/${editing.id}` : '/api/events';

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
      alert(`Failed to save event: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const del = async (id) => {
    if (!confirm("Delete this event?")) return;

    try {
      const response = await fetch(`/api/events/${id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });

      if (!response.ok) throw new Error('Delete failed');

      await load(); // Reload the list
    } catch (error) {
      console.error('Delete error:', error);
      alert('Failed to delete event');
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
        <h2 className="font-semibold text-lg">Events ({items.length})</h2>
        <Button onClick={openNew} className="bg-black text-white rounded-none">
          <Plus className="w-4 h-4 mr-2" /> Add Event
        </Button>
      </div>

      <div className="space-y-3">
        {items.map(item => (
          <div key={item.id} className="border border-gray-200 p-4 flex items-start gap-4">
            {item.image_id && <img src={`/api/images/${item.image_id}`} alt={item.title} className="w-20 h-16 object-cover flex-shrink-0" />}
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold">{item.title}</h3>
              <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                {item.date && <span className="flex items-center gap-1"><Calendar className="w-3 h-3" />{new Date(item.date).toLocaleDateString("en-ZA")}</span>}
                {item.location && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{item.location}</span>}
              </div>
              {item.description && <p className="text-sm text-gray-500 mt-1 line-clamp-1">{item.description}</p>}
            </div>
            <div className="flex gap-1 flex-shrink-0">
              <Button variant="ghost" size="icon" className="w-7 h-7" onClick={() => openEdit(item)}>
                <Pencil className="w-3 h-3" />
              </Button>
              <Button variant="ghost" size="icon" className="w-7 h-7 hover:text-red-500" onClick={() => del(item.id)}>
                <Trash2 className="w-3 h-3" />
              </Button>
            </div>
          </div>
        ))}
        {items.length === 0 && <p className="text-center py-10 text-gray-400">No events yet.</p>}
      </div>

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Event" : "Add Event"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update event details and image." : "Create a new event with date, location, and image."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div><Label className="text-xs uppercase tracking-wider">Title *</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="rounded-none mt-1" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs uppercase tracking-wider">Date</Label><Input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="rounded-none mt-1" /></div>
              <div><Label className="text-xs uppercase tracking-wider">Location</Label><Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="rounded-none mt-1" placeholder="Venue, City" /></div>
            </div>
            <div><Label className="text-xs uppercase tracking-wider">Description</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="rounded-none mt-1" rows={3} /></div>
            <div>
              <Label className="text-xs uppercase tracking-wider">Event Image</Label>
              <div className="mt-1">
                <ImageUpload
                  onImageUploaded={handleImageUploaded}
                  currentImageId={form.image_id}
                  className="w-full"
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-none" onClick={() => setDialog(false)}>Cancel</Button>
            <Button className="bg-black text-white rounded-none" onClick={save} disabled={saving || !form.title}>{saving ? "Saving…" : editing ? "Update" : "Add Event"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}