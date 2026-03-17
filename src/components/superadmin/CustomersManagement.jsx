import React, { useState, useEffect } from "react";
import { base44 } from "@/api/base44Client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { User, Mail, UserX, UserCheck, Trash2, Search, Send, Users, MessageSquare } from "lucide-react";

export default function CustomersManagement() {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [emailDialog, setEmailDialog] = useState(false);
  const [bulkEmailDialog, setBulkEmailDialog] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [emailForm, setEmailForm] = useState({ subject: "", body: "" });
  const [sending, setSending] = useState(false);
  const [sentMsg, setSentMsg] = useState("");

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    const all = await base44.entities.User.list("-created_date");
    setCustomers(all.filter(u => u.role === "user" || u.role === "suspended" || !u.role));
    setLoading(false);
  };

  const suspend = async (u) => {
    if (!confirm(`Suspend ${u.full_name || u.email}? They will lose all access.`)) return;
    await base44.entities.User.update(u.id, { role: "suspended" });
    setCustomers(c => c.map(x => x.id === u.id ? { ...x, role: "suspended" } : x));
  };

  const reinstate = async (u) => {
    await base44.entities.User.update(u.id, { role: "user" });
    setCustomers(c => c.map(x => x.id === u.id ? { ...x, role: "user" } : x));
  };

  const deleteCustomer = async (u) => {
    if (!confirm(`Permanently delete ${u.full_name || u.email}? This cannot be undone.`)) return;
    await base44.entities.User.delete(u.id);
    setCustomers(c => c.filter(x => x.id !== u.id));
  };

  const openEmail = (customer) => {
    setSelectedCustomer(customer);
    setEmailForm({ subject: "", body: "" });
    setSentMsg("");
    setEmailDialog(true);
  };

  const openBulkEmail = () => {
    setEmailForm({ subject: "", body: "" });
    setSentMsg("");
    setBulkEmailDialog(true);
  };

  const sendEmail = async () => {
    setSending(true);
    await base44.integrations.Core.SendEmail({
      to: selectedCustomer.email,
      subject: emailForm.subject,
      body: emailForm.body,
      from_name: "ZooKeepa"
    });
    setSentMsg(`Email sent to ${selectedCustomer.email}`);
    setSending(false);
    setTimeout(() => { setSentMsg(""); setEmailDialog(false); }, 2000);
  };

  const sendBulkEmail = async () => {
    setSending(true);
    const activeCustomers = customers.filter(u => u.role !== "suspended" && u.email);
    for (const customer of activeCustomers) {
      await base44.integrations.Core.SendEmail({
        to: customer.email,
        subject: emailForm.subject,
        body: emailForm.body,
        from_name: "ZooKeepa"
      });
    }
    setSentMsg(`Promotion sent to ${activeCustomers.length} customers!`);
    setSending(false);
    setTimeout(() => { setSentMsg(""); setBulkEmailDialog(false); }, 3000);
  };

  const filtered = customers.filter(u =>
    !search ||
    u.full_name?.toLowerCase().includes(search.toLowerCase()) ||
    u.email?.toLowerCase().includes(search.toLowerCase())
  );

  const activeCount = customers.filter(u => u.role !== "suspended").length;
  const suspendedCount = customers.filter(u => u.role === "suspended").length;

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      {/* Stats */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="bg-black text-white p-4">
          <p className="text-2xl font-bold">{customers.length}</p>
          <p className="text-xs tracking-wider uppercase mt-1 opacity-80">Total Customers</p>
        </div>
        <div className="bg-green-50 text-green-800 border border-green-200 p-4">
          <p className="text-2xl font-bold">{activeCount}</p>
          <p className="text-xs tracking-wider uppercase mt-1 opacity-80">Active</p>
        </div>
        <div className="bg-red-50 text-red-800 border border-red-200 p-4">
          <p className="text-2xl font-bold">{suspendedCount}</p>
          <p className="text-xs tracking-wider uppercase mt-1 opacity-80">Suspended</p>
        </div>
      </div>

      {/* Toolbar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-5">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
          <Input value={search} onChange={e => setSearch(e.target.value)} placeholder="Search by name or email…" className="pl-10 rounded-none" />
        </div>
        <Button onClick={openBulkEmail} className="bg-yellow-500 hover:bg-yellow-400 text-black rounded-none font-semibold">
          <Send className="w-4 h-4 mr-2" /> Email All Customers ({activeCount})
        </Button>
      </div>

      {/* Table */}
      <div className="border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>{["Name", "Email", "Status", "Joined", "Actions"].map(h => (
              <th key={h} className="text-left px-4 py-3 text-xs tracking-wider uppercase text-gray-500 font-semibold">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {filtered.map(u => (
              <tr key={u.id} className="hover:bg-gray-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center flex-shrink-0">
                      <User className="w-4 h-4 text-gray-500" />
                    </div>
                    <span className="font-medium">{u.full_name || "—"}</span>
                  </div>
                </td>
                <td className="px-4 py-3 text-gray-500 text-xs">{u.email}</td>
                <td className="px-4 py-3">
                  {u.role === "suspended"
                    ? <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded-full font-medium">Suspended</span>
                    : <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">Active</span>
                  }
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">
                  {u.created_date ? new Date(u.created_date).toLocaleDateString("en-ZA") : "—"}
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1 items-center">
                    <Button variant="ghost" size="icon" className="w-8 h-8 hover:text-yellow-600" title="Send Email" onClick={() => openEmail(u)}>
                      <Mail className="w-3.5 h-3.5" />
                    </Button>
                    {u.role === "suspended" ? (
                      <Button variant="ghost" size="icon" className="w-8 h-8 hover:text-green-600" title="Reinstate" onClick={() => reinstate(u)}>
                        <UserCheck className="w-3.5 h-3.5" />
                      </Button>
                    ) : (
                      <Button variant="ghost" size="icon" className="w-8 h-8 hover:text-orange-500" title="Suspend" onClick={() => suspend(u)}>
                        <UserX className="w-3.5 h-3.5" />
                      </Button>
                    )}
                    <Button variant="ghost" size="icon" className="w-8 h-8 hover:text-red-500" title="Delete Account" onClick={() => deleteCustomer(u)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr><td colSpan={5} className="text-center py-12 text-gray-400">
                <Users className="w-10 h-10 mx-auto mb-2 opacity-30" />
                No customers found yet. They will appear here once they register.
              </td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Single customer email dialog */}
      <Dialog open={emailDialog} onOpenChange={setEmailDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Mail className="w-5 h-5" /> Email Customer
            </DialogTitle>
            {selectedCustomer && <p className="text-sm text-gray-500 mt-1">{selectedCustomer.full_name} — {selectedCustomer.email}</p>}
          </DialogHeader>
          {sentMsg ? (
            <div className="py-8 text-center">
              <p className="text-green-600 font-semibold text-lg">✓ {sentMsg}</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 py-2">
                <div>
                  <Label className="text-xs uppercase tracking-wider">Subject *</Label>
                  <Input value={emailForm.subject} onChange={e => setEmailForm({ ...emailForm, subject: e.target.value })} className="rounded-none mt-1" placeholder="e.g. Exclusive offer just for you!" />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider">Message *</Label>
                  <Textarea value={emailForm.body} onChange={e => setEmailForm({ ...emailForm, body: e.target.value })} className="rounded-none mt-1" rows={6} placeholder="Write your message here..." />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" className="rounded-none" onClick={() => setEmailDialog(false)}>Cancel</Button>
                <Button className="bg-black text-white rounded-none" onClick={sendEmail} disabled={sending || !emailForm.subject || !emailForm.body}>
                  {sending ? "Sending…" : <><Send className="w-4 h-4 mr-2" /> Send Email</>}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Bulk email dialog */}
      <Dialog open={bulkEmailDialog} onOpenChange={setBulkEmailDialog}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="w-5 h-5" /> Send Promotion to All Customers
            </DialogTitle>
            <p className="text-sm text-gray-500 mt-1">This will be sent to {activeCount} active customer{activeCount !== 1 ? "s" : ""}.</p>
          </DialogHeader>
          {sentMsg ? (
            <div className="py-8 text-center">
              <p className="text-green-600 font-semibold text-lg">✓ {sentMsg}</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 py-2">
                <div>
                  <Label className="text-xs uppercase tracking-wider">Subject *</Label>
                  <Input value={emailForm.subject} onChange={e => setEmailForm({ ...emailForm, subject: e.target.value })} className="rounded-none mt-1" placeholder="e.g. 🔥 ZooKeepa Summer Sale — 30% Off!" />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider">Message *</Label>
                  <Textarea value={emailForm.body} onChange={e => setEmailForm({ ...emailForm, body: e.target.value })} className="rounded-none mt-1" rows={8} placeholder="Dear customer,&#10;&#10;We have an exciting promotion for you..." />
                </div>
                <div className="bg-yellow-50 border border-yellow-200 p-3 text-xs text-yellow-800 rounded">
                  <strong>Note:</strong> This will send an individual email to each active customer ({activeCount} emails total).
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" className="rounded-none" onClick={() => setBulkEmailDialog(false)}>Cancel</Button>
                <Button className="bg-yellow-500 hover:bg-yellow-400 text-black font-semibold rounded-none" onClick={sendBulkEmail} disabled={sending || !emailForm.subject || !emailForm.body}>
                  {sending ? `Sending to ${activeCount} customers…` : <><Send className="w-4 h-4 mr-2" /> Send to All ({activeCount})</>}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}