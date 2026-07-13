import { useState, useEffect } from 'react';
import type { FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/useAuth';
import { projectsService } from '../api/projects.service';
import type { Project } from '../types';

export default function ProjectsPage() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [showModal,setShowModal]= useState(false);
  const [name,     setName]     = useState('');
  const [desc,     setDesc]     = useState('');
  const [creating, setCreating] = useState(false);

  const [editingProject, setEditingProject] = useState<Project | null>(null);
  const [editName, setEditName] = useState('');
  const [editDesc, setEditDesc] = useState('');
  const [updating, setUpdating] = useState(false);

  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const { user } = useAuth();
  const navigate  = useNavigate();

  useEffect(() => {
    projectsService.getAll()
      .then(setProjects)
      .catch(() => setError('No se pudieron cargar los proyectos'))
      .finally(() => setLoading(false));
  }, []);

  const handleCreate = async (e: FormEvent) => {
    e.preventDefault();
    if (!user || !name.trim()) return;
    setCreating(true);
    try {
      const newProject = await projectsService.create({
        name: name.trim(), description: desc.trim() || undefined, ownerId: user.id,
      });
      setProjects(prev => [newProject, ...prev]);
      setShowModal(false); setName(''); setDesc('');
    } catch { setError('Error al crear el proyecto'); }
    finally { setCreating(false); }
  };

  const openEdit = (p: Project) => {
    setEditingProject(p);
    setEditName(p.name);
    setEditDesc(p.description ?? '');
  };

  const handleEdit = async (e: FormEvent) => {
    e.preventDefault();
    if (!editingProject || !editName.trim()) return;
    setUpdating(true);
    try {
      const updated = await projectsService.update(editingProject.id, {
        name: editName.trim(), description: editDesc.trim() || undefined,
      });
      setProjects(prev => prev.map(p => p.id === updated.id ? updated : p));
      setEditingProject(null); setEditName(''); setEditDesc('');
    } catch { setError('Error al actualizar el proyecto'); }
    finally { setUpdating(false); }
  };

  const handleDelete = async (id: string) => {
    setDeletingId(id);
    try {
      await projectsService.remove(id);
      setProjects(prev => prev.filter(p => p.id !== id));
      setShowDeleteConfirm(null);
    } catch { setError('Error al eliminar el proyecto'); }
    finally { setDeletingId(null); }
  };

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center">
        <h1 className="text-xl font-bold text-slate-800">Mis Proyectos</h1>
        <button onClick={() => setShowModal(true)}
          className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition">
          + Nuevo Proyecto
        </button>
      </header>

      <main className="max-w-6xl mx-auto p-6">
        {loading && <div className="text-center py-12 text-slate-400">Cargando proyectos...</div>}
        {error && <div className="bg-red-50 border border-red-200 text-red-700 rounded-lg p-4 mb-4">{error}</div>}

        {!loading && projects.length === 0 && (
          <div className="text-center py-20">
            <p className="text-6xl mb-4">📋</p>
            <p className="text-slate-500">Aún no tienes proyectos.</p>
            <button onClick={() => setShowModal(true)}
              className="mt-3 text-blue-600 hover:underline text-sm font-medium">
              Crea tu primer proyecto →
            </button>
          </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {projects.map(p => (
            <div key={p.id} onClick={() => navigate(`/projects/${p.id}`)}
              className="group relative bg-white rounded-xl border border-slate-200 p-5 cursor-pointer hover:shadow-md hover:border-blue-300 transition">

              <div className="absolute top-3 right-3 flex items-center gap-1.5">
                <button
                  onClick={e => { e.stopPropagation(); openEdit(p); }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-indigo-500 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-600 hover:scale-110 active:scale-95 transition-all duration-200"
                  title="Editar proyecto">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>

                <button
                  onClick={e => { e.stopPropagation(); setShowDeleteConfirm(p.id); }}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-rose-500 text-white shadow-lg shadow-rose-200 hover:bg-rose-600 hover:scale-110 active:scale-95 transition-all duration-200"
                  title="Eliminar proyecto">
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>

              <h2 className="font-semibold text-slate-800 mb-1 truncate pr-16">{p.name}</h2>
              {p.description && <p className="text-slate-500 text-sm line-clamp-2 mb-3">{p.description}</p>}
              <span className="text-xs bg-slate-100 text-slate-500 px-2 py-1 rounded-full">
                {p._count?.tasks ?? 0} tareas
              </span>
            </div>
          ))}
        </div>
      </main>

      {/* Modal crear proyecto */}
      {showModal && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
             onClick={e => { if (e.target === e.currentTarget) { setShowModal(false); setName(''); setDesc(''); }}}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Nuevo Proyecto</h2>
            <form onSubmit={handleCreate} className="space-y-4">
              <div>
                <label htmlFor="pname" className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
                <input id="pname" required value={name} onChange={e => setName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
              </div>
              <div>
                <label htmlFor="pdesc" className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                <textarea id="pdesc" value={desc} onChange={e => setDesc(e.target.value)} rows={3}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => { setShowModal(false); setName(''); setDesc(''); }}
                  className="text-slate-600 text-sm font-medium px-4 py-2">Cancelar</button>
                <button type="submit" disabled={creating}
                  className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
                  {creating ? 'Creando...' : 'Crear Proyecto'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal editar proyecto */}
      {editingProject && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
             onClick={e => { if (e.target === e.currentTarget) { setEditingProject(null); }}}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-xl">
            <h2 className="text-lg font-bold text-slate-800 mb-4">Editar Proyecto</h2>
            <form onSubmit={handleEdit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Nombre *</label>
                <input required value={editName} onChange={e => setEditName(e.target.value)}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500" />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Descripción</label>
                <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} rows={3}
                  className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 resize-none" />
              </div>
              <div className="flex justify-end gap-3 pt-2">
                <button type="button" onClick={() => setEditingProject(null)}
                  className="text-slate-600 text-sm font-medium px-4 py-2">Cancelar</button>
                <button type="submit" disabled={updating}
                  className="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-lg transition">
                  {updating ? 'Guardando...' : 'Guardar Cambios'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Modal confirmar eliminación */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
             onClick={e => { if (e.target === e.currentTarget) setShowDeleteConfirm(null); }}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">¿Eliminar proyecto?</h3>
            <p className="text-sm text-slate-500 mb-6">Esta acción no se puede deshacer. Todas las tareas asociadas también se eliminarán.</p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setShowDeleteConfirm(null)}
                className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition">
                Cancelar
              </button>
              <button onClick={() => handleDelete(showDeleteConfirm)} disabled={deletingId === showDeleteConfirm}
                className="px-4 py-2 text-sm font-semibold text-white bg-rose-600 hover:bg-rose-700 disabled:opacity-60 rounded-lg transition">
                {deletingId === showDeleteConfirm ? 'Eliminando...' : 'Eliminar'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
