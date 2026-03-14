import { useState, useEffect } from 'react';
import { useAuth } from '../AuthContext';
import { useRouter } from 'next/router';

export default function Login() {
  const { user, role, login, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (user && role) {
      router.push(role === 'admin' ? '/admin' : '/user');
    }
  }, [user, role, router]);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading...</div>;
  if (user) return null;

  const handleLogin = async (selectedRole: 'admin' | 'user') => {
    setError(null);
    try {
      await login(selectedRole);
    } catch (err: any) {
      setError(err.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50">
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full text-center">
        <h1 className="text-3xl font-bold text-slate-800 mb-2">Welcome to TaskFlow</h1>
        <p className="text-slate-500 mb-8">Choose your role to sign in</p>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="space-y-4">
          <button onClick={() => handleLogin('admin')} className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors">
            Sign in as Admin
          </button>
          <button onClick={() => handleLogin('user')} className="w-full bg-slate-200 text-slate-800 py-3 rounded-xl font-semibold hover:bg-slate-300 transition-colors">
            Sign in as User
          </button>
        </div>
      </div>
    </div>
  );
}
