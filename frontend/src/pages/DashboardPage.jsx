import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Plus, FileText, Link2, Quote, Filter, ArrowUpDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useNotes } from '../context/NotesContext';
import { useNoteModal } from '../context/NoteModalContext';

function timeAgo(dateStr) {
  const diff = (Date.now() - new Date(dateStr)) / 1000;
  if (diff < 3600)  return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const ICON_MAP = [FileText, Link2, Quote, FileText, Link2, Quote];

export default function DashboardPage() {
  const { user }   = useAuth();
  const { notes, loading, fetchNotes } = useNotes();
  const { openNewNote, openEditNote } = useNoteModal();
  const navigate = useNavigate();

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const recent  = [...notes].sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
  const focused = recent[0];
  const grid    = recent.slice(1, 5);

  return (
    <div className="page-content">
      {/* Header */}
      <div className="dashboard-header">
        <h2>Welcome back, {user?.userName?.split(' ')[0] || 'there'}.</h2>
        <p>Your sanctuary for deep thought and refined writing.</p>
      </div>

      {/* Hero */}
      <div className="dashboard-hero">
        {focused ? (
          <div className="focus-card" onClick={() => openEditNote(focused)} id="focus-card">
            <p className="focus-label">Current Focus</p>
            <h3>{focused.title}</h3>
            <p>{focused.content?.slice(0, 120)}{focused.content?.length > 120 ? '…' : ''}</p>
            <div className="focus-meta">
              <span className="tag-pill">Note</span>
              <span className="focus-time">Last edited {timeAgo(focused.updatedAt)}</span>
            </div>
          </div>
        ) : (
          <div className="focus-card" style={{ opacity: 0.5 }}>
            <p className="focus-label">Current Focus</p>
            <h3>No notes yet</h3>
            <p>Create your first note to get started.</p>
          </div>
        )}

        <div className="insights-card">
          <Sparkles />
          <h3>{notes.length} Note{notes.length !== 1 ? 's' : ''}</h3>
          <p>In your personal sanctuary.</p>
        </div>
      </div>

      {/* Recent Notes */}
      <div className="section-header">
        <h3>Recent Notes</h3>
        <div className="flex gap-2">
          <button className="btn btn-ghost" id="filter-btn"><Filter size={13} /> Filter</button>
          <button className="btn btn-ghost" id="sort-btn"><ArrowUpDown size={13} /> Sort</button>
        </div>
      </div>

      {loading ? (
        <div className="loading-wrap"><div className="spinner" /></div>
      ) : (
        <div className="notes-grid">
          {grid.map((note, i) => {
            const Icon = ICON_MAP[i % ICON_MAP.length];
            return (
              <div
                key={note._id}
                className="note-card"
                onClick={() => openEditNote(note)}
                id={`dash-note-${note._id}`}
              >
                <div className="note-card-icon"><Icon /></div>
                <h4>{note.title}</h4>
                <p>{note.content?.slice(0, 80)}{note.content?.length > 80 ? '…' : ''}</p>
                <div className="note-card-footer">
                  <span className="note-date">{timeAgo(note.updatedAt)}</span>
                </div>
              </div>
            );
          })}

          {/* Create new tile */}
          <div
            className="note-card note-card-new"
            onClick={() => openNewNote()}
            id="dash-create-note"
          >
            <Plus />
            <span>Create New Note</span>
            <small>Start a fresh thought thread</small>
          </div>
        </div>
      )}

    </div>
  );
}
