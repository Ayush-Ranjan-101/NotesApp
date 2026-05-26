import { useState, useRef, useEffect, useCallback } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard, FileText, Settings, LogOut, ChevronUp,
  ChevronLeft, ChevronRight,
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';

const navItems = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/notes',     icon: FileText,        label: 'Notes'     },
];

const SIDEBAR_MIN      = 56;
const SIDEBAR_MAX      = 240;
const SIDEBAR_EXPANDED = 200;
const COLLAPSE_AT      = 110;  // below this = icon-only mode
const STORAGE_KEY      = 'sanctuary_sidebar_w';

function getInitials(name = '') {
  return name.split(' ').map(w => w[0]).join('').toUpperCase().slice(0, 2) || '?';
}

function getSavedWidth() {
  try { return Number(localStorage.getItem(STORAGE_KEY)) || 200; } catch { return 200; }
}

export default function Sidebar() {
  const { user, signOut } = useAuth();
  const toast     = useToast();
  const navigate  = useNavigate();

  const [width, setWidth]       = useState(getSavedWidth);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dragging, setDragging] = useState(false);

  const menuRef  = useRef(null);
  const dragRef  = useRef(null);

  const collapsed = width < COLLAPSE_AT;

  const toggleSidebar = () => {
    setWidth(collapsed ? SIDEBAR_EXPANDED : SIDEBAR_MIN);
  };

  // Sync CSS variable so .main-content margin follows
  useEffect(() => {
    document.documentElement.style.setProperty('--sidebar-width', `${width}px`);
    localStorage.setItem(STORAGE_KEY, String(width));
  }, [width]);

  // ── Drag-to-resize ──
  const onMouseDown = useCallback((e) => {
    e.preventDefault();
    setDragging(true);
    document.body.classList.add('resizing');
    const startX = e.clientX;
    const startW = dragRef.current ?? width;

    const onMove = (ev) => {
      const newW = Math.min(SIDEBAR_MAX, Math.max(SIDEBAR_MIN, startW + (ev.clientX - startX)));
      dragRef.current = newW;
      setWidth(newW);
    };
    const onUp = () => {
      setDragging(false);
      document.body.classList.remove('resizing');
      dragRef.current = null;
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('mouseup', onUp);
    };
    dragRef.current = startW;
    document.addEventListener('mousemove', onMove);
    document.addEventListener('mouseup', onUp);
  }, [width]);

  // ── Close profile menu on outside click ──
  useEffect(() => {
    const handler = (e) => {
      if (menuRef.current && !menuRef.current.contains(e.target)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [menuOpen]);

  const handleLogout = async () => {
    setMenuOpen(false);
    await signOut();
    toast('Signed out of Sanctuary', 'success');
    navigate('/login');
  };

  return (
    <aside
      className={`sidebar${collapsed ? ' sidebar--collapsed' : ''}`}
      style={{ width }}
    >
      <nav className="sidebar-nav">
        {navItems.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) => `nav-item${isActive ? ' active' : ''}`}
            data-tooltip={label}
          >
            <Icon size={18} />
            <span className="nav-label">{label}</span>
          </NavLink>
        ))}
      </nav>

      <div className="sidebar-footer" ref={menuRef}>
        {/* Profile popover menu */}
        {menuOpen && (
          <div className="profile-menu" id="profile-menu">
            <div className="profile-menu-header">
              <span className="profile-menu-name">{user?.userName || 'User'}</span>
              <span className="profile-menu-email">{user?.email}</span>
            </div>
            <div className="profile-menu-divider" />
            <button
              className="profile-menu-item"
              onClick={() => { setMenuOpen(false); navigate('/settings'); }}
              id="profile-menu-settings"
            >
              <Settings size={14} />
              Settings
            </button>
            <button
              className="profile-menu-item profile-menu-item--danger"
              onClick={handleLogout}
              id="profile-menu-logout"
            >
              <LogOut size={14} />
              Log Out
            </button>
          </div>
        )}

        <div
          className="sidebar-profile-trigger"
          onClick={() => setMenuOpen(v => !v)}
          role="button"
          tabIndex={0}
          onKeyDown={e => e.key === 'Enter' && setMenuOpen(v => !v)}
          id="sidebar-profile-trigger"
          data-tooltip={collapsed ? (user?.userName || 'Profile') : undefined}
        >
          <div className="avatar">
            {user?.profilePic
              ? <img src={user.profilePic} alt="avatar" />
              : getInitials(user?.userName)}
          </div>
          <span className="nav-label sidebar-user-block">
            <span className="sidebar-user-info" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
              <p className="truncate" style={{ fontWeight: 600, fontSize: '0.88rem', margin: 0 }}>{user?.userName || 'User'}</p>
            </span>
            <ChevronUp
              size={14}
              className={`profile-chevron${menuOpen ? ' open' : ''}`}
            />
          </span>
        </div>
      </div>

      {/* Resize handle */}
      <div
        className={`sidebar-resize-handle${dragging ? ' active' : ''}`}
        onMouseDown={onMouseDown}
        id="sidebar-resize-handle"
      />

      {/* Toggle button */}
      <button
        className="sidebar-toggle-btn"
        onClick={toggleSidebar}
        data-tooltip={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        id="sidebar-toggle"
      >
        {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
      </button>
    </aside>
  );
}
