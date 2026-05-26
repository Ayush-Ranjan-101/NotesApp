import { Search, Bell, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function Topbar({ onNewNote }) {
  const navigate = useNavigate();
  return (
    <header className="topbar">
      <div
        className="topbar-search"
        onClick={() => navigate('/search')}
        id="topbar-search"
        role="button"
        tabIndex={0}
        onKeyDown={e => e.key === 'Enter' && navigate('/search')}
      >
        <Search />
        <span>Search your sanctuary...</span>
      </div>

      <div className="topbar-actions">
        <button className="icon-btn" title="Notifications" id="topbar-notifications">
          <Bell />
        </button>
        <button className="btn btn-primary" onClick={onNewNote} id="topbar-create">
          <Plus size={15} />
          Create
        </button>
      </div>
    </header>
  );
}
