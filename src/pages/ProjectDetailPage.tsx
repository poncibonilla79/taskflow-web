import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { DndContext, DragOverlay, closestCorners } from '@dnd-kit/core';
import type { DragStartEvent, DragEndEvent } from '@dnd-kit/core';
import { projectsService } from '../api/projects.service';
import { tasksService } from '../api/tasks.service';
import type { Project, Task, TaskStatus } from '../types';
import { KANBAN_COLUMNS } from '../config/kanban';
import { KanbanColumn } from '../components/KanbanColumn';
import { CreateTaskModal } from '../components/CreateTaskModal';

export default function ProjectDetailPage() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [project,  setProject]  = useState<Project | null>(null);
  const [tasks,    setTasks]    = useState<Task[]>([]);
  const [loading,  setLoading]  = useState(true);
  const [error,    setError]    = useState('');
  const [showModal, setShowModal] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const loadData = useCallback(async () => {
    if (!id) return;
    setLoading(true);
    try {
      const [proj, taskList] = await Promise.all([
        projectsService.getById(id),
        tasksService.getByProject(id),
      ]);
      setProject(proj);
      setTasks(taskList);
    } catch { setError('No se pudo cargar el proyecto'); }
    finally { setLoading(false); }
  }, [id]);

  useEffect(() => { loadData(); }, [loadData]);

  const handleStatusChange = async (taskId: string, newStatus: TaskStatus) => {
    setTasks(prev => prev.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    try { await tasksService.update(taskId, { status: newStatus }); }
    catch { loadData(); }
  };

  const handleDelete = (taskId: string) => {
    setShowDeleteConfirm(taskId);
  };

  const confirmDeleteTask = async () => {
    if (!showDeleteConfirm) return;
    const taskId = showDeleteConfirm;
    setDeletingId(taskId);
    setTasks(prev => prev.filter(t => t.id !== taskId));
    try { await tasksService.remove(taskId); setShowDeleteConfirm(null); }
    catch { loadData(); }
    finally { setDeletingId(null); }
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleTaskSaved = (updated: Task) => {
    setTasks(prev => prev.map(t => t.id === updated.id ? updated : t));
    setEditingTask(null);
    setShowModal(false);
  };

  const handleTaskCreated = (newTask: Task) => {
    setTasks(prev => [newTask, ...prev]);
    setShowModal(false);
  };

  const handleDragStart = (event: DragStartEvent) => {
    const task = event.active.data.current?.task as Task | undefined;
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: DragEndEvent) => {
    setActiveTask(null);
    if (!event.over) return;
    const taskId = String(event.active.id).replace('task-', '');
    const newStatus = String(event.over.id) as TaskStatus;
    const task = tasks.find(t => t.id === taskId);
    if (task && task.status !== newStatus) {
      handleStatusChange(taskId, newStatus);
    }
  };

  const tasksByStatus = KANBAN_COLUMNS.reduce((acc, col) => {
    acc[col.id] = tasks.filter(t => t.status === col.id);
    return acc;
  }, {} as Record<TaskStatus, Task[]>);

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600" />
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-white border-b border-slate-200 px-6 py-4">
        <div className="max-w-screen-xl mx-auto">
          {/* Mobile layout */}
          <div className="flex flex-col lg:hidden gap-1">
            <button onClick={() => navigate('/projects')}
              className="text-slate-400 hover:text-slate-700 text-sm w-fit">
              ← Proyectos
            </button>
            <div className="flex items-center gap-3">
              <h1 className="text-base font-bold text-slate-800 truncate">{project?.name}</h1>
              <button onClick={() => setShowModal(true)}
                className="bg-blue-600 hover:bg-blue-700 text-white text-xs font-medium px-3 py-1.5 rounded-lg transition ml-auto shrink-0 whitespace-nowrap">
                + Nueva Tarea
              </button>
            </div>
          </div>
          {/* Desktop layout */}
          <div className="hidden lg:flex items-center gap-4">
            <div className="flex items-center gap-3 min-w-0">
              <button onClick={() => navigate('/projects')}
                className="text-slate-400 hover:text-slate-700 text-sm shrink-0">
                ← Proyectos
              </button>
              <span className="text-slate-300 shrink-0">/</span>
              <h1 className="text-lg font-bold text-slate-800 truncate">{project?.name}</h1>
            </div>
            <button onClick={() => setShowModal(true)}
              className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition ml-auto shrink-0">
              + Nueva Tarea
            </button>
          </div>
        </div>
      </header>
      {error && <div className="max-w-screen-xl mx-auto px-6 py-2 text-red-600 text-sm">{error}</div>}
      <main className="max-w-screen-xl mx-auto p-6">
        <DndContext collisionDetection={closestCorners} onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {KANBAN_COLUMNS.map(col => (
              <KanbanColumn
                key={col.id}
                config={col}
                tasks={tasksByStatus[col.id] ?? []}
                onStatusChange={handleStatusChange}
                onDelete={handleDelete}
                onEdit={handleEditTask}
                onAddTask={col.id === 'TODO' ? () => setShowModal(true) : undefined}
              />
            ))}
          </div>
          <DragOverlay dropAnimation={null}>
            {activeTask ? (
              <div className="bg-white rounded-lg border border-slate-200 shadow-xl p-3 max-w-xs">
                <h3 className="pr-6 font-medium text-slate-800">{activeTask.title}</h3>
                {activeTask.description && (
                  <p className="mt-1 line-clamp-2 text-xs text-slate-500">{activeTask.description}</p>
                )}
              </div>
            ) : null}
          </DragOverlay>
        </DndContext>
      </main>
      {(showModal || editingTask) && project && (
        <CreateTaskModal
          projectId={project.id}
          task={editingTask ?? undefined}
          onCreated={editingTask ? handleTaskSaved : handleTaskCreated}
          onClose={() => { setShowModal(false); setEditingTask(null); }}
        />
      )}

      {/* Modal confirmar eliminación de tarea */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50"
             onClick={e => { if (e.target === e.currentTarget) setShowDeleteConfirm(null); }}>
          <div className="bg-white rounded-2xl p-6 w-full max-w-sm shadow-xl text-center">
            <div className="mx-auto w-12 h-12 rounded-full bg-rose-100 flex items-center justify-center mb-4">
              <svg className="w-6 h-6 text-rose-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 16.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">¿Eliminar tarea?</h3>
            <p className="text-sm text-slate-500 mb-6">
              Esta acción no se puede deshacer.
            </p>
            <div className="flex justify-center gap-3">
              <button onClick={() => setShowDeleteConfirm(null)}
                      className="px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition">
                Cancelar
              </button>
              <button onClick={confirmDeleteTask}
                      disabled={deletingId === showDeleteConfirm}
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
