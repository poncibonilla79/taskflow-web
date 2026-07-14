import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { tasksService } from '../api/tasks.service';
import type { Task, TaskStatus, User } from '../types';

const STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: 'Por hacer',
  IN_PROGRESS: 'En progreso',
  DONE: 'Completado',
  CANCELLED: 'Cancelado',
};

interface Props {
  projectId: string;
  task?: Task;
  users: User[];
  onCreated: (task: Task) => void;
  onClose: () => void;
}

export function CreateTaskModal({ projectId, task, users, onCreated, onClose }: Props) {
  const isEditing = !!task;
  const [title, setTitle] = useState(task?.title ?? '');
  const [desc, setDesc] = useState(task?.description ?? '');
  const [status, setStatus] = useState<TaskStatus>(task?.status ?? 'TODO');
  const [assignedTo, setAssignedTo] = useState(task?.assignedTo ?? '');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!title.trim()) return;
    setLoading(true); setError('');
    try {
      const payload = {
        title: title.trim(),
        description: desc.trim() || undefined,
        status,
        assignedTo: assignedTo || null,
      };
      if (task) {
        const updated = await tasksService.update(task.id, payload);
        onCreated(updated);
      } else {
        const newTask = await tasksService.create({ ...payload, projectId });
        onCreated(newTask);
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string } }; message?: string };
      setError(e.response?.data?.message ?? 'Error al guardar la tarea');
    } finally { setLoading(false); }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
         onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-slate-800">{isEditing ? 'Editar Tarea' : 'Nueva Tarea'}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">x</button>
        </div>
        {error && <div className="bg-red-50 text-red-700 text-sm rounded-lg p-3 mb-4">{error}</div>}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="ttitle" className="block text-sm font-medium text-slate-700 mb-1">
              Titulo *
            </label>
            <input id="ttitle" required autoFocus value={title}
              onChange={e => setTitle(e.target.value)}
              placeholder="¿Que hay que hacer?"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
          </div>
          <div>
            <label htmlFor="tdesc" className="block text-sm font-medium text-slate-700 mb-1">
              Descripcion
            </label>
            <textarea id="tdesc" value={desc} onChange={e => setDesc(e.target.value)}
              rows={3} placeholder="Descripcion opcional"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
          </div>
          <div>
            <label htmlFor="tstatus" className="block text-sm font-medium text-slate-700 mb-1">
              Estado
            </label>
            <select id="tstatus" value={status} onChange={e => setStatus(e.target.value as TaskStatus)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              {(Object.keys(STATUS_LABELS) as TaskStatus[]).map(s => (
                <option key={s} value={s}>{STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>
          <div>
            <label htmlFor="tassign" className="block text-sm font-medium text-slate-700 mb-1">
              Asignado a
            </label>
            <select id="tassign" value={assignedTo} onChange={e => setAssignedTo(e.target.value)}
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
              <option value="">Sin asignar</option>
              {users.map(u => (
                <option key={u.id} value={u.id}>{u.name}</option>
              ))}
            </select>
          </div>
          <div className="flex justify-end gap-3">
            <button type="button" onClick={onClose}
              className="text-slate-600 text-sm font-medium px-4 py-2 hover:bg-slate-50 rounded-lg">
              Cancelar
            </button>
            <button type="submit" disabled={loading}
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
              {loading ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear Tarea'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}