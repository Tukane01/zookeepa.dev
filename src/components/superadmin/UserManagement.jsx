import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { User, Plus, Trash2, UserX, UserCheck, X, Mail } from "lucide-react";
import { usersAPI } from "@/api/apiService";

const ROLE_LABELS = { user: "Customer", admin: "Admin", super_admin: "Super Admin", store_manager: "Store Manager", suspended: "Suspended" };
const ROLE_COLORS = { user: "bg-gray-100 text-gray-700", admin: "bg-blue-100 text-blue-800", super_admin: "bg-purple-100 text-purple-800", store_manager: "bg-orange-100 text-orange-800", suspended: "bg-red-100 text-red-700" };

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [inviteDialog, setInviteDialog] = useState(false);
  const [inviteForm, setInviteForm] = useState({ email: "", full_name: "", password: "", role: "user" });
  const [inviting, setInviting] = useState(false);
  const [inviteSuccess, setInviteSuccess] = useState("");

  useEffect(() => { load(); }, []);

  const load = async () => {
    setLoading(true);
    try {
      const data = await usersAPI.getAllUsers();
      setUsers(Array.isArray(data) ? data : []);
    } catch (error) {
      console.error('Failed to load users:', error);
      setUsers([]);
    } finally {
      setLoading(false);
    }
  };

  const updateRole = async (id, role) => {
    try {
      await usersAPI.updateUser(id, { role });
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role } : u)));
    } catch (error) {
      console.error('Failed to update role', error);
    }
  };

  const suspend = async (user) => {
    if (!confirm(`Suspend ${user.full_name || user.email}? They will lose access.`)) return;
    try {
      await usersAPI.updateUser(user.id, { is_active: false, role: 'suspended' });
      load();
    } catch (error) {
      console.error('Failed to suspend user', error);
    }
  };

  const reinstate = async (user) => {
    try {
      await usersAPI.updateUser(user.id, { is_active: true, role: 'user' });
      load();
    } catch (error) {
      console.error('Failed to reinstate user', error);
    }
  };

  const removeUser = async (user) => {
    if (!confirm(`Remove user ${user.full_name || user.email}? This action cannot be undone.`)) return;
    try {
      await usersAPI.deleteUser(user.id);
      setUsers((prev) => prev.filter((u) => u.id !== user.id));
    } catch (error) {
      console.error('Failed to remove user', error);
    }
  };

  const handleInvite = async () => {
    if (!inviteForm.email || !inviteForm.full_name || !inviteForm.password) {
      alert('Please provide email, full name, and password.');
      return;
    }
    setInviting(true);
    try {
      await usersAPI.createUser({
        email: inviteForm.email,
        password: inviteForm.password,
        full_name: inviteForm.full_name,
        role: inviteForm.role,
      });
      setInviteSuccess(`User invited: ${inviteForm.email}`);
      load();
      setTimeout(() => { setInviteSuccess(''); setInviteDialog(false); }, 2000);
    } catch (error) {
      console.error('Invite failed', error);
      setInviteSuccess('Invite failed.');
    } finally {
      setInviting(false);
    }
  };

  if (loading) return <div className="flex items-center justify-center py-20"><div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" /></div>;

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h2 className="font-semibold text-lg">Users & Access ({users.length})</h2>
        <Button onClick={() => { setInviteForm({ email: "", full_name: "", password: "", role: "user" }); setInviteDialog(true); }} className="bg-black text-white rounded-none">
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
                <td className="px-4 py-3 text-gray-400 text-xs">{u.created_at ? new Date(u.created_at).toLocaleDateString("en-ZA") : "—"}</td>
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
                    <Button variant="ghost" size="icon" className="w-8 h-8 hover:text-red-600" title="Delete" onClick={() => removeUser(u)}>
                      <Trash2 className="w-3.5 h-3.5" />
                    </Button>
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
                <div>
                  <Label className="text-xs uppercase tracking-wider">Full Name *</Label>
                  <Input type="text" value={inviteForm.full_name} onChange={e => setInviteForm({ ...inviteForm, full_name: e.target.value })} className="rounded-none mt-1" placeholder="Jane Doe" />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider">Email Address *</Label>
                  <Input type="email" value={inviteForm.email} onChange={e => setInviteForm({ ...inviteForm, email: e.target.value })} className="rounded-none mt-1" placeholder="newuser@email.com" />
                </div>
                <div>
                  <Label className="text-xs uppercase tracking-wider">Password *</Label>
                  <Input type="password" value={inviteForm.password} onChange={e => setInviteForm({ ...inviteForm, password: e.target.value })} className="rounded-none mt-1" placeholder="Strong password" />
                </div>
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
                <Button variant="outline" className="rounded-none" onClick={() => setInviteDialog(false)}><X className="w-4 h-4 mr-2" /> Cancel</Button>
                <Button className="bg-black text-white rounded-none" onClick={handleInvite} disabled={inviting || !inviteForm.email}>
                  {inviting ? "Sending…" : <><Mail className="w-4 h-4 mr-2" /> Send Invite</>}
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}