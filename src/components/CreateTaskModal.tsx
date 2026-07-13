import { useState, useEffect } from 'react';
import type { FormEvent } from 'react'; 
import { tasksService } from '../api/tasks.service'; 
import type { Task } from '../types'; 
  
interface Props { 
  projectId: string; 
  task?: Task;
  onCreated: (task: Task) => void; 
  onClose: () => void; 
} 
  
export function CreateTaskModal({ projectId, task, onCreated, onClose }: Props) { 
  const isEditing = !!task;
  const [title,   setTitle]   = useState(task?.title ?? ''); 
  const [desc,    setDesc]    = useState(task?.description ?? ''); 
  const [loading, setLoading] = useState(false); 
  const [error,   setError]   = useState(''); 
  
  // Cerrar con Escape 
  useEffect(() => { 
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); 
}; 
    document.addEventListener('keydown', handleKey); 
    return () => document.removeEventListener('keydown', handleKey); 
  }, [onClose]); 
  
  const handleSubmit = async (e: FormEvent) => { 
    e.preventDefault(); 
    if (!title.trim()) return; 
    setLoading(true); setError(''); 
    try {
      if (task) {
        const updated = await tasksService.update(task.id, {
          title: title.trim(),
          description: desc.trim() || undefined,
        });
        onCreated(updated);
      } else {
        const newTask = await tasksService.create({ 
          title: title.trim(), 
          description: desc.trim() || undefined, 
          projectId, 
          status: 'TODO', 
        }); 
        onCreated(newTask);
      }
    } catch (err: unknown) { 
      const e = err as { response?: { data?: { message?: string } }; message?: 
string }; 
      setError(e.response?.data?.message ?? 'Error al guardar la tarea'); 
    } finally { setLoading(false); } 
  }; 
 
  return ( 
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center 
z-50 p-4" 
         onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}> 
      <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl"> 
        <div className="flex justify-between items-center mb-4"> 
          <h2 className="text-lg font-bold text-slate-800">{isEditing ? 'Editar Tarea' : 'Nueva Tarea'}</h2> 
          <button onClick={onClose} className="text-slate-400 hover:text-slate
600 text-xl">×</button> 
        </div> 
        {error && <div className="bg-red-50 text-red-700 text-sm rounded-lg p-3 
mb-4">{error}</div>} 
        <form onSubmit={handleSubmit} className="space-y-4"> 
          <div> 
            <label htmlFor="ttitle" className="block text-sm font-medium text
slate-700 mb-1"> 
              Título * 
            </label> 
            <input id="ttitle" required autoFocus value={title} 
              onChange={e => setTitle(e.target.value)} 
              placeholder="¿Qué hay que hacer?" 
              className="w-full border border-slate-300 rounded-lg px-3 py-2 
text-sm 
                         focus:outline-none focus:ring-2 focus:ring-blue-500" /> 
          </div> 
          <div> 
            <label htmlFor="tdesc" className="block text-sm font-medium text
slate-700 mb-1"> 
              Descripción 
            </label> 
            <textarea id="tdesc" value={desc} onChange={e => 
setDesc(e.target.value)} 
              rows={3} placeholder="Descripción opcional" 
              className="w-full border border-slate-300 rounded-lg px-3 py-2 
text-sm 
                         focus:outline-none focus:ring-2 focus:ring-blue-500 
resize-none" /> 
          </div> 
          <div className="flex justify-end gap-3"> 
            <button type="button" onClick={onClose} 
              className="text-slate-600 text-sm font-medium px-4 py-2 hover:bg
slate-50 rounded-lg"> 
              Cancelar 
            </button> 
            <button type="submit" disabled={loading} 
              className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text
white 
                         text-sm font-semibold px-4 py-2 rounded-lg transition"> 
              {loading ? 'Guardando...' : isEditing ? 'Guardar Cambios' : 'Crear Tarea'} 
            </button> 
          </div> 
        </form> 
      </div> 
    </div> 
  ); 
}