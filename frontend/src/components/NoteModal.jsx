import { useState, useEffect, useCallback } from 'react';
import { X, FileText } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { useToast } from '../context/ToastContext';

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function wordCount(text = '') { return text.trim() ? text.trim().split(/\s+/).length : 0; }
function readingTime(text = '') { return Math.max(1, Math.ceil(wordCount(text) / 200)); }

export default function NoteModal({ note, onClose }) {
  const [title,   setTitle]   = useState(note?.title   || '');
  const [content, setContent] = useState(note?.content || '');
  const [saving,  setSaving]  = useState(false);

  const { addNote, editNote } = useNotes();
  const toast = useToast();
  const isEdit = Boolean(note);

  // Auto-resize textarea helper
  const autoResize = useCallback((el) => {
    if (el) { el.style.height = 'auto'; el.style.height = el.scrollHeight + 'px'; }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    setSaving(true);
    try {
      if (isEdit) {
        await editNote(note._id, { title, content });
        toast('Note updated', 'success');
      } else {
        await addNote({ title, content });
        toast('Note created', 'success');
      }
      onClose();
    } catch {
      toast('Something went wrong', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onClose]);

  return (
    <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
      <div className="modal" role="dialog" aria-modal="true">
        <div className="modal-header">
          <div className="flex items-center gap-2">
            <FileText size={18} style={{ color: 'var(--accent)' }} />
            <h3>{isEdit ? 'Edit Note' : 'New Note'}</h3>
          </div>
          <button className="icon-btn" onClick={onClose} id="modal-close"><X size={18} /></button>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="note-title">Title</label>
            <input
              id="note-title"
              className="form-input"
              placeholder="Give your note a title..."
              value={title}
              onChange={e => setTitle(e.target.value)}
              autoFocus
              required
            />
          </div>
          <div className="form-group">
            <label className="form-label" htmlFor="note-content">Content</label>
            <textarea
              id="note-content"
              className="form-input"
              placeholder="Start writing..."
              value={content}
              onChange={e => { setContent(e.target.value); autoResize(e.target); }}
              rows={14}
              style={{ minHeight: '360px', resize: 'vertical' }}
            />
          </div>

          {/* Note Details (Minimal, at the bottom) */}
          {isEdit && (
            <div className="editor-sidebar-section" style={{ borderTop: '1px dashed var(--border)', paddingTop: '12px', marginTop: '14px', marginBottom: '14px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '10px', textAlign: 'center' }}>
                <div className="meta-row" style={{ margin: 0, flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                  <span className="meta-label" style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>Created</span>
                  <span className="meta-value" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
                </div>
                <div className="meta-row" style={{ margin: 0, flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                  <span className="meta-label" style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>Edited</span>
                  <span className="meta-value" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{timeAgo(note.updatedAt)}</span>
                </div>
                <div className="meta-row" style={{ margin: 0, flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                  <span className="meta-label" style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>Read Time</span>
                  <span className="meta-value" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{readingTime(content)}m</span>
                </div>
                <div className="meta-row" style={{ margin: 0, flexDirection: 'column', alignItems: 'center', gap: '2px' }}>
                  <span className="meta-label" style={{ fontSize: '0.68rem', textTransform: 'uppercase', letterSpacing: '0.05em', color: 'var(--text-muted)', fontWeight: 600 }}>Words</span>
                  <span className="meta-value" style={{ fontSize: '0.78rem', color: 'var(--text-secondary)' }}>{wordCount(content)}</span>
                </div>
              </div>
            </div>
          )}

          <div className="modal-actions">
            <button type="button" className="btn btn-ghost" onClick={onClose}>Cancel</button>
            <button
              type="submit"
              className="btn btn-primary"
              id="modal-save"
              disabled={saving || !title.trim()}
            >
              {saving ? 'Saving...' : isEdit ? 'Save Changes' : 'Create Note'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
