import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { NotesProvider } from './context/NotesContext';
import { ToastProvider } from './context/ToastContext';
import { NoteModalProvider } from './context/NoteModalContext';
import { ThemeProvider } from './context/ThemeContext';

import AppLayout    from './components/AppLayout';
import Header       from './components/Header';
import LoginPage    from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import NotesPage    from './pages/NotesPage';
import SettingsPage from './pages/SettingsPage';

export default function App() {
  return (
    <ThemeProvider>
      <ToastProvider>
        <AuthProvider>
          <NotesProvider>
            <NoteModalProvider>
              <Header />
              <Routes>
                {/* Public */}
                <Route path="/login"    element={<LoginPage />} />
                <Route path="/register" element={<RegisterPage />} />

                {/* Protected */}
                <Route element={<AppLayout />}>
                  <Route path="/dashboard" element={<DashboardPage />} />
                  <Route path="/notes"     element={<NotesPage />} />
                  <Route path="/settings"  element={<SettingsPage />} />
                </Route>

                {/* Fallback */}
                <Route path="*" element={<Navigate to="/dashboard" replace />} />
              </Routes>
            </NoteModalProvider>
          </NotesProvider>
        </AuthProvider>
      </ToastProvider>
    </ThemeProvider>
  );
}

