import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, ToggleLeft, ToggleRight } from "lucide-react";

const JOB_TYPES = ["Full-time", "Part-time", "Contract", "Internship"];

export default function CareersManagement() {
  const [items, setItems] = useState([]);
  const [dialog, setDialog] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", department: "", type: "Full-time", location: "", description: "", is_open: true });
  const [saving, setSaving] = useState(false);

  useEffect(() => { load(); }, []);
  const load = async () => setItems([]);

  const openNew = () => { setEditing(null); setForm({ title: "", department: "", type: "Full-time", location: "", description: "", is_open: true }); setDialog(true); };
  const openEdit = (item) => { setEditing(item); setForm({ title: item.title, department: item.department, type: item.type || "Full-time", location: item.location || "", description: item.description || "", is_open: item.is_open !== false }); setDialog(true); };

  const save = async () => {
    setSaving(true);
    if (editing) { setItems(items.map(i => i.id === editing.id ? { ...i, ...form } : i)); }
    else { const c = { id: Date.now().toString(), ...form }; setItems([c, ...items]); }
    setSaving(false); setDialog(false);
  };

  const toggle = async (item) => {
    setItems(items.map(i => i.id === item.id ? { ...i, is_open: !i.is_open } : i));
  };

  const del = async (id) => { if (!confirm("Delete this career posting?")) return; setItems(items.filter(i => i.id !== id)); };

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
          <DialogHeader><DialogTitle>{editing ? "Edit Position" : "Add Career Position"}</DialogTitle></DialogHeader>
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
            <Button variant="outline" className="rounded-none" onClick={() => setDialog(false)}>Cancel</Button>
            <Button className="bg-black text-white rounded-none" onClick={save} disabled={saving || !form.title || !form.department}>{saving ? "Saving…" : editing ? "Update" : "Add Position"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}