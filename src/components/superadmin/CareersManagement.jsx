import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight, X, Save } from "lucide-react";

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];

export default function CareersManagement() {
  const [items, setItems] = useState([]);
  const [dialog, setDialog] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", department: "", type: "Full-time", location: "", description: "", is_open: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    try {
      const response = await fetch('/api/careers', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      const data = await response.json();
      setItems(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load careers:', error);
      setItems([]);
    }
  };

  const openNew = () => { setEditing(null); setForm({ title: "", department: "", type: "Full-time", location: "", description: "", is_open: true }); setDialog(true); };
  const openEdit = (item) => { setEditing(item); setForm({ title: item.title, department: item.department, type: item.type || "Full-time", location: item.location || "", description: item.description || "", is_open: item.is_open !== false }); setDialog(true); };

  const save = async () => {
    setSaving(true);
    try {
      const method = editing ? 'PUT' : 'POST';
      const url = editing ? `/api/careers/${editing.id}` : '/api/careers';

      const payload = {
        title: form.title,
        department: form.department,
        type: form.type || "Full-time",
        location: form.location || "",
        description: form.description || "",
        is_open: form.is_open // Send as boolean
      };

      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(payload)
      });
      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || errData?.message || `Save failed with status ${response.status}`);
      }
      await load();
      setDialog(false);
    } catch (error) {
      console.error('Save error:', error);
      alert(`Failed to save position: ${error.message}`);
    } finally {
      setSaving(false);
    }
  };

  const toggle = async (item) => {
    try {
      const response = await fetch(`/api/careers/${item.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({ ...item, is_open: !item.is_open }) // Send as boolean
      });
      if (!response.ok) throw new Error('Toggle failed');
      await load();
    } catch (error) {
      console.error('Toggle error:', error);
    }
  };

  const del = async (id) => {
    if (!confirm("Delete this career posting?")) return;
    try {
      await fetch(`/api/careers/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      });
      await load();
    } catch (error) {
      console.error('Delete error:', error);
    }
  };

  const TYPE_COLORS = { "Full-time": "bg-green-100 text-green-800", "Part-time": "bg-blue-100 text-blue-800", "Contract": "bg-purple-100 text-purple-800", "Internship": "bg-yellow-100 text-yellow-800" };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Careers ({items.length} positions)</h2>
        <Button onClick={openNew} className="bg-black text-white rounded-none"><Plus className="w-4 h-4 mr-2" /> Add Position</Button>
      </div>

      <div className="border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>{["Title", "Department", "Type", "Location", "Open", "Actions"].map(h => (
              <th key={h} className="text-left px-4 py-3 text-xs tracking-wider uppercase text-gray-500 font-semibold">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {items.map(item => (
              <tr key={item.id} className="hover:bg-gray-50">
                <td className="px-4 py-3 font-medium">{item.title}</td>
                <td className="px-4 py-3 text-gray-500">{item.department}</td>
                <td className="px-4 py-3"><span className={`text-xs px-2 py-0.5 rounded-full font-medium ${TYPE_COLORS[item.type] || "bg-gray-100"}`}>{item.type}</span></td>
                <td className="px-4 py-3 text-gray-500 text-xs">{item.location}</td>
                <td className="px-4 py-3">
                  <button onClick={() => toggle(item)}>{item.is_open !== false ? <ToggleRight className="w-6 h-6 text-green-500" /> : <ToggleLeft className="w-6 h-6 text-gray-400" />}</button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    <Button variant="ghost" size="icon" className="w-8 h-8" onClick={() => openEdit(item)}><Pencil className="w-3.5 h-3.5" /></Button>
                    <Button variant="ghost" size="icon" className="w-8 h-8 hover:text-red-500" onClick={() => del(item.id)}><Trash2 className="w-3.5 h-3.5" /></Button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={6} className="text-center py-10 text-gray-400">No career postings yet.</td></tr>}
          </tbody>
        </table>
      </div>

      <Dialog open={dialog} onOpenChange={setDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit Position" : "Add Career Position"}</DialogTitle>
            <DialogDescription>
              {editing ? "Update the details for this career position." : "Fill in the details to add a new open position."}
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3 py-2">
            <div><Label className="text-xs uppercase tracking-wider">Job Title *</Label><Input value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="rounded-none mt-1" /></div>
            <div className="grid grid-cols-2 gap-3">
              <div><Label className="text-xs uppercase tracking-wider">Department *</Label><Input value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} className="rounded-none mt-1" placeholder="e.g. Design" /></div>
              <div>
                <Label className="text-xs uppercase tracking-wider">Type</Label>
                <Select value={form.type} onValueChange={v => setForm({ ...form, type: v })}>
                  <SelectTrigger className="rounded-none mt-1"><SelectValue /></SelectTrigger>
                  <SelectContent>{JOB_TYPES.map(t => <SelectItem key={t} value={t}>{t}</SelectItem>)}</SelectContent>
                </Select>
              </div>
            </div>
            <div><Label className="text-xs uppercase tracking-wider">Location</Label><Input value={form.location} onChange={e => setForm({ ...form, location: e.target.value })} className="rounded-none mt-1" placeholder="Johannesburg / Remote" /></div>
            <div><Label className="text-xs uppercase tracking-wider">Description</Label><Textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="rounded-none mt-1" rows={3} /></div>
            <div className="flex items-center gap-3"><Switch checked={form.is_open} onCheckedChange={v => setForm({ ...form, is_open: v })} /><Label className="text-sm">Position is Open</Label></div>
          </div>
          <DialogFooter>
            <Button variant="outline" className="rounded-none" onClick={() => setDialog(false)}><X className="w-4 h-4 mr-2" /> Cancel</Button>
            <Button className="bg-black text-white rounded-none" onClick={save} disabled={saving || !form.title || !form.department}>
              {saving ? "Saving…" : <><Save className="w-4 h-4 mr-2" /> {editing ? "Update" : "Add Position"}</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}