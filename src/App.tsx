import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import { AuthProvider, useAuth } from './AuthContext';
import AdminPortal from './AdminPortal';
import UserPortal from './UserPortal';

function Navigation() {
  const { user, role, logout } = useAuth();

  if (!user) return null;

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 p-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <span className="font-bold text-lg text-indigo-600">TaskFlow</span>
        {role === 'admin' && (
          <Link to="/admin" className="text-slate-600 hover:text-indigo-600 font-medium">Admin Portal</Link>
        )}
        <Link to="/user" className="text-slate-600 hover:text-indigo-600 font-medium">User Portal</Link>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-500">{user.email} ({role})</span>
        <button 
          onClick={logout}
          className="text-sm text-red-600 hover:text-red-800 font-medium"
        >
          Logout
        </button>
      </div>
    </nav>
  );
}

function ProtectedRoute({ children, allowedRole }: { children: React.ReactNode, allowedRole?: 'admin' | 'user' }) {
  const { user, role, loading } = useAuth();

  if (loading) return <div className="p-8 text-center text-slate-500">Loading...</div>;
  if (!user) return <Navigate to="/login" replace />;
  if (allowedRole && role !== allowedRole) return <Navigate to={role === 'admin' ? '/admin' : '/user'} replace />;

  return <>{children}</>;
}

function Login() {
  const { user, role, login, loading } = useAuth();
  const [error, setError] = useState<string | null>(null);

  if (loading) return <div className="p-8 text-center text-slate-500">Loading...</div>;
  
  if (user && role) {
    return <Navigate to={role === 'admin' ? '/admin' : '/user'} replace />;
  }

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
          <button 
            onClick={() => handleLogin('admin')}
            className="w-full bg-indigo-600 text-white py-3 rounded-xl font-semibold hover:bg-indigo-700 transition-colors"
          >
            Sign in as Admin
          </button>
          <button 
            onClick={() => handleLogin('user')}
            className="w-full bg-slate-200 text-slate-800 py-3 rounded-xl font-semibold hover:bg-slate-300 transition-colors"
          >
            Sign in as User
          </button>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
          <Navigation />
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/admin" 
              element={
                <ProtectedRoute allowedRole="admin">
                  <AdminPortal />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/user" 
              element={
                <ProtectedRoute>
                  <UserPortal />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/login" replace />} />
          </Routes>
        </div>
      </Router>
    </AuthProvider>
  );
}
