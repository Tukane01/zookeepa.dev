import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { authAPI } from '@/api/apiService';
import { useAuth } from '@/lib/AuthContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export default function Register() {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  if (isAuthenticated) {
    navigate('/');
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const { token, user } = await authAPI.register(email.trim(), password, fullName.trim());
      login(token, user);
      navigate('/');
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
      <div className="w-full max-w-md bg-white p-8 rounded shadow">
        <h1 className="text-2xl font-bold mb-6">Create your account</h1>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Full name</label>
            <Input value={fullName} onChange={(e) => setFullName(e.target.value)} type="text" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Email</label>
            <Input value={email} onChange={(e) => setEmail(e.target.value)} type="email" required />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Password</label>
            <Input value={password} onChange={(e) => setPassword(e.target.value)} type="password" required />
          </div>
          {error && <p className="text-sm text-red-600">{error}</p>}
          <Button type="submit" className="w-full" disabled={loading}>
            {loading ? 'Creating account…' : 'Create account'}
          </Button>
        </form>
        <p className="mt-6 text-sm text-gray-600">
          Already have an account?{' '}
          <button type="button" className="text-blue-600 hover:underline" onClick={() => navigate('/login')}>
            Sign in
          </button>
        </p>
      </div>
    </div>
  );
}
