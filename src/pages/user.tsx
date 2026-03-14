import { useState, useEffect } from 'react';
import { collection, onSnapshot, query, where, doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../AuthContext';
import { useRouter } from 'next/router';

interface Task { id: string; title: string; description: string; status: string; }

export default function UserPortal() {
  const { user, loading } = useAuth();
  const router = useRouter();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [selectedTaskId, setSelectedTaskId] = useState<string | null>(null);

  useEffect(() => {
    if (!loading && !user) router.push('/');
  }, [user, loading, router]);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'tasks'), where('assignedTo', '==', user.uid));
    const unsubscribe = onSnapshot(q, (snapshot) => {
      setTasks(snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as Task)));
    });
    return () => unsubscribe();
  }, [user]);

  const handleUpdateStatus = async (taskId: string, newStatus: string) => {
    await updateDoc(doc(db, 'tasks', taskId), { status: newStatus });
  };

  if (loading || !user) return <div className="p-8 text-center">Loading...</div>;

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-3xl font-bold mb-8 text-slate-800">User Portal</h1>
      <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-200">
        <h2 className="text-xl font-semibold mb-4 text-slate-800">My Assigned Tasks</h2>
        <div className="space-y-4">
          {tasks.map(task => (
            <div key={task.id} className="border p-4 rounded-lg">
              <div className="flex justify-between items-center">
                <h3 className="font-semibold text-lg">{task.title}</h3>
                <span className="px-3 py-1 rounded-full text-sm font-medium bg-slate-100">{task.status}</span>
              </div>
              
              <button 
                onClick={() => setSelectedTaskId(selectedTaskId === task.id ? null : task.id)}
                className="mt-2 text-indigo-600 text-sm font-medium hover:underline"
              >
                {selectedTaskId === task.id ? 'Hide Details' : 'Open Task Details'}
              </button>

              {selectedTaskId === task.id && (
                <div className="mt-4 p-4 bg-slate-50 rounded-lg border border-slate-200">
                  <p className="text-slate-700 mb-4"><strong>Description:</strong> {task.description}</p>
                  
                  <div className="flex items-center gap-3">
                    <label className="text-sm font-medium text-slate-700">Update Status:</label>
                    <select 
                      value={task.status}
                      onChange={(e) => handleUpdateStatus(task.id, e.target.value)}
                      className="text-sm border border-slate-300 rounded-md p-2 bg-white"
                    >
                      <option value="Pending">Pending</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Completed">Completed</option>
                    </select>

                    {task.status !== 'Completed' && (
                      <button 
                        onClick={() => handleUpdateStatus(task.id, 'Completed')}
                        className="ml-auto bg-emerald-600 text-white px-3 py-1.5 rounded-md text-sm hover:bg-emerald-700"
                      >
                        Mark as Completed
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
