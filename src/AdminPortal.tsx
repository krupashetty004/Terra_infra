import React, { useState, useEffect } from 'react';
import { collection, addDoc, onSnapshot, query, getDocs } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './AuthContext';

interface Task {
  id: string;
  title: string;
  description: string;
  assignedTo: string;
  assignedToEmail: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  createdAt: string;
}

interface User {
  uid: string;
  email: string;
  displayName: string;
}

export default function AdminPortal() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [assignedTo, setAssignedTo] = useState('');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUsers = async () => {
      const usersSnapshot = await getDocs(collection(db, 'users'));
      const usersList = usersSnapshot.docs.map(doc => doc.data() as User);
      setUsers(usersList);
    };
    fetchUsers();

    const q = query(collection(db, 'tasks'));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, []);

  const handleCreateTask = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    if (!title || !description || !assignedTo) return;

    const assignedUser = users.find(u => u.uid === assignedTo);
    
    try {
      await addDoc(collection(db, 'tasks'), {
        title,
        description,
        assignedTo,
        assignedToEmail: assignedUser?.email || '',
        status: 'Pending',
        createdBy: user?.uid,
        createdAt: new Date().toISOString()
      });
      setTitle('');
      setDescription('');
      setAssignedTo('');
    } catch (error) {
      console.error('Error creating task:', error);
      setError('Failed to create task. Check console for details.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">Admin Portal</h1>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">Create New Task</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <form onSubmit={handleCreateTask} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Title</label>
            <input 
              type="text" 
              value={title} 
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Description</label>
            <textarea 
              value={description} 
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              rows={3}
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Assign To</label>
            <select 
              value={assignedTo} 
              onChange={(e) => setAssignedTo(e.target.value)}
              className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
              required
            >
              <option value="">Select a user</option>
              {users.map(u => (
                <option key={u.uid} value={u.uid}>{u.email} {u.displayName ? `(${u.displayName})` : ''}</option>
              ))}
            </select>
          </div>
          <button 
            type="submit"
            className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700 transition-colors"
          >
            Create Task
          </button>
        </form>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">All Tasks</h2>
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <p className="text-slate-500">No tasks created yet.</p>
          ) : (
            tasks.map(task => (
              <div key={task.id} className="border border-slate-200 p-4 rounded-lg flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-slate-800">{task.title}</h3>
                  <p className="text-slate-600 mt-1">{task.description}</p>
                  <p className="text-sm text-slate-500 mt-2">Assigned to: {task.assignedToEmail}</p>
                </div>
                <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                  task.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                  task.status === 'In Progress' ? 'bg-amber-100 text-amber-800' :
                  'bg-slate-100 text-slate-800'
                }`}>
                  {task.status}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
