import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { User, Plus, Trash2, UserX, UserCheck } from "lucide-react";

const ROLE_LABELS = { user: "Customer", admin: "Admin", super_admin: "Super Admin", store_manager: "Store Manager", suspended: "Suspended" };
const ROLE_COLORS = { user: "bg-gray-100 text-gray-700", admin: "bg-blue-100 text-blue-800", super_admin: "bg-purple-100 text-purple-800", store_manager: "bg-orange-100 text-orange-800", suspended: "bg-red-100 text-red-700" };

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteDialog, setInviteDialog] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: "", role: "user" });
  const [inviting, setInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState("");

  useEffect(() => { load(); }, []);
  const load = async () => { setLoading(true); setUsers([]); setLoading(false); };

  const updateRole = async (id, role) => {
    setUsers(users.map(u => u.id === id ? { ...u, role } : u));
  };

  const suspend = async (user) => {
    if (!confirm(`Suspend ${user.full_name || user.email}? They will lose access.`)) return;
    setUsers(users.map(u => u.id === user.id ? { ...u, role: "suspended" } : u));
  };

  const reinstate = async (user) => {
    setUsers(users.map(u => u.id === user.id ? { ...u, role: "user" } : u));
  };

  const handleInvite = async () => {
    setInviting(true);
    setInviteSuccess(`Invite sent to ${inviteForm.email}`);
    setInviting(false);
    setTimeout(() => { setInviteSuccess(""); setInviteDialog(false); }, 2000);
    setTimeout(() => load(), 3000);
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Users & Access ({users.length})</h2>
        <Button onClick={() => { setInviteForm({ email: "", role: "user" }); setInviteDialog(true); }} className="bg-black text-white rounded-none">
          <Plus className="w-4 h-4 mr-2" /> Invite User
        </Button>
      </div>

      <div className="border border-gray-200 overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-gray-50 border-b">
            <tr>{["Name", "Email", "Role", "Joined", "Change Role", "Actions"].map(h => (
              <th key={h} className="text-left px-4 py-3 text-xs tracking-wider uppercase text-gray-500 font-semibold">{h}</th>
            ))}</tr>
          </thead>
          <tbody className="divide-y divide-gray-100">
            {users.map(u => (
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
                  <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${ROLE_COLORS[u.role] || ROLE_COLORS.user}`}>
                    {ROLE_LABELS[u.role] || u.role}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-400 text-xs">{u.created_date ? new Date(u.created_date).toLocaleDateString("en-ZA") : "—"}</td>
                <td className="px-4 py-3">
                  <Select value={u.role || "user"} onValueChange={role => updateRole(u.id, role)}>
                    <SelectTrigger className="w-36 h-7 text-xs rounded-none">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Customer</SelectItem>
                      <SelectItem value="store_manager">Store Manager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="super_admin">Super Admin</SelectItem>
                      <SelectItem value="suspended">Suspended</SelectItem>
                    </SelectContent>
                  </Select>
                </td>
                <td className="px-4 py-3">
                  <div className="flex gap-1">
                    {u.role === "suspended" ? (
                      <Button variant="ghost" size="icon" className="w-8 h-8 hover:text-green-600" title="Reinstate" onClick={() => reinstate(u)}>
                        <UserCheck className="w-3.5 h-3.5" />
                      </Button>
                    ) : (
                      <Button variant="ghost" size="icon" className="w-8 h-8 hover:text-orange-500" title="Suspend" onClick={() => suspend(u)}>
                        <UserX className="w-3.5 h-3.5" />
                      </Button>
                    )}
                  </div>
                </td>
              </tr>
            ))}
            {users.length === 0 && <tr><td colSpan={6} className="text-center py-10 text-gray-400">No users found.</td></tr>}
          </tbody>
        </table>
      </div>

      <Dialog open={inviteDialog} onOpenChange={setInviteDialog}>
        <DialogContent className="max-w-sm">
          <DialogHeader><DialogTitle>Invite New User</DialogTitle></DialogHeader>
          {inviteSuccess ? (
            <div className="py-6 text-center">
              <p className="text-green-600 font-semibold">{inviteSuccess}</p>
            </div>
          ) : (
            <>
              <div className="space-y-4 py-2">
                <div><Label className="text-xs uppercase tracking-wider">Email Address *</Label><Input type="email" value={inviteForm.email} onChange={e => setInviteForm({ ...inviteForm, email: e.target.value })} className="rounded-none mt-1" placeholder="newuser@email.com" /></div>
                <div>
                  <Label className="text-xs uppercase tracking-wider">Role</Label>
                  <Select value={inviteForm.role} onValueChange={v => setInviteForm({ ...inviteForm, role: v })}>
                    <SelectTrigger className="rounded-none mt-1"><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="user">Customer</SelectItem>
                      <SelectItem value="store_manager">Store Manager</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" className="rounded-none" onClick={() => setInviteDialog(false)}>Cancel</Button>
                <Button className="bg-black text-white rounded-none" onClick={handleInvite} disabled={inviting || !inviteForm.email}>{inviting ? "Sending…" : "Send Invite"}</Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}