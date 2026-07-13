import type { Task, TaskStatus } from '../types';

import { useDraggable } from '@dnd-kit/core';

interface TaskCardProps {
  task: Task;
  onStatusChange: (taskId: string, newStatus: TaskStatus) => void;
  onDelete: (taskId: string) => void;
  onEdit: (task: Task) => void;
}

const STATUS_LABELS: Record<TaskStatus, string> = {
  TODO: 'Por hacer',
  IN_PROGRESS: 'En progreso',
  DONE: 'Completado',
  CANCELLED: 'Cancelado',
};

export default function TaskCard({ task, onStatusChange, onDelete, onEdit }: TaskCardProps) {
  const { attributes, listeners, setNodeRef, transform, isDragging } = useDraggable({
    id: `task-${task.id}`,
    data: { task, status: task.status },
  });

  const style = transform ? {
    transform: `translate3d(${transform.x}px, ${transform.y}px, 0)`,
  } : undefined;

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onStatusChange(task.id, e.target.value as TaskStatus);
  };

  const stopPropagation = (e: React.SyntheticEvent) => e.stopPropagation();

  const commentCount = task._count?.comments ?? 0;

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}
      className={`group relative bg-white rounded-lg border border-slate-200 shadow-sm hover:shadow-md p-3 transition-shadow ${isDragging ? 'opacity-50' : ''}`}>
      {/* Iconos editar/eliminar - extremo superior derecho */}
      <div className="absolute top-2 right-2 flex items-center gap-1">
        <button
          type="button"
          onClick={(e) => { stopPropagation(e); onEdit(task); }}
          onPointerDown={stopPropagation}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-indigo-500 text-white shadow-sm hover:bg-indigo-600 hover:scale-110 active:scale-95 transition-all duration-200"
          title="Editar tarea">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
          </svg>
        </button>
        <button
          type="button"
          onClick={(e) => { stopPropagation(e); onDelete(task.id); }}
          onPointerDown={stopPropagation}
          className="flex h-7 w-7 items-center justify-center rounded-full bg-rose-500 text-white shadow-sm hover:bg-rose-600 hover:scale-110 active:scale-95 transition-all duration-200"
          title="Eliminar tarea">
          <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
          </svg>
        </button>
      </div>

      {/* Título */}
      <h3 className="pr-14 font-medium text-slate-800">{task.title}</h3>

      {/* Descripción truncada */}
      {task.description && (
        <p className="mt-1 line-clamp-2 text-xs text-slate-500">
          {task.description}
        </p>
      )}

      {/* Badges: asignado y comentarios */}
      {(task.assignee || commentCount > 0) && (
        <div className="mt-2 flex flex-wrap items-center gap-1.5">
          {task.assignee && (
            <span className="rounded-full bg-blue-50 px-2 py-0.5 text-[11px] font-medium text-blue-700">
              {task.assignee.name}
            </span>
          )}
          {commentCount > 0 && (
            <span className="rounded-full bg-slate-100 px-2 py-0.5 text-[11px] font-medium text-slate-600">
              💬 {commentCount}
            </span>
          )}
        </div>
      )}

      {/* Selector de status */}
      <select
        value={task.status}
        onChange={handleStatusChange}
        onClick={stopPropagation}
        onPointerDown={stopPropagation}
        className="mt-3 w-full rounded-md border border-slate-200 bg-slate-50 px-2 py-1 text-xs text-slate-600 focus:border-slate-400 focus:outline-none"
      >
        {(Object.keys(STATUS_LABELS) as TaskStatus[]).map((status) => (
          <option key={status} value={status}>
            {STATUS_LABELS[status]}
          </option>
        ))}
      </select>
    </div>
  );
}
