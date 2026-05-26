import { useNavigate, useSearchParams } from 'react-router-dom';
import { LogOut, Search, Plus, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNoteModal } from '../context/NoteModalContext';
import { useTheme } from '../context/ThemeContext';

export default function Header() {
  const { user, signOut } = useAuth();
  const toast      = useToast();
  const navigate   = useNavigate();
  const noteModal  = useNoteModal();
  const { theme, toggleTheme } = useTheme();
  const [searchParams, setSearchParams] = useSearchParams();

  const query = searchParams.get('q') || '';

  const handleSearchChange = (e) => {
    const val = e.target.value;
    if (val) {
      setSearchParams({ q: val });
      if (window.location.pathname !== '/notes') {
        navigate(`/notes?q=${encodeURIComponent(val)}`);
      }
    } else {
      setSearchParams({});
      if (window.location.pathname !== '/notes') {
        navigate('/notes');
      }
    }
  };

  const handleLogout = async () => {
    await signOut();
    toast('Signed out of Sanctuary', 'success');
    navigate('/login');
  };

  return (
    <header className="site-header" id="site-header">
      <div className="site-header-inner">
        <div className="site-header-brand" onClick={() => navigate(user ? '/dashboard' : '/login')}>
          <h1>Sanctuary</h1>
        </div>

        {user && (
          <div className="header-search" id="header-search">
            <Search size={14} />
            <input
              type="text"
              placeholder="Search your sanctuary..."
              value={query}
              onChange={handleSearchChange}
              onFocus={() => {
                if (window.location.pathname !== '/notes') {
                  navigate(`/notes${query ? `?q=${encodeURIComponent(query)}` : ''}`);
                }
              }}
            />
          </div>
        )}

        <div className="header-actions">
          <button
            className="theme-toggle-btn"
            onClick={toggleTheme}
            title={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            id="theme-toggle"
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          </button>

          {user && (
            <>
              <button
                className="btn btn-primary header-create-btn"
                onClick={() => noteModal.openNewNote()}
                id="header-create"
              >
                <Plus size={15} />
                Create
              </button>

              <button
                className="header-logout-btn"
                onClick={handleLogout}
                title="Sign out"
                id="header-logout-btn"
              >
                <LogOut size={16} />
                <span>Logout</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
