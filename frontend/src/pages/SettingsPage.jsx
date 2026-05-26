import { useState, useRef } from 'react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { useNavigate } from 'react-router-dom';
import { User, Shield, LogOut, Info, Camera, Trash2 } from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import { updateProfile, deleteProfile } from '../lib/api';

function getDarknessLabel(val) {
  if (val <= 5) return 'Abyssal Space';
  if (val <= 10) return 'Sanctuary Default';
  if (val <= 15) return 'Charcoal Midnight';
  return 'Softer Ash';
}

function getBrightnessLabel(val) {
  if (val <= 88) return 'Soft Creampuff';
  if (val <= 93) return 'Silver Mist';
  return 'Polar Icecap';
}

export default function SettingsPage() {
  const { user, signOut, updateUser } = useAuth();
  const toast = useToast();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile'); // 'profile' | 'account' | 'about'
  const { theme, lightBrightness, setLightBrightness, darkDarkness, setDarkDarkness } = useTheme();

  const fileInputRef = useRef(null);
  const [uploading, setUploading] = useState(false);

  const handleLogout = async () => {
    await signOut();
    toast('Signed out', 'success');
    navigate('/login');
  };

  const getInitials = (name) => {
    if (!name) return '?';
    return name.slice(0, 2).toUpperCase();
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      toast('Please upload an image file', 'error');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast('Image must be less than 5MB', 'error');
      return;
    }

    setUploading(true);
    const formData = new FormData();
    formData.append('profilePic', file);

    try {
      const res = await updateProfile(formData);
      const updatedUser = res.data.data.user;
      updateUser(updatedUser);
      toast('Avatar updated successfully!', 'success');
    } catch (err) {
      console.error(err);
      toast(err.response?.data?.message || 'Error uploading profile image', 'error');
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = '';
    }
  };

  const handleRemoveAvatar = async () => {
    if (!window.confirm('Are you sure you want to remove your avatar?')) return;
    setUploading(true);
    try {
      const res = await deleteProfile();
      const updatedUser = res.data.data.user;
      updateUser(updatedUser);
      toast('Avatar removed successfully!', 'success');
    } catch (err) {
      console.error(err);
      toast(err.response?.data?.message || 'Error removing avatar', 'error');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="page-content" style={{ maxWidth: 840 }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Settings</h2>
        <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: '4px 0 0 0' }}>Manage your account, preferences, and workspace info.</p>
      </div>

      <div className="settings-container">
        {/* Left Sub-navigation Tabs Sidebar */}
        <div className="settings-sidebar">
          <button
            className={`settings-tab-btn${activeTab === 'profile' ? ' active' : ''}`}
            onClick={() => setActiveTab('profile')}
            id="tab-profile"
          >
            <User size={16} />
            <span>Profile</span>
          </button>
          <button
            className={`settings-tab-btn${activeTab === 'account' ? ' active' : ''}`}
            onClick={() => setActiveTab('account')}
            id="tab-account"
          >
            <Shield size={16} />
            <span>Account</span>
          </button>
          <button
            className={`settings-tab-btn${activeTab === 'about' ? ' active' : ''}`}
            onClick={() => setActiveTab('about')}
            id="tab-about"
          >
            <Info size={16} />
            <span>About</span>
          </button>
        </div>

        {/* Right Tab Content View */}
        <div className="settings-content-card">
          {activeTab === 'profile' && (
            <div className="settings-tab-pane animate-fade">
              <h3 className="tab-pane-title"><User size={16} /> Profile</h3>
              <p className="tab-pane-desc">Manage your public information and display names.</p>
              
              {/* Avatar Uploader Section */}
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px', marginBottom: '32px', paddingBottom: '24px', borderBottom: '1px solid var(--border)' }}>
                <div 
                  className="avatar-upload-trigger"
                  onClick={handleAvatarClick}
                  style={{
                    position: 'relative',
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    background: 'var(--bg-primary)',
                    border: '2px solid var(--border)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    flexShrink: 0
                  }}
                >
                  {user?.profilePic ? (
                    <img src={user.profilePic} alt="avatar" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <span style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--accent)' }}>
                      {getInitials(user?.userName)}
                    </span>
                  )}
                  
                  {/* Hover Overlay */}
                  <div className="avatar-hover-overlay">
                    <Camera size={18} color="#fff" />
                    <span style={{ fontSize: '0.62rem', color: '#fff', fontWeight: 600, marginTop: '2px' }}>Upload</span>
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                  <h4 style={{ fontSize: '0.92rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0 }}>Your Avatar Picture</h4>
                  <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: 0 }}>
                    Upload a custom JPG or PNG picture (up to 5MB) or use default initials.
                  </p>
                  
                  <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginTop: '4px' }}>
                    <button 
                      className="btn btn-ghost" 
                      onClick={handleAvatarClick}
                      disabled={uploading}
                      style={{ fontSize: '0.78rem', padding: '6px 12px' }}
                    >
                      {uploading ? 'Processing...' : 'Upload New'}
                    </button>
                    {user?.profilePic && (
                      <button 
                        className="btn btn-ghost" 
                        onClick={handleRemoveAvatar}
                        disabled={uploading}
                        style={{ fontSize: '0.78rem', padding: '6px 12px', color: 'var(--danger)' }}
                      >
                        <Trash2 size={13} style={{ marginRight: '4px' }} /> Remove
                      </button>
                    )}
                  </div>
                </div>

                {/* Hidden File Input */}
                <input 
                  type="file" 
                  ref={fileInputRef} 
                  onChange={handleFileChange} 
                  accept="image/*" 
                  style={{ display: 'none' }} 
                />
              </div>

              <div className="settings-row">
                <div className="settings-row-label">
                  <p>Username</p>
                  <span>Your display name across Sanctuary</span>
                </div>
                <span className="settings-value">{user?.userName || 'User'}</span>
              </div>
              <div className="settings-row">
                <div className="settings-row-label">
                  <p>Email</p>
                  <span>Your registered email address</span>
                </div>
                <span className="settings-value">{user?.email || 'N/A'}</span>
              </div>

              {/* Display Customization Section */}
              <div style={{ marginTop: '36px', borderTop: '1px solid var(--border)', paddingTop: '28px' }}>
                <h4 style={{ fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '4px', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  Theme Intensity
                </h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginBottom: '20px' }}>
                  Fine-tune the custom HSL background levels of your active workspace theme.
                </p>

                {theme === 'dark' ? (
                  <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>Darkness Scale</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)', background: 'var(--accent-dim)', padding: '3px 8px', borderRadius: '4px' }}>
                        {darkDarkness}% ({getDarknessLabel(darkDarkness)})
                      </span>
                    </div>
                    <input
                      type="range"
                      min="3"
                      max="18"
                      value={darkDarkness}
                      onChange={e => setDarkDarkness(Number(e.target.value))}
                      style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--accent)' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                      <span>Abyssal Space (3%)</span>
                      <span>Sanctuary Default (9%)</span>
                      <span>Softer Ash (18%)</span>
                    </div>
                  </div>
                ) : (
                  <div style={{ background: 'var(--bg-primary)', border: '1px solid var(--border)', borderRadius: '8px', padding: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                      <span style={{ fontSize: '0.88rem', fontWeight: 600, color: 'var(--text-primary)' }}>Brightness Scale</span>
                      <span style={{ fontSize: '0.8rem', fontWeight: 600, color: 'var(--accent)', background: 'var(--accent-dim)', padding: '3px 8px', borderRadius: '4px' }}>
                        {lightBrightness}% ({getBrightnessLabel(lightBrightness)})
                      </span>
                    </div>
                    <input
                      type="range"
                      min="85"
                      max="98"
                      value={lightBrightness}
                      onChange={e => setLightBrightness(Number(e.target.value))}
                      style={{ width: '100%', cursor: 'pointer', accentColor: 'var(--accent)' }}
                    />
                    <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.74rem', color: 'var(--text-muted)', marginTop: '8px' }}>
                      <span>Soft Creampuff (85%)</span>
                      <span>Silver Mist (92%)</span>
                      <span>Polar Icecap (98%)</span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'account' && (
            <div className="settings-tab-pane animate-fade">
              <h3 className="tab-pane-title"><Shield size={16} /> Account</h3>
              <p className="tab-pane-desc">Control access permissions and device sessions.</p>
              
              <div className="settings-row">
                <div className="settings-row-label">
                  <p>Sign Out</p>
                  <span>Sign out from this device session</span>
                </div>
                <button
                  className="btn btn-ghost"
                  onClick={handleLogout}
                  id="settings-logout-btn"
                  style={{ display: 'flex', alignItems: 'center', gap: '8px' }}
                >
                  <LogOut size={14} /> Sign Out
                </button>
              </div>
            </div>
          )}

          {activeTab === 'about' && (
            <div className="settings-tab-pane animate-fade" style={{ opacity: 0.9 }}>
              <h3 className="tab-pane-title"><Info size={16} /> About</h3>
              <p className="tab-pane-desc">View system specifications and build information.</p>
              
              <div className="settings-row">
                <div className="settings-row-label">
                  <p>Version</p>
                  <span>Production environment release</span>
                </div>
                <span className="settings-value">1.0.0</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
