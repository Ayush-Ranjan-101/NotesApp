import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FileText, Trash2, Pencil, Clock } from 'lucide-react';
import { useNotes } from '../context/NotesContext';
import { useToast } from '../context/ToastContext';
import { useNoteModal } from '../context/NoteModalContext';

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function NotesPage() {
  const { notes, loading, fetchNotes, removeNote } = useNotes();
  const toast = useToast();
  const { openEditNote } = useNoteModal();
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') || '';

  const [confirm, setConfirm] = useState(null); // note to delete

  useEffect(() => {
    fetchNotes();
  }, [fetchNotes]);

  const filteredNotes = notes
    .filter(n =>
      !query.trim() ||
      n.title?.toLowerCase().includes(query.toLowerCase()) ||
      n.content?.toLowerCase().includes(query.toLowerCase())
    )
    .sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));

  const handleDelete = async () => {
    try {
      await removeNote(confirm._id);
      toast('Note deleted', 'success');
    } catch {
      toast('Delete failed', 'error');
    } finally {
      setConfirm(null);
    }
  };

  return (
    <div className="page-content" style={{ padding: '32px' }}>
      <div className="notes-page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '28px' }}>
        <div>
          <h2 style={{ fontSize: '1.4rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>My Notes</h2>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Write down your thoughts, ideas, or reminders.</p>
        </div>
      </div>

      {loading ? (
        <div className="loading-wrap"><div className="spinner" /></div>
      ) : filteredNotes.length === 0 ? (
        <div className="empty-state">
          <FileText />
          <h3>{query ? 'No matching notes' : 'No notes yet'}</h3>
          <p>{query ? 'Try a different search term.' : 'Create your first note to get started.'}</p>
        </div>
      ) : (
        <div className="notes-grid">
          {filteredNotes.map(note => (
            <div
              key={note._id}
              className="note-card"
              onClick={() => openEditNote(note)}
              id={`note-card-${note._id}`}
            >
              <div className="note-card-header">
                <div className="note-card-title-wrap">
                  <FileText size={15} className="note-card-icon" />
                  <h3 className="note-card-title">{note.title || 'Untitled'}</h3>
                </div>
              </div>
              
              <p className="note-card-excerpt">
                {note.content || <em style={{ color: 'var(--text-muted)' }}>No content</em>}
              </p>
              
              <div className="note-card-footer">
                <div className="note-card-time">
                  <Clock size={11} />
                  <span>{timeAgo(note.updatedAt)}</span>
                </div>
                <div className="note-card-actions" onClick={e => e.stopPropagation()}>
                  <button
                    className="icon-btn"
                    onClick={() => openEditNote(note)}
                    title="Edit"
                    id={`edit-${note._id}`}
                  >
                    <Pencil size={13} />
                  </button>
                  <button
                    className="icon-btn"
                    onClick={() => setConfirm(note)}
                    title="Delete"
                    id={`delete-${note._id}`}
                    style={{ color: 'var(--danger)' }}
                  >
                    <Trash2 size={13} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Delete confirmation */}
      {confirm && (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && setConfirm(null)}>
          <div className="modal" style={{ maxWidth: 380 }}>
            <div className="modal-header">
              <h3>Delete Note</h3>
            </div>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem' }}>
              Are you sure you want to delete <strong>"{confirm.title}"</strong>? This cannot be undone.
            </p>
            <div className="modal-actions">
              <button className="btn btn-ghost" onClick={() => setConfirm(null)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDelete} id="confirm-delete-btn">Delete</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
