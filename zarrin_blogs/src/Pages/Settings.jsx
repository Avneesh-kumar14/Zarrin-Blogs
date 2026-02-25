import React, { useState, useEffect } from 'react';
import { User, Shield, Bell, Palette, Upload, Eye, EyeOff, Trash2, Camera, Lock, Mail, MapPin, Globe, CheckCircle, AlertTriangle, X, Sparkles, Edit3, Save } from 'lucide-react';
import Alert from '../Component/Common/Alert';
import { useUser } from '../context/UserContext';
import { useNavigate } from 'react-router-dom';

const Settings = () => {
  const { user, updateUserProfile, updateAvatar, changePassword, updateWritingPreferences, updatePrivacy, updateNotifications, clearUser } = useUser();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [alert, setAlert] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [previewAvatar, setPreviewAvatar] = useState(null);
  const [avatarLoading, setAvatarLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteConfirmText, setDeleteConfirmText] = useState('');
  const [deletePassword, setDeletePassword] = useState('');

  const [passwordData, setPasswordData] = useState({
    currentPassword: '', newPassword: '', confirmPassword: ''
  });

  const [formData, setFormData] = useState({
    firstName: '', lastName: '', username: '', email: '', bio: '',
    website: '', location: '', avatar: '',
    allowComments: true, showReadingTime: true, autoSaveDrafts: true,
    profileVisibility: true, showActivity: true,
    emailFollowers: true, emailComments: true, emailLikes: false,
    emailDigest: true, pushNotifications: true, pushMentions: true
  });

  useEffect(() => {
    if (user) {
      setFormData({
        firstName: user.firstName || '', lastName: user.lastName || '',
        username: user.username || '', email: user.email || '',
        bio: user.bio || '', website: user.website || '',
        location: user.location || '', avatar: user.avatar || '',
        allowComments: user.writing?.allowComments ?? true,
        showReadingTime: user.writing?.showReadingTime ?? true,
        autoSaveDrafts: user.writing?.autoSaveDrafts ?? true,
        profileVisibility: user.privacy?.profileVisibility ?? true,
        showActivity: user.privacy?.showActivity ?? true,
        emailFollowers: user.notifications?.emailFollowers ?? true,
        emailComments: user.notifications?.emailComments ?? true,
        emailLikes: user.notifications?.emailLikes ?? false,
        emailDigest: user.notifications?.emailDigest ?? true,
        pushNotifications: user.notifications?.pushNotifications ?? true,
        pushMentions: user.notifications?.pushMentions ?? true
      });
    }
  }, [user]);

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({ ...formData, [name]: type === 'checkbox' ? checked : value });
  };
  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordData({ ...passwordData, [name]: value });
  };
  const handleAvatarChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    setPreviewAvatar(URL.createObjectURL(file));
  };
  const handleAvatarUpload = async () => {
    try {
      setAvatarLoading(true);
      if (!previewAvatar) { setAlert({ type: 'error', message: 'Please select an image first' }); return; }
      const fileInput = document.getElementById('avatar-input');
      if (!fileInput || !fileInput.files[0]) { setAlert({ type: 'error', message: 'No file selected' }); return; }
      const response = await updateAvatar(fileInput.files[0]);
      const avatarUrl = response?.avatar || response?.data?.avatar || (typeof response === 'string' ? response : null);
      if (!avatarUrl) throw new Error('Failed to get avatar URL from upload response');
      setFormData(prev => ({ ...prev, avatar: avatarUrl }));
      setPreviewAvatar(null);
      fileInput.value = '';
      setAlert({ type: 'success', message: 'Avatar updated successfully!' });
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Failed to upload avatar' });
    } finally { setAvatarLoading(false); }
  };
  const handleSaveProfile = async () => {
    try {
      setLoading(true);
      await updateUserProfile({ firstName: formData.firstName, lastName: formData.lastName, bio: formData.bio, website: formData.website, location: formData.location });
      setAlert({ type: 'success', message: 'Profile saved successfully!' });
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Failed to save profile' });
    } finally { setLoading(false); }
  };
  const handleChangePassword = async () => {
    try {
      if (passwordData.newPassword !== passwordData.confirmPassword) { setAlert({ type: 'error', message: 'Passwords do not match!' }); return; }
      if (passwordData.newPassword.length < 8) { setAlert({ type: 'error', message: 'Password must be at least 8 characters' }); return; }
      setLoading(true);
      await changePassword(passwordData.currentPassword, passwordData.newPassword);
      setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
      setAlert({ type: 'success', message: 'Password changed successfully!' });
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally { setLoading(false); }
  };
  const handleSaveWritingPreferences = async () => {
    try {
      setLoading(true);
      await updateWritingPreferences({ allowComments: formData.allowComments, showReadingTime: formData.showReadingTime, autoSaveDrafts: formData.autoSaveDrafts });
      setAlert({ type: 'success', message: 'Writing preferences saved!' });
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally { setLoading(false); }
  };
  const handleSavePrivacy = async () => {
    try {
      setLoading(true);
      await updatePrivacy({ profileVisibility: formData.profileVisibility, showActivity: formData.showActivity });
      setAlert({ type: 'success', message: 'Privacy settings saved!' });
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally { setLoading(false); }
  };
  const handleSaveNotifications = async () => {
    try {
      setLoading(true);
      await updateNotifications({ emailFollowers: formData.emailFollowers, emailComments: formData.emailComments, emailLikes: formData.emailLikes, emailDigest: formData.emailDigest, pushNotifications: formData.pushNotifications, pushMentions: formData.pushMentions });
      setAlert({ type: 'success', message: 'Notification preferences saved!' });
    } catch (error) {
      setAlert({ type: 'error', message: error.message });
    } finally { setLoading(false); }
  };
  const handleDeleteAccount = async () => {
    try {
      if (!user || !user._id) { setAlert({ type: 'error', message: 'User not loaded. Please refresh the page.' }); return; }
      if (deleteConfirmText !== 'DELETE MY ACCOUNT') { setAlert({ type: 'error', message: 'Please type "DELETE MY ACCOUNT" to confirm' }); return; }
      if (!deletePassword) { setAlert({ type: 'error', message: 'Please enter your password to confirm deletion' }); return; }
      setLoading(true);
      const token = localStorage.getItem('token');
      if (!token) throw new Error('Not authenticated');
      const API_BASE = process.env.REACT_APP_API_BASE_URL || 'https://zarrin-blogs-backend.onrender.com';
      const API_URL = API_BASE.endsWith('/api') ? API_BASE : `${API_BASE}/api`;
      const res = await fetch(`${API_URL}/users/${user._id}`, {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${token}` },
        body: JSON.stringify({ password: deletePassword })
      });
      if (!res.ok) { const error = await res.json(); throw new Error(error.message || 'Failed to delete account'); }
      clearUser();
      setAlert({ type: 'success', message: 'Account deleted successfully. Redirecting to home...' });
      setTimeout(() => { navigate('/'); window.location.reload(); }, 2000);
    } catch (error) {
      setAlert({ type: 'error', message: error.message || 'Failed to delete account' });
      setLoading(false);
    }
  };

  const tabs = [
    { id: 'profile',       icon: User,    label: 'Profile',       sub: 'Edit your public info'  },
    { id: 'account',       icon: Shield,  label: 'Account',       sub: 'Password & security'    },
    { id: 'notifications', icon: Bell,    label: 'Notifications', sub: 'Alerts & privacy'        },
    { id: 'appearance',    icon: Palette, label: 'Appearance',    sub: 'Theme & display'         },
    { id: 'danger',        icon: Trash2,  label: 'Danger Zone',   sub: 'Delete account', isDanger: true },
  ];

  /* ── Reusable sub-components ── */

  const ToggleSwitch = ({ name, checked, onChange, label, desc }) => (
    <div style={S.toggleRow}>
      <div style={{ flex: 1 }}>
        <span style={S.toggleLabel}>{label}</span>
        {desc && <span style={S.toggleDesc}>{desc}</span>}
      </div>
      <label style={S.switchWrap}>
        <input type="checkbox" name={name} checked={checked} onChange={onChange} style={{ opacity:0, width:0, height:0, position:'absolute' }} />
        <span style={{ ...S.sliderTrack, background: checked ? 'var(--color-primary)' : 'var(--color-border-default)' }}>
          <span style={{ ...S.sliderKnob, transform: checked ? 'translateX(20px)' : 'translateX(0)' }} />
        </span>
      </label>
    </div>
  );

  const focusIn  = e => { e.target.style.borderColor = 'var(--color-primary)'; e.target.style.boxShadow = '0 0 0 3px rgba(43,100,212,0.11)'; };
  const focusOut = e => { e.target.style.borderColor = 'var(--color-border-default)'; e.target.style.boxShadow = 'none'; };
  const focusInDanger  = e => { e.target.style.borderColor = 'var(--color-error)'; e.target.style.boxShadow = '0 0 0 3px rgba(204,46,46,0.1)'; };

  const InputField = ({ label, icon: Icon, type='text', name, value, onChange, disabled, placeholder, hint }) => (
    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
      <label style={S.label}>{label}</label>
      <div style={{ position:'relative' }}>
        {Icon && <Icon size={15} style={S.inputIcon} />}
        <input
          type={type} name={name} value={value} onChange={onChange}
          disabled={disabled} placeholder={placeholder}
          style={{ ...S.input, paddingLeft: Icon ? 38 : 14,
            background: disabled ? 'var(--color-neutral-100)' : 'var(--color-surface-primary)',
            color: disabled ? 'var(--color-text-muted)' : 'var(--color-text-primary)',
            cursor: disabled ? 'not-allowed' : 'text' }}
          onFocus={disabled ? undefined : focusIn}
          onBlur={disabled ? undefined : focusOut}
        />
      </div>
      {hint && <p style={S.hint}>{hint}</p>}
    </div>
  );

  const Card = ({ badge, title, children, danger }) => (
    <div style={{ ...S.card, ...(danger ? S.cardDanger : {}) }}>
      {badge && <span style={{ ...S.badge, ...(danger ? S.badgeDanger : {}) }}>{badge}</span>}
      {title && <h3 style={{ ...S.cardTitle, ...(danger ? { color:'var(--color-error)' } : {}) }}>{title}</h3>}
      {children}
    </div>
  );

  const PrimaryBtn = ({ onClick, loading: l, label, danger }) => (
    <button onClick={onClick} disabled={l}
      style={{ ...S.btn,
        background: danger ? 'var(--color-error)' : 'var(--color-primary)',
        boxShadow: danger ? '0 4px 14px rgba(204,46,46,0.25)' : '0 4px 14px rgba(43,100,212,0.25)',
        opacity: l ? 0.65 : 1, cursor: l ? 'not-allowed' : 'pointer' }}
      onMouseEnter={e => { if (!l) e.currentTarget.style.transform = 'translateY(-1px)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'none'; }}>
      {l ? <><span style={S.spinner} />{label.includes('Delete') ? 'Deleting…' : 'Saving…'}</> : <><Save size={13} />{label}</>}
    </button>
  );

  return (
    <div style={S.root}>
      {/* Ambient orbs */}
      <div style={S.orb1} />
      <div style={S.orb2} />

      <div style={S.wrap}>
        {alert && <div style={{ marginBottom: 20 }}><Alert type={alert.type} message={alert.message} /></div>}

        {/* ── PAGE HEADER ── */}
        <div style={S.pageHeader}>
          <div>
            <div style={S.pageBadge}><Sparkles size={12} />Settings</div>
            <h1 style={S.pageTitle}>Your Workspace</h1>
            <p style={S.pageSub}>Manage your profile, security, and writing preferences.</p>
          </div>
          {user && (
            <div style={S.userChip}>
              <div style={S.chipAvatar}>
                {formData.avatar
                  ? <img src={formData.avatar} alt="av" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                  : <span>{formData.firstName?.[0]?.toUpperCase() || 'U'}</span>}
              </div>
              <div>
                <p style={S.chipName}>{formData.firstName} {formData.lastName}</p>
                <p style={S.chipEmail}>{formData.email}</p>
              </div>
            </div>
          )}
        </div>

        {/* ── TWO-COLUMN LAYOUT ── */}
        <div style={S.layout}>

          {/* Sidebar */}
          <nav style={S.sidebar}>
            <p style={S.navGroup}>Preferences</p>
            {tabs.map(t => {
              const Icon = t.icon;
              const active = activeTab === t.id;
              return (
                <button key={t.id} onClick={() => setActiveTab(t.id)}
                  style={{ ...S.navBtn,
                    background: active ? (t.isDanger ? 'rgba(204,46,46,0.07)' : 'rgba(43,100,212,0.07)') : 'transparent',
                    border: active ? (t.isDanger ? '1px solid rgba(204,46,46,0.2)' : '1px solid rgba(43,100,212,0.18)') : '1px solid transparent' }}
                  onMouseEnter={e => { if (!active) e.currentTarget.style.background = 'var(--color-neutral-100)'; }}
                  onMouseLeave={e => { if (!active) e.currentTarget.style.background = 'transparent'; }}>
                  <div style={{ ...S.navIcon,
                    background: active && !t.isDanger ? 'var(--color-primary)' : t.isDanger ? 'rgba(204,46,46,0.09)' : 'var(--color-neutral-100)',
                    color: active && !t.isDanger ? '#fff' : t.isDanger ? 'var(--color-error)' : 'var(--color-text-secondary)' }}>
                    <Icon size={15} />
                  </div>
                  <div style={{ flex:1, textAlign:'left' }}>
                    <span style={{ display:'block', fontSize:13, fontWeight:600, color: t.isDanger ? 'var(--color-error)' : 'var(--color-text-primary)' }}>{t.label}</span>
                    <span style={{ display:'block', fontSize:11, color: t.isDanger ? 'rgba(204,46,46,0.55)' : 'var(--color-text-muted)', marginTop:1 }}>{t.sub}</span>
                  </div>
                  {active && <span style={{ width:6, height:6, borderRadius:'50%', background: t.isDanger ? 'var(--color-error)' : 'var(--color-primary)', flexShrink:0 }} />}
                </button>
              );
            })}
          </nav>

          {/* Content */}
          <main style={S.main}>

            {/* ══ PROFILE ══ */}
            {activeTab === 'profile' && (
              <div style={S.tabIn}>
                <div><h2 style={S.tabH}>Profile Settings</h2><p style={S.tabSub}>Your public identity on Zarrin — make it shine.</p></div>

                <Card title="Profile Picture" badge="Photo">
                  <div style={S.avatarRow}>
                    <div style={S.avatarCircle}>
                      {previewAvatar
                        ? <img src={previewAvatar} alt="preview" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                        : formData.avatar
                          ? <img src={formData.avatar} alt="avatar" style={{ width:'100%', height:'100%', objectFit:'cover' }} />
                          : <span style={{ fontSize:'2rem', fontFamily:"'Playfair Display',serif", fontWeight:800, color:'#fff' }}>{formData.firstName?.[0]?.toUpperCase() || 'U'}</span>}
                      <label htmlFor="avatar-input" style={S.avatarHover}><Camera size={18} color="#fff" /></label>
                      <input id="avatar-input" type="file" accept="image/*" onChange={handleAvatarChange} style={{ display:'none' }} />
                    </div>
                    <div>
                      <p style={{ fontFamily:"'Playfair Display',serif", fontWeight:700, fontSize:'1.05rem', color:'var(--color-text-primary)', marginBottom:2 }}>{formData.firstName||'Your'} {formData.lastName||'Name'}</p>
                      <p style={{ fontSize:12, color:'var(--color-text-muted)', marginBottom:14 }}>@{formData.username||'username'}</p>
                      <div style={{ display:'flex', gap:8, flexWrap:'wrap', alignItems:'center' }}>
                        <label htmlFor="avatar-input" style={S.uploadBtn}><Upload size={12} />Upload Photo</label>
                        {previewAvatar && (
                          <button onClick={handleAvatarUpload} disabled={avatarLoading} style={{ ...S.btn, background:'var(--color-primary)', boxShadow:'0 4px 14px rgba(43,100,212,0.25)', cursor: avatarLoading?'not-allowed':'pointer', opacity: avatarLoading?0.65:1 }}>
                            {avatarLoading ? <><span style={S.spinner}/>Uploading…</> : <><CheckCircle size={13}/>Save Photo</>}
                          </button>
                        )}
                      </div>
                      <p style={{ ...S.hint, marginTop:10 }}>JPG, PNG or GIF · Max 2MB</p>
                    </div>
                  </div>
                </Card>

                <Card title="Basic Information" badge="Info">
                  <div style={S.grid2}>
                    <InputField label="First Name" icon={User} name="firstName" value={formData.firstName} onChange={handleInputChange} placeholder="First name" />
                    <InputField label="Last Name" icon={User} name="lastName" value={formData.lastName} onChange={handleInputChange} placeholder="Last name" />
                  </div>
                  <div style={{ marginTop:16, display:'flex', flexDirection:'column', gap:6 }}>
                    <label style={S.label}>Bio</label>
                    <div style={{ position:'relative' }}>
                      <Edit3 size={14} style={{ position:'absolute', top:13, left:13, color:'var(--color-text-muted)', pointerEvents:'none' }} />
                      <textarea name="bio" value={formData.bio} onChange={handleInputChange} rows={4}
                        placeholder="Tell the world about yourself…"
                        style={S.textarea}
                        onFocus={focusIn} onBlur={focusOut} />
                    </div>
                    <p style={S.hint}>{formData.bio?.length||0} / 300 characters</p>
                  </div>
                  <div style={{ ...S.grid2, marginTop:16 }}>
                    <InputField label="Website" icon={Globe} type="url" name="website" value={formData.website} onChange={handleInputChange} placeholder="https://yoursite.com" />
                    <InputField label="Location" icon={MapPin} name="location" value={formData.location} onChange={handleInputChange} placeholder="City, Country" />
                  </div>
                  <div style={S.footer}><PrimaryBtn onClick={handleSaveProfile} loading={loading} label="Save Profile" /></div>
                </Card>
              </div>
            )}

            {/* ══ ACCOUNT ══ */}
            {activeTab === 'account' && (
              <div style={S.tabIn}>
                <div><h2 style={S.tabH}>Account Settings</h2><p style={S.tabSub}>Keep your account secure with a strong password.</p></div>

                <Card title="Email Address" badge="Identity">
                  <InputField label="Registered Email" icon={Mail} type="email" name="email" value={formData.email} disabled hint="Your email address is permanent and cannot be changed." />
                </Card>

                <Card title="Change Password" badge="Security">
                  <div style={{ display:'flex', alignItems:'center', gap:9, padding:'11px 14px', background:'var(--color-info-bg)', border:'1px solid rgba(74,127,165,0.2)', borderRadius:10, marginBottom:18 }}>
                    <Lock size={13} style={{ color:'var(--color-info)', flexShrink:0 }} />
                    <span style={{ fontSize:12, color:'var(--color-text-secondary)' }}>Use at least 8 characters, including a number and a symbol.</span>
                  </div>
                  <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                    <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                      <label style={S.label}>Current Password</label>
                      <div style={{ position:'relative' }}>
                        <Lock size={15} style={S.inputIcon} />
                        <input type={showPassword?'text':'password'} name="currentPassword" value={passwordData.currentPassword} onChange={handlePasswordChange}
                          placeholder="Current password" style={{ ...S.input, paddingLeft:38, paddingRight:42 }} onFocus={focusIn} onBlur={focusOut} />
                        <button type="button" onClick={()=>setShowPassword(!showPassword)} style={S.eyeBtn}>
                          {showPassword ? <EyeOff size={15}/> : <Eye size={15}/>}
                        </button>
                      </div>
                    </div>
                    <div style={S.grid2}>
                      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                        <label style={S.label}>New Password</label>
                        <div style={{ position:'relative' }}>
                          <Lock size={15} style={S.inputIcon} />
                          <input type={showPassword?'text':'password'} name="newPassword" value={passwordData.newPassword} onChange={handlePasswordChange}
                            placeholder="New password" style={{ ...S.input, paddingLeft:38 }} onFocus={focusIn} onBlur={focusOut} />
                        </div>
                      </div>
                      <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                        <label style={S.label}>Confirm Password</label>
                        <div style={{ position:'relative' }}>
                          <Lock size={15} style={S.inputIcon} />
                          <input type={showPassword?'text':'password'} name="confirmPassword" value={passwordData.confirmPassword} onChange={handlePasswordChange}
                            placeholder="Confirm password" style={{ ...S.input, paddingLeft:38 }} onFocus={focusIn} onBlur={focusOut} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={S.footer}><PrimaryBtn onClick={handleChangePassword} loading={loading} label="Update Password" /></div>
                </Card>
              </div>
            )}

            {/* ══ NOTIFICATIONS ══ */}
            {activeTab === 'notifications' && (
              <div style={S.tabIn}>
                <div><h2 style={S.tabH}>Notifications & Privacy</h2><p style={S.tabSub}>Control how and when Zarrin reaches out to you.</p></div>

                <Card title="Writing Preferences" badge="Writing">
                  <p style={S.cardSub}>Control how your published posts behave by default.</p>
                  <ToggleSwitch name="allowComments"   checked={formData.allowComments}   onChange={handleInputChange} label="Allow comments on my posts"      desc="Readers can leave comments on your articles" />
                  <ToggleSwitch name="showReadingTime" checked={formData.showReadingTime} onChange={handleInputChange} label="Show estimated reading time"      desc="Displays reading time at the top of every post" />
                  <ToggleSwitch name="autoSaveDrafts"  checked={formData.autoSaveDrafts}  onChange={handleInputChange} label="Auto-save drafts"                 desc="Saves your work every 30 seconds automatically" />
                  <div style={S.footer}><PrimaryBtn onClick={handleSaveWritingPreferences} loading={loading} label="Save Preferences" /></div>
                </Card>

                <Card title="Privacy Settings" badge="Privacy">
                  <p style={S.cardSub}>Manage who can see your profile and activity.</p>
                  <ToggleSwitch name="profileVisibility" checked={formData.profileVisibility} onChange={handleInputChange} label="Make profile public"       desc="Anyone can discover and view your profile" />
                  <ToggleSwitch name="showActivity"      checked={formData.showActivity}      onChange={handleInputChange} label="Show my reading activity"  desc="Followers can see what you've been reading" />
                  <div style={S.footer}><PrimaryBtn onClick={handleSavePrivacy} loading={loading} label="Save Privacy" /></div>
                </Card>

                <Card title="Email & Push Notifications" badge="Alerts">
                  <p style={S.cardSub}>Choose which events trigger a notification.</p>
                  <ToggleSwitch name="emailFollowers"    checked={formData.emailFollowers}    onChange={handleInputChange} label="New follower email"      desc="Get notified when someone follows you" />
                  <ToggleSwitch name="emailComments"     checked={formData.emailComments}     onChange={handleInputChange} label="New comment email"       desc="Notifications when readers comment on your posts" />
                  <ToggleSwitch name="emailLikes"        checked={formData.emailLikes}        onChange={handleInputChange} label="Post likes email"        desc="Get notified when someone likes your post" />
                  <ToggleSwitch name="emailDigest"       checked={formData.emailDigest}       onChange={handleInputChange} label="Weekly digest"           desc="A weekly round-up of your stats and top posts" />
                  <ToggleSwitch name="pushNotifications" checked={formData.pushNotifications} onChange={handleInputChange} label="Push notifications"      desc="Enable browser push notifications" />
                  <ToggleSwitch name="pushMentions"      checked={formData.pushMentions}      onChange={handleInputChange} label="Mention alerts"          desc="Get notified when someone @mentions you" />
                  <div style={S.footer}><PrimaryBtn onClick={handleSaveNotifications} loading={loading} label="Save Notifications" /></div>
                </Card>
              </div>
            )}

            {/* ══ APPEARANCE ══ */}
            {activeTab === 'appearance' && (
              <div style={S.tabIn}>
                <div><h2 style={S.tabH}>Appearance</h2><p style={S.tabSub}>Personalize how Zarrin looks and feels.</p></div>
                <Card title="Theme" badge="Display">
                  <div style={{ display:'flex', alignItems:'flex-start', gap:16, background:'var(--color-neutral-100)', border:'1px solid var(--color-border-light)', borderRadius:12, padding:18 }}>
                    <div style={{ width:48, height:48, flexShrink:0, borderRadius:12, background:'var(--gradient-primary)', display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Palette size={22} color="#fff" />
                    </div>
                    <div>
                      <p style={{ fontSize:14, fontWeight:600, color:'var(--color-text-primary)', marginBottom:5 }}>Theme is managed via the Navbar</p>
                      <p style={{ fontSize:12, color:'var(--color-text-secondary)', lineHeight:1.65 }}>
                        Use the theme toggle in the top navigation bar to switch between Light, Dark, and System modes. Your preference is saved automatically.
                      </p>
                    </div>
                  </div>
                </Card>
              </div>
            )}

            {/* ══ DANGER ZONE ══ */}
            {activeTab === 'danger' && (
              <div style={S.tabIn}>
                <div><h2 style={{ ...S.tabH, color:'var(--color-error)' }}>Danger Zone</h2><p style={S.tabSub}>Irreversible actions — please read carefully.</p></div>

                <div style={{ display:'flex', alignItems:'flex-start', gap:13, background:'var(--color-error-bg)', border:'1px solid rgba(204,46,46,0.22)', borderRadius:14, padding:'16px 18px' }}>
                  <AlertTriangle size={18} style={{ color:'var(--color-error)', flexShrink:0, marginTop:1 }} />
                  <div>
                    <p style={{ fontSize:13, fontWeight:600, color:'var(--color-error)', marginBottom:3 }}>These actions are permanent</p>
                    <p style={{ fontSize:12, color:'var(--color-text-secondary)', lineHeight:1.55 }}>Once completed, they cannot be undone. All your content and data will be erased forever.</p>
                  </div>
                </div>

                <Card title="Delete Account" badge="⚠️ Permanent" danger>
                  <p style={S.cardSub}>Deleting your account will permanently remove:</p>
                  <div style={{ display:'flex', flexDirection:'column', gap:8, marginBottom:4 }}>
                    {['Your profile and personal information','All published blog posts and drafts','All uploaded images and media files','Your comments, likes, and interactions','Your followers and following lists'].map((item,i)=>(
                      <div key={i} style={{ display:'flex', alignItems:'center', gap:8, fontSize:12, color:'var(--color-text-secondary)' }}>
                        <X size={13} style={{ color:'var(--color-error)', flexShrink:0 }} />{item}
                      </div>
                    ))}
                  </div>
                  <div style={S.footer}><PrimaryBtn onClick={()=>setShowDeleteConfirm(true)} loading={false} label="Delete My Account" danger /></div>
                </Card>
              </div>
            )}

          </main>
        </div>{/* end layout */}
      </div>{/* end wrap */}

      {/* ══ DELETE MODAL ══ */}
      {showDeleteConfirm && (
        <div style={S.backdrop}>
          <div style={S.modal}>
            <div style={S.modalHead}>
              <div style={S.modalHIcon}><Trash2 size={19} color="var(--color-error)" /></div>
              <div style={{ flex:1 }}>
                <h3 style={{ fontFamily:"'Playfair Display',serif", fontSize:'1.1rem', fontWeight:700, color:'var(--color-error)' }}>Delete Your Account?</h3>
                <p style={{ fontSize:11, color:'var(--color-text-muted)' }}>This cannot be undone.</p>
              </div>
              <button onClick={()=>{ setShowDeleteConfirm(false); setDeleteConfirmText(''); setDeletePassword(''); }} style={S.modalX}>
                <X size={17} />
              </button>
            </div>
            <div style={S.modalBody}>
              <p style={{ fontSize:13, color:'var(--color-text-secondary)', lineHeight:1.65 }}>
                You are about to <strong style={{ color:'var(--color-text-primary)' }}>permanently delete</strong> your Zarrin account. All posts, comments, followers, and media will be erased with no recovery option.
              </p>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <label style={S.label}>
                  Type <code style={{ fontSize:11, background:'var(--color-neutral-100)', border:'1px solid var(--color-border-default)', borderRadius:5, padding:'2px 7px', fontFamily:'monospace', color:'var(--color-error)' }}>DELETE MY ACCOUNT</code> to confirm:
                </label>
                <input type="text" value={deleteConfirmText} onChange={e=>setDeleteConfirmText(e.target.value)}
                  placeholder="DELETE MY ACCOUNT" style={{ ...S.input, fontFamily:'monospace' }}
                  onFocus={focusInDanger} onBlur={focusOut} />
              </div>
              <div style={{ display:'flex', flexDirection:'column', gap:6 }}>
                <label style={S.label}>Enter your password:</label>
                <input type="password" value={deletePassword} onChange={e=>setDeletePassword(e.target.value)}
                  placeholder="Your account password" style={S.input}
                  onFocus={focusInDanger} onBlur={focusOut} />
              </div>
            </div>
            <div style={S.modalFoot}>
              <button onClick={()=>{ setShowDeleteConfirm(false); setDeleteConfirmText(''); setDeletePassword(''); }}
                disabled={loading} style={S.cancelBtn}
                onMouseEnter={e=>e.currentTarget.style.background='var(--color-neutral-200)'}
                onMouseLeave={e=>e.currentTarget.style.background='var(--color-neutral-100)'}>
                Cancel
              </button>
              <button onClick={handleDeleteAccount}
                disabled={loading || deleteConfirmText !== 'DELETE MY ACCOUNT' || !deletePassword}
                style={{ ...S.confirmBtn, opacity:(loading || deleteConfirmText !== 'DELETE MY ACCOUNT' || !deletePassword)?0.5:1, cursor:(loading || deleteConfirmText !== 'DELETE MY ACCOUNT' || !deletePassword)?'not-allowed':'pointer' }}>
                {loading ? <><span style={S.spinner}/>Deleting…</> : <><Trash2 size={13}/>Delete Forever</>}
              </button>
            </div>
          </div>
        </div>
      )}

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,800;1,700&family=Outfit:wght@300;400;500;600;700&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes zsFadeUp { from { opacity:0; transform:translateY(16px); } to { opacity:1; transform:translateY(0); } }
        @keyframes zsSpin   { to { transform:rotate(360deg); } }

        /* Avatar hover trick via CSS since we can't use onMouseEnter on a div with child label */
        .zs-av-circle:hover .zs-av-overlay { opacity: 1 !important; }

        /* Responsive two-col layout */
        @media (max-width: 860px) {
          .zs-layout { grid-template-columns: 1fr !important; }
          .zs-sidebar { position: static !important; flex-direction: row !important; flex-wrap: wrap !important; padding: 12px !important; }
          .zs-nav-btn-wrap { flex: 1; min-width: 130px; }
        }
        @media (max-width: 540px) {
          .zs-grid2 { grid-template-columns: 1fr !important; }
          .zs-root-pad { padding: 24px 14px 60px !important; }
        }
      `}</style>
    </div>
  );
};

/* ─────────────────────────────────────────
   Style objects — 100% CSS custom properties
   No Tailwind, no dark: classes
───────────────────────────────────────── */
const S = {
  root: {
    fontFamily: "'Outfit', sans-serif",
    background: 'var(--color-neutral-50)',
    minHeight: '100vh',
    padding: '44px 22px 90px',
    position: 'relative',
    overflowX: 'hidden',
  },
  orb1: {
    position:'fixed', borderRadius:'50%', filter:'blur(100px)',
    pointerEvents:'none', zIndex:0,
    width:500, height:500, top:-140, left:-140,
    background:'rgba(43,100,212,0.05)',
  },
  orb2: {
    position:'fixed', borderRadius:'50%', filter:'blur(90px)',
    pointerEvents:'none', zIndex:0,
    width:400, height:400, bottom:0, right:-100,
    background:'rgba(112,64,204,0.04)',
  },
  wrap: { maxWidth:1100, margin:'0 auto', position:'relative', zIndex:1 },

  /* Header */
  pageHeader: { display:'flex', alignItems:'flex-start', justifyContent:'space-between', gap:20, marginBottom:36, flexWrap:'wrap' },
  pageBadge: {
    display:'inline-flex', alignItems:'center', gap:6,
    background:'rgba(43,100,212,0.08)', border:'1px solid rgba(43,100,212,0.2)',
    color:'var(--color-primary)', fontSize:11, fontWeight:600,
    letterSpacing:'0.07em', textTransform:'uppercase',
    padding:'6px 14px', borderRadius:100, marginBottom:10,
  },
  pageTitle: {
    fontFamily:"'Playfair Display', serif", fontWeight:800,
    fontSize:'clamp(1.8rem,4vw,2.5rem)', lineHeight:1.1,
    color:'var(--color-text-primary)', marginBottom:6,
  },
  pageSub: { fontSize:14, color:'var(--color-text-secondary)', fontWeight:300 },
  userChip: {
    display:'flex', alignItems:'center', gap:12,
    background:'var(--color-surface-primary)',
    border:'1px solid var(--color-border-light)',
    borderRadius:16, padding:'12px 18px',
    boxShadow:'var(--card-shadow)',
  },
  chipAvatar: {
    width:44, height:44, borderRadius:'50%',
    background:'var(--gradient-primary)',
    display:'flex', alignItems:'center', justifyContent:'center',
    color:'#fff', fontWeight:700, fontSize:18,
    fontFamily:"'Playfair Display', serif",
    overflow:'hidden', flexShrink:0,
  },
  chipName:  { fontSize:13, fontWeight:600, color:'var(--color-text-primary)' },
  chipEmail: { fontSize:11, color:'var(--color-text-muted)' },

  /* Layout */
  layout: { display:'grid', gridTemplateColumns:'255px 1fr', gap:22, alignItems:'start' },

  /* Sidebar */
  sidebar: {
    background:'var(--color-surface-primary)',
    border:'1px solid var(--color-border-light)',
    borderRadius:20, padding:'18px 12px',
    position:'sticky', top:24,
    boxShadow:'var(--card-shadow)',
  },
  navGroup: {
    fontSize:10, fontWeight:600, letterSpacing:'0.1em',
    textTransform:'uppercase', color:'var(--color-text-muted)',
    padding:'0 10px', marginBottom:10,
  },
  navBtn: {
    width:'100%', display:'flex', alignItems:'center', gap:11,
    padding:'10px 12px', borderRadius:12,
    cursor:'pointer', transition:'all 0.18s',
    marginBottom:3, fontFamily:"'Outfit', sans-serif",
    outline:'none',
  },
  navIcon: {
    width:33, height:33, borderRadius:9,
    display:'flex', alignItems:'center', justifyContent:'center',
    flexShrink:0, transition:'all 0.18s',
  },

  /* Main */
  main: { display:'flex', flexDirection:'column', gap:18 },
  tabIn: { animation:'zsFadeUp 0.26s ease both', display:'flex', flexDirection:'column', gap:18 },
  tabH: {
    fontFamily:"'Playfair Display', serif", fontSize:'1.6rem',
    fontWeight:800, color:'var(--color-text-primary)', marginBottom:4,
  },
  tabSub: { fontSize:13, color:'var(--color-text-secondary)', fontWeight:300 },

  /* Cards */
  card: {
    background:'var(--color-surface-primary)',
    border:'1px solid var(--color-border-light)',
    borderRadius:'var(--card-border-radius-lg)',
    padding:'24px 26px',
    boxShadow:'var(--card-shadow)',
  },
  cardDanger: { borderColor:'rgba(204,46,46,0.22)', background:'#fffbfb' },
  badge: {
    display:'inline-block', fontSize:10, fontWeight:600,
    letterSpacing:'0.08em', textTransform:'uppercase',
    color:'var(--color-primary)', background:'rgba(43,100,212,0.08)',
    borderRadius:100, padding:'4px 10px', marginBottom:10,
  },
  badgeDanger: { color:'var(--color-error)', background:'rgba(204,46,46,0.08)' },
  cardTitle: {
    fontFamily:"'Playfair Display', serif", fontSize:'1.05rem',
    fontWeight:700, color:'var(--color-text-primary)', marginBottom:18,
  },
  cardSub: { fontSize:12, color:'var(--color-text-secondary)', marginBottom:14, lineHeight:1.6 },
  footer: { marginTop:20, paddingTop:18, borderTop:'1px solid var(--color-border-light)' },

  /* Avatar */
  avatarRow: { display:'flex', alignItems:'center', gap:22, flexWrap:'wrap' },
  avatarCircle: {
    width:90, height:90, borderRadius:'50%',
    background:'var(--gradient-primary)',
    display:'flex', alignItems:'center', justifyContent:'center',
    overflow:'hidden', flexShrink:0, position:'relative',
    border:'3px solid var(--color-border-default)',
    boxShadow:'0 6px 20px rgba(43,100,212,0.18)',
  },
  avatarHover: {
    position:'absolute', inset:0,
    background:'rgba(0,0,0,0.42)',
    display:'flex', alignItems:'center', justifyContent:'center',
    opacity:0, cursor:'pointer', borderRadius:'50%',
    transition:'opacity 0.2s',
  },
  uploadBtn: {
    display:'inline-flex', alignItems:'center', gap:6,
    padding:'8px 16px', borderRadius:9,
    background:'var(--color-neutral-100)',
    border:'1px solid var(--color-border-default)',
    color:'var(--color-text-primary)',
    fontSize:12, fontWeight:600, cursor:'pointer',
    fontFamily:"'Outfit', sans-serif", transition:'all 0.18s',
  },

  /* Form */
  grid2: { display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 },
  label: { fontSize:12, fontWeight:600, color:'var(--color-text-secondary)', letterSpacing:'0.03em' },
  input: {
    width:'100%', padding:'11px 14px',
    border:'1.5px solid var(--color-border-default)',
    borderRadius:10, fontFamily:"'Outfit', sans-serif", fontSize:13,
    color:'var(--color-text-primary)', background:'var(--color-surface-primary)',
    transition:'border-color 0.18s, box-shadow 0.18s', outline:'none',
  },
  inputIcon: {
    position:'absolute', left:13, top:'50%', transform:'translateY(-50%)',
    color:'var(--color-text-muted)', pointerEvents:'none',
  },
  textarea: {
    width:'100%', padding:'11px 14px 11px 36px',
    border:'1.5px solid var(--color-border-default)',
    borderRadius:10, fontFamily:"'Outfit', sans-serif", fontSize:13,
    color:'var(--color-text-primary)', background:'var(--color-surface-primary)',
    resize:'vertical', outline:'none', lineHeight:1.65,
    transition:'border-color 0.18s, box-shadow 0.18s',
  },
  hint: { fontSize:11, color:'var(--color-text-muted)' },
  eyeBtn: {
    position:'absolute', right:12, top:'50%', transform:'translateY(-50%)',
    background:'none', border:'none', cursor:'pointer',
    color:'var(--color-text-muted)', display:'flex', alignItems:'center',
  },

  /* Toggle */
  toggleRow: {
    display:'flex', alignItems:'center', justifyContent:'space-between',
    gap:16, padding:'14px 0', borderBottom:'1px solid var(--color-border-light)',
  },
  toggleLabel: { display:'block', fontSize:13, fontWeight:500, color:'var(--color-text-primary)' },
  toggleDesc: { display:'block', fontSize:11, color:'var(--color-text-muted)', marginTop:2 },
  switchWrap: { position:'relative', display:'inline-block', width:44, height:24, flexShrink:0, cursor:'pointer' },
  sliderTrack: {
    position:'absolute', inset:0, borderRadius:100,
    transition:'background 0.22s',
  },
  sliderKnob: {
    position:'absolute', width:18, height:18,
    background:'#fff', borderRadius:'50%',
    top:3, left:3, transition:'transform 0.22s',
    boxShadow:'0 1px 4px rgba(0,0,0,0.18)',
  },

  /* Buttons */
  btn: {
    display:'inline-flex', alignItems:'center', gap:7,
    padding:'10px 22px', borderRadius:10,
    fontFamily:"'Outfit', sans-serif", fontSize:13, fontWeight:600,
    color:'#fff', border:'none', transition:'all 0.2s',
  },
  spinner: {
    width:13, height:13, display:'inline-block',
    border:'2px solid rgba(255,255,255,0.3)',
    borderTopColor:'#fff', borderRadius:'50%',
    animation:'zsSpin 0.6s linear infinite', flexShrink:0,
  },

  /* Modal */
  backdrop: {
    position:'fixed', inset:0, background:'rgba(17,17,16,0.46)',
    backdropFilter:'blur(8px)',
    display:'flex', alignItems:'center', justifyContent:'center',
    zIndex:100, padding:20,
  },
  modal: {
    background:'var(--color-surface-primary)',
    borderRadius:22, maxWidth:480, width:'100%',
    boxShadow:'var(--card-shadow-elevated)', overflow:'hidden',
    animation:'zsFadeUp 0.22s ease both',
  },
  modalHead: {
    display:'flex', alignItems:'center', gap:14,
    padding:'22px 24px 18px',
    borderBottom:'1px solid var(--color-border-light)',
  },
  modalHIcon: {
    width:42, height:42, flexShrink:0, borderRadius:11,
    background:'var(--color-error-bg)',
    display:'flex', alignItems:'center', justifyContent:'center',
  },
  modalX: {
    marginLeft:'auto', background:'none', border:'none', cursor:'pointer',
    color:'var(--color-text-muted)', padding:6,
    display:'flex', alignItems:'center', borderRadius:8, transition:'all 0.18s',
  },
  modalBody: { padding:'20px 24px', display:'flex', flexDirection:'column', gap:16 },
  modalFoot: {
    display:'flex', gap:10, padding:'16px 24px 22px',
    borderTop:'1px solid var(--color-border-light)',
  },
  cancelBtn: {
    flex:1, padding:'11px 16px', borderRadius:10,
    background:'var(--color-neutral-100)',
    border:'1px solid var(--color-border-default)',
    fontFamily:"'Outfit', sans-serif", fontSize:13, fontWeight:600,
    color:'var(--color-text-primary)', cursor:'pointer', transition:'all 0.18s',
  },
  confirmBtn: {
    flex:1, padding:'11px 16px', borderRadius:10,
    background:'var(--color-error)', color:'#fff',
    fontFamily:"'Outfit', sans-serif", fontSize:13, fontWeight:600,
    border:'none', transition:'all 0.2s',
    display:'flex', alignItems:'center', justifyContent:'center', gap:7,
    boxShadow:'0 4px 14px rgba(204,46,46,0.25)',
  },
};

export default Settings;