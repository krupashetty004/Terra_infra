import { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, getDocs, deleteDoc, doc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../AuthContext';
import { useRouter } from 'next/router';

interface Task { id: string; title: string; description: string; assignedTo: string; assignedToEmail: string; status: string; }
interface User { uid: string; email: string; displayName: string; }

export default function AdminPortal() {
  const { user, role, loading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');

  useEffect(() => {
    if (!loading && (!user || role !== 'admin')) router.push('/');
  }, [user, role, loading, router]);

  useEffect(() => {
    if (role !== 'admin') return;
    getDocs(collection(db, 'users')).then(snap => setUsers(snap.docs.map(doc => doc.data() as User)));
    const unsubscribe = onSnapshot(query(collection(db, 'tasks')), (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task)));
    });
    return () => unsubscribe();
  }, [role]);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !description || !assignedTo) return;
    const assignedUser = users.find(u => u.uid === assignedTo);
    await addDoc(collection(db, 'tasks'), {
      title, description, assignedTo, assignedToEmail: assignedUser?.email || '', status: 'Pending', createdAt: new Date().toISOString()
    });
    setTitle(''); setDescription(''); setAssignedTo('');
  };

  const handleDeleteTask = async (taskId: string) => {
    if (window.confirm('Are you sure you want to delete this task?')) {
      await deleteDoc(doc(db, 'tasks', taskId));
    }
  };

  if (loading || !user || role !== 'admin') return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">Admin Portal</h1>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">Create New Task</h2>
        <form onSubmit={handleCreateTask} className="space-y-4">
          <input type="text" placeholder="Task Title" value={title} onChange={(e) => setTitle(e.target.value)} className="w-full p-2 border rounded-lg" required />
          <textarea placeholder="Task Description" value={description} onChange={(e) => setDescription(e.target.value)} className="w-full p-2 border rounded-lg" required />
          <select value={assignedTo} onChange={(e) => setAssignedTo(e.target.value)} className="w-full p-2 border rounded-lg" required>
            <option value="">Assign to a user...</option>
            {users.map(u => <option key={u.uid} value={u.uid}>{u.email}</option>)}
          </select>
          <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded-lg">Create Task</button>
        </form>
      </div>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">All Created Tasks & Statuses</h2>
        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task.id} className="border p-4 rounded-lg flex justify-between items-center">
              <div>
                <h3 className="font-semibold">{task.title}</h3>
                <p className="text-sm text-slate-500">Assigned to: {task.assignedToEmail}</p>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-slate-100">{task.status}</span>
                <button 
                  onClick={() => handleDeleteTask(task.id)}
                  className="text-red-500 hover:text-red-700 text-sm font-medium px-3 py-1 border border-red-200 hover:bg-red-50 rounded-md transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
