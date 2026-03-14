import React, { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, doc, updateDoc } from 'firebase/firestore';
import { db } from './firebase';
import { useAuth } from './AuthContext';

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Completed';
  createdAt: string;
}

export default function UserPortal() {
  const { user } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!user) return;

    const q = query(collection(db, 'tasks'), where('assignedTo', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const tasksData = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task));
      setTasks(tasksData);
    });

    return () => unsubscribe();
  }, [user]);

  const handleUpdateStatus = async (taskId: string, newStatus: 'Pending' | 'In Progress' | 'Completed') => {
    setError(null);
    try {
      const taskRef = doc(db, 'tasks', taskId);
      await updateDoc(taskRef, { status: newStatus });
    } catch (error) {
      console.error('Error updating task status:', error);
      setError('Failed to update task status.');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">User Portal</h1>
      
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">My Assigned Tasks</h2>
        {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
        <div className="space-y-4">
          {tasks.length === 0 ? (
            <p className="text-slate-500">No tasks assigned to you yet.</p>
          ) : (
            tasks.map(task => (
              <div key={task.id} className="border border-slate-200 p-4 rounded-lg flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-lg text-slate-800">{task.title}</h3>
                  <p className="text-slate-600 mt-1">{task.description}</p>
                  <p className="text-sm text-slate-500 mt-2">Created at: {new Date(task.createdAt).toLocaleString()}</p>
                </div>
                <div className="flex flex-col items-end gap-2">
                  <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                    task.status === 'Completed' ? 'bg-emerald-100 text-emerald-800' :
                    task.status === 'In Progress' ? 'bg-amber-100 text-amber-800' :
                    'bg-slate-100 text-slate-800'
                  }`}>
                    {task.status}
                  </span>
                  
                  <select 
                    value={task.status}
                    onChange={(e) => handleUpdateStatus(task.id, e.target.value as any)}
                    className="mt-2 text-sm border border-slate-300 rounded-md p-1 bg-white"
                  >
                    <option value="Pending">Pending</option>
                    <option value="In Progress">In Progress</option>
                    <option value="Completed">Completed</option>
                  </select>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
