import '@/styles/globals.css';
import type { AppProps } from 'next/app';
import { AuthProvider, useAuth } from '../AuthContext';
import Link from 'next/link';
import { useRouter } from 'next/router';

function Navigation() {
  const { user, role, logout } = useAuth();
  const router = useRouter();

  if (!user) return null;

  const handleLogout = async () => {
    await logout();
    router.push('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b border-slate-200 p-4 flex justify-between items-center">
      <div className="flex items-center gap-4">
        <span className="font-bold text-lg text-indigo-600">TaskFlow</span>
        {role === 'admin' && (
          <Link href="/admin" className="text-slate-600 hover:text-indigo-600 font-medium">Admin Portal</Link>
        )}
        <Link href="/user" className="text-slate-600 hover:text-indigo-600 font-medium">User Portal</Link>
      </div>
      <div className="flex items-center gap-4">
        <span className="text-sm text-slate-500">{user.email} ({role})</span>
        <button onClick={handleLogout} className="text-sm text-red-600 hover:text-red-800 font-medium">Logout</button>
      </div>
    </nav>
  );
}

export default function App({ Component, pageProps }: AppProps) {
  return (
    <AuthProvider>
      <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
        <Navigation />
        <Component {...pageProps} />
      </div>
    </AuthProvider>
  );
}
