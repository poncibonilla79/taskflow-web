import { useState, useEffect, useCallback } from 'react';
import { commentsService } from '../api/comments.service';
import { useAuth } from '../context/useAuth';
import type { Comment } from '../types';

interface Props {
  taskId: string;
  onClose: () => void;
  onCommentChange: (taskId: string, delta: number) => void;
}

export function CommentModal({ taskId, onClose, onCommentChange }: Props) {
  const { user } = useAuth();
  const [comments, setComments] = useState<Comment[]>([]);
  const [content, setContent] = useState('');
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [deleting, setDeleting] = useState<string | null>(null);

  const loadComments = useCallback(async () => {
    try {
      const data = await commentsService.getByTask(taskId);
      setComments(data);
    } catch {
      /* silent */
    } finally {
      setLoading(false);
    }
  }, [taskId]);

  useEffect(() => { loadComments(); }, [loadComments]);

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKey);
    return () => document.removeEventListener('keydown', handleKey);
  }, [onClose]);

  const handleSubmit = async () => {
    if (!content.trim() || sending) return;
    setSending(true);
    try {
      const newComment = await commentsService.create({ content: content.trim(), taskId });
      setComments(prev => [...prev, newComment]);
      setContent('');
      onCommentChange(taskId, 1);
    } catch {
      /* silent */
    } finally {
      setSending(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (deleting) return;
    setDeleting(commentId);
    try {
      await commentsService.remove(commentId);
      setComments(prev => prev.filter(c => c.id !== commentId));
      onCommentChange(taskId, -1);
    } catch {
      /* silent */
    } finally {
      setDeleting(null);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4"
         onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}>
      <div className="bg-white rounded-2xl p-6 w-full max-w-lg shadow-xl flex flex-col max-h-[80vh]">
        <div className="flex justify-between items-center mb-4 shrink-0">
          <h2 className="text-lg font-bold text-slate-800">Comentarios</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600 text-xl">
            &times;
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-3 mb-4 min-h-0">
          {loading ? (
            <div className="text-center py-8 text-slate-400 text-sm">Cargando...</div>
          ) : comments.length === 0 ? (
            <div className="text-center py-8 text-slate-400 text-sm">
              No hay comentarios todavia
            </div>
          ) : (
            comments.map(comment => (
              <div key={comment.id}
                   className="bg-slate-50 rounded-lg p-3 border border-slate-100">
                <div className="flex items-center justify-between gap-2 mb-1">
                  <div className="flex items-center gap-2 min-w-0">
                    <span className="w-6 h-6 rounded-full bg-blue-500 text-white text-xs flex items-center justify-center font-medium shrink-0">
                      {comment.user.name.charAt(0).toUpperCase()}
                    </span>
                    <span className="text-sm font-medium text-slate-700 truncate">
                      {comment.user.name}
                    </span>
                    <span className="text-xs text-slate-400 shrink-0">
                      {new Date(comment.createdAt).toLocaleDateString('es-ES', {
                        day: 'numeric', month: 'short', year: 'numeric'
                      })}
                    </span>
                  </div>
                  {user && comment.userId === user.id && (
                    <button onClick={() => handleDelete(comment.id)}
                            disabled={deleting === comment.id}
                      className="text-slate-400 hover:text-red-500 transition shrink-0 disabled:opacity-40"
                      title="Eliminar comentario">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                              d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                    </button>
                  )}
                </div>
                <p className="text-sm text-slate-600 whitespace-pre-wrap">{comment.content}</p>
              </div>
            ))
          )}
        </div>

        <div className="flex gap-2 shrink-0">
          <textarea value={content} onChange={e => setContent(e.target.value)}
            placeholder="Escribe un comentario..."
            rows={2}
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 resize-none"
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleSubmit(); } }} />
          <button onClick={handleSubmit} disabled={!content.trim() || sending}
            className="bg-blue-600 hover:bg-blue-700 disabled:opacity-60 text-white text-sm font-semibold px-4 py-2 rounded-lg transition self-end">
            {sending ? '...' : 'Enviar'}
          </button>
        </div>
      </div>
    </div>
  );
}
