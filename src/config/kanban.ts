import type { TaskStatus } from '../types'; 
 
export interface KanbanColumnConfig { 
  id: TaskStatus; 
  label: string; 
  color: string; 
  bgColor: string; 
  borderColor: string;
  dropColor: string;
} 

export const KANBAN_COLUMNS: KanbanColumnConfig[] = [ 
  { id: 'TODO',        label: 'Por hacer',   color: 'bg-slate-500',   bgColor: 'bg-slate-50',   borderColor: 'border-slate-200', dropColor: 'ring-slate-400' }, 
  { id: 'IN_PROGRESS', label: 'En progreso', color: 'bg-blue-500',    bgColor: 'bg-blue-50',    borderColor: 'border-blue-200',  dropColor: 'ring-blue-400' }, 
  { id: 'DONE',        label: 'Completado',  color: 'bg-emerald-500', bgColor: 'bg-emerald-50', borderColor: 'border-emerald-200', dropColor: 'ring-emerald-400' }, 
  { id: 'CANCELLED',   label: 'Cancelado',   color: 'bg-red-400',     bgColor: 'bg-red-50',     borderColor: 'border-red-200',   dropColor: 'ring-red-300' }, 
];