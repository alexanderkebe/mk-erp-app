import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, FileText, Bell, Settings,
  ChevronRight, TrendingUp, CheckCircle, Clock, Activity,
  LogOut, Menu, X, Building2, Globe, Shield,
  BookOpen, Wallet, GraduationCap, Calendar
} from 'lucide-react';

/* ── Mock user data ───────────────────────────────────────────────────────── */
const MOCK_USER = {
  fullName: 'Abebe Bikila',
  role: 'Coordinator',
  department: 'Main Office',
  initials: 'AB',
};

const STAT_CARDS = [
  { label: 'Active Members', value: '1,240', icon: Users, color: '#0ea5e9', change: '+12%' },
  { label: 'Reports Submitted', value: '87', icon: FileText, color: '#6366f1', change: '+5%' },
  { label: 'Pending Approvals', value: '14', icon: Clock, color: '#f59e0b', change: '-3' },
  { label: 'Regional Branches', value: '5', icon: Globe, color: '#22c55e', change: 'Active' },
];

const RECENT = [
  { title: 'Saris Branch Monthly Report', time: '2 hours ago', status: 'pending', dept: 'Saris & Gofa' },
  { title: 'Project Department Budget Review', time: '5 hours ago', status: 'approved', dept: 'Project' },
  { title: 'Akaki Region Membership Update', time: 'Yesterday', status: 'approved', dept: 'Akaki' },
  { title: 'Spiritual School Exam Results', time: 'Yesterday', status: 'pending', dept: 'Spiritual' },
  { title: 'Gospel Distance Program Q1', time: '2 days ago', status: 'approved', dept: 'Gospel' },
];

/* ── Loading Screen ──────────────────────────────────────────────────────── */
const LoadingScreen = ({ onDone }) => {
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState('Authenticating...');

  useEffect(() => {
    const steps = [
      { p: 30, t: 'Loading departments...' },
      { p: 60, t: 'Fetching reports...' },
      { p: 85, t: 'Preparing dashboard...' },
      { p: 100, t: 'Almost ready!' },
    ];
    let delay = 400;
    steps.forEach(({ p, t }) => {
      setTimeout(() => {
        setProgress(p);
        setStatusText(t);
        if (p === 100) setTimeout(onDone, 600);
      }, delay);
      delay += 600;
    });
  }, [onDone]);

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0, scale: 1.05 }}
      transition={{ duration: 0.5 }}
      style={{
        minHeight: '100vh',
        background: 'linear-gradient(145deg, #0f172a 0%, #1e1b4b 50%, #0f172a 100%)',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '2.5rem',
      }}
    >
      {/* Logo */}
      <motion.div
        initial={{ scale: 0, rotate: -20 }}
        animate={{ scale: 1, rotate: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
      >
        <div style={{
          width: '96px', height: '96px', borderRadius: '50%',
          overflow: 'hidden',
          boxShadow: '0 0 60px rgba(99,102,241,0.4), 0 0 0 4px rgba(255,255,255,0.15)',
          backgroundColor: '#fff',
        }}>
          <img src="/mk logo.png" alt="Mahibere Kidusan" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
        </div>
      </motion.div>

      {/* Title */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ textAlign: 'center' }}
      >
        <h1 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: '800', marginBottom: '0.4rem', letterSpacing: '-0.5px' }}>
          ማኅበረ ቅዱሳን System
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
          Joint Service Management Portal
        </p>
      </motion.div>

      {/* Progress */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        style={{ width: '280px' }}
      >
        <div style={{
          height: '6px', backgroundColor: 'rgba(255,255,255,0.1)',
          borderRadius: '6px', overflow: 'hidden', marginBottom: '1rem',
        }}>
          <motion.div
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.5, ease: 'easeOut' }}
            style={{
              height: '100%',
              background: 'linear-gradient(90deg, #0ea5e9, #6366f1)',
              borderRadius: '6px',
              boxShadow: '0 0 12px rgba(99,102,241,0.6)',
            }}
          />
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <motion.p
            key={statusText}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            style={{ color: 'rgba(255,255,255,0.6)', fontSize: '0.8rem' }}
          >
            {statusText}
          </motion.p>
          <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.8rem', fontWeight: '600' }}>
            {progress}%
          </span>
        </div>
      </motion.div>

      {/* Dots */}
      <div style={{ display: 'flex', gap: '8px' }}>
        {[0, 1, 2].map(i => (
          <motion.div
            key={i}
            animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.1, 0.8] }}
            transition={{ duration: 1.2, repeat: Infinity, delay: i * 0.25 }}
            style={{ width: '8px', height: '8px', borderRadius: '50%', background: '#6366f1' }}
          />
        ))}
      </div>
    </motion.div>
  );
};

/* ── Dashboard UI ─────────────────────────────────────────────────────────── */
const DashboardContent = () => {
  const navigate = useNavigate();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('Dashboard');

  useEffect(() => {
    const savedUser = localStorage.getItem('mk_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  if (!user) return null;

  const isChairman = user.position === 'chairman';
  const isSubChairman = user.position === 'sub_chairman';
  const isSecretary = user.position === 'secretary';

  // Specific Nav Items for Sub-Chairman
  const subChairmanNav = [
    { id: 'Dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'Plans', icon: Shield, label: 'Plan Management' },
    { id: 'Tasks', icon: Activity, label: 'Task Management' },
    { id: 'Analysis', icon: TrendingUp, label: 'Report Analysis' },
    { id: 'Notifications', icon: Bell, label: 'Notification', badge: 4 },
    { id: 'Settings', icon: Settings, label: 'Settings' },
  ];

  // Specific Nav Items for Secretary
  const secretaryNav = [
    { id: 'Dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'Meetings', icon: Clock, label: 'Schedule Management' },
    { id: 'SupportivePlans', icon: Shield, label: 'Supportive Plans' },
    { id: 'Reporting', icon: FileText, label: 'Reporting' },
    { id: 'Members', icon: Users, label: 'Members Management' },
    { id: 'Notifications', icon: Bell, label: 'Notification', badge: 3 },
    { id: 'Settings', icon: Settings, label: 'Settings' },
  ];

  // Chairman gets EVERYTHING from both
  const chairmanNav = [
    { id: 'Dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'Plans', icon: Shield, label: 'Plan Management' },
    { id: 'Tasks', icon: Activity, label: 'Task Management' },
    { id: 'Meetings', icon: Clock, label: 'Schedule Management' },
    { id: 'SupportivePlans', icon: Shield, label: 'Supportive Plans' },
    { id: 'Reporting', icon: FileText, label: 'Reporting' },
    { id: 'Analysis', icon: TrendingUp, label: 'Report Analysis' },
    { id: 'Members', icon: Users, label: 'Members Management' },
    { id: 'Notifications', icon: Bell, label: 'Notification', badge: 7 },
    { id: 'Settings', icon: Settings, label: 'Settings' },
  ];

  // Default Nav Items for regular members
  const regularNav = [
    { id: 'Dashboard',          icon: LayoutDashboard, label: 'Dashboard' },
    { id: 'PlansDirectives',    icon: BookOpen,        label: 'Plans & Directives' },
    { id: 'TrainingRequests',   icon: GraduationCap,   label: 'Training Requests' },
    { id: 'BudgetRequests',     icon: Wallet,          label: 'Budget Requests' },
    { id: 'Meetings',           icon: Calendar,        label: 'Meetings' },
    { id: 'Reporting',          icon: FileText,        label: 'Reporting' },
    { id: 'Notifications',      icon: Bell,            label: 'Notifications', badge: 2 },
    { id: 'Settings',           icon: Settings,        label: 'Settings' },
  ];

  const navItems = isChairman ? chairmanNav : isSubChairman ? subChairmanNav : isSecretary ? secretaryNav : regularNav;

  const renderContent = () => {
    switch (currentView) {
      case 'Dashboard':
        return (
          <>
            {/* Header */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
                  Good morning, {user.fullName.split(' ')[0]} 👋
                </h1>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem', fontSize: '0.9rem' }}>
                  {user.role === 'main_office' ? 'Main Office' : 'Regional Branch'} · {user.position.charAt(0).toUpperCase() + user.position.slice(1).replace('_', ' ')}
                </p>
              </div>
            </div>

            {/* Stat Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
              {STAT_CARDS.map(({ label, value, icon: Icon, color, change }, i) => (
                <motion.div
                  key={label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                  whileHover={{ y: -4, boxShadow: '0 16px 32px rgba(0,0,0,0.10)' }}
                  style={{
                    backgroundColor: '#fff', padding: '1.5rem', borderRadius: 'var(--radius-md)',
                    boxShadow: 'var(--shadow-sm)', border: '1px solid #f1f5f9',
                    display: 'flex', flexDirection: 'column', gap: '1rem',
                    cursor: 'default', transition: 'all 0.25s',
                  }}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}>
                      <Icon size={22} />
                    </div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: change.startsWith('+') ? '#22c55e' : change.startsWith('-') ? '#ef4444' : '#64748b', backgroundColor: change.startsWith('+') ? '#f0fdf4' : change.startsWith('-') ? '#fef2f2' : '#f8fafc', padding: '2px 8px', borderRadius: '20px' }}>
                      {change}
                    </span>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1 }}>{value}</div>
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>{label}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Role Specific Overview */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', border: '1px solid #f1f5f9' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem' }}>
                  {isSecretary || isChairman ? 'Upcoming Schedule & Plans' : 'Active Plans Overview'}
                </h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {(isSecretary || isChairman ? ['Staff Training (10 AM)', 'Executive Meeting (2 PM)', 'Digital Expansion Strategy'] : ['Strategic Expansion', 'Education Reform', 'Youth Outreach']).map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem' }}>{item}</span>
                      <div style={{ width: '100px', height: '6px', backgroundColor: '#f1f5f9', borderRadius: '3px' }}>
                        <div style={{ width: `${70 - i * 20}%`, height: '100%', backgroundColor: (isSecretary || isChairman) ? 'var(--accent)' : 'var(--primary)', borderRadius: '3px' }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', border: '1px solid #f1f5f9' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem' }}>{isSecretary || isChairman ? 'System Status & Documents' : 'Regional Performance'}</h3>
                {isSecretary || isChairman ? (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                    {['Quarterly Report Draft', 'Meeting Minutes - May 10', 'Regional Connectivity: High'].map((doc, i) => (
                      <div key={i} style={{ fontSize: '0.8rem', padding: '0.5rem', backgroundColor: '#f8fafc', borderRadius: '6px', borderLeft: '3px solid var(--accent)' }}>{doc}</div>
                    ))}
                  </div>
                ) : (
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', height: '100px', paddingBottom: '0.5rem' }}>
                    {[40, 70, 45, 90, 60].map((h, i) => (
                      <div key={i} style={{ flex: 1, height: `${h}%`, backgroundColor: 'var(--accent)', opacity: 0.7, borderRadius: '4px' }} />
                    ))}
                  </div>
                )}
              </div>
            </div>
          </>
        );
      case 'Plans':
        return (
          <div style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>Plan Management</h1>
            <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '1rem', border: '1px solid #f1f5f9' }}>
              <p style={{ color: 'var(--text-muted)' }}>Organizational-wide planning and goal setting interface.</p>
              <div style={{ marginTop: '2rem', border: '2px dashed #e2e8f0', height: '300px', borderRadius: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                Plan Builder Workspace
              </div>
            </div>
          </div>
        );
      case 'Tasks':
        return (
          <div style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>Task Management</h1>
            <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '1rem', border: '1px solid #f1f5f9' }}>
              <p style={{ color: 'var(--text-muted)' }}>Tasks connected to plans currently in progress.</p>
              <div style={{ marginTop: '2rem', display: 'grid', gap: '1rem' }}>
                {[1, 2, 3].map(i => (
                  <div key={i} style={{ padding: '1rem', border: '1px solid #f1f5f9', borderRadius: '0.75rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ width: '12px', height: '12px', borderRadius: '50%', backgroundColor: i === 2 ? '#f59e0b' : '#22c55e' }} />
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: '600', fontSize: '0.9rem' }}>Review Regional Report #{i}04</div>
                      <div style={{ fontSize: '0.75rem', color: '#64748b' }}>Assigned to: Project Dept · Due Tomorrow</div>
                    </div>
                    <button style={{ padding: '4px 12px', borderRadius: '6px', border: '1px solid #e2e8f0', fontSize: '0.75rem', cursor: 'pointer' }}>Details</button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );
      case 'Meetings':
        return (
          <div style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>Schedule Management</h1>
            <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '1rem', border: '1px solid #f1f5f9' }}>
              <p style={{ color: 'var(--text-muted)' }}>Organize meetings, training sessions, and event schedules across all departments.</p>
              <div style={{ marginTop: '2rem', height: '400px', backgroundColor: '#f8fafc', borderRadius: '1rem', border: '1px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                Calendar & Scheduling Interface
              </div>
            </div>
          </div>
        );
      case 'SupportivePlans':
        return (
          <div style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>Supportive Plans</h1>
            <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '1rem', border: '1px solid #f1f5f9' }}>
              <p style={{ color: 'var(--text-muted)' }}>Documentation and tracking for supportive organizational plans.</p>
            </div>
          </div>
        );
      case 'Reporting':
        return (
          <div style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>Reporting Workspace</h1>
            <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '1rem', border: '1px solid #f1f5f9' }}>
              <p style={{ color: 'var(--text-muted)' }}>Generate and manage organizational reports.</p>
            </div>
          </div>
        );
      case 'Analysis':
        return (
          <div style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>Report Analysis</h1>
            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1.5rem' }}>
              <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '1rem', border: '1px solid #f1f5f9', height: '400px' }}>
                <h3 style={{ marginBottom: '1rem' }}>Performance Trends</h3>
                <div style={{ height: '300px', background: 'linear-gradient(to top, #f8fafc, #fff)', border: '1px solid #f1f5f9', borderRadius: '0.5rem' }} />
              </div>
              <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '1rem', border: '1px solid #f1f5f9' }}>
                <h3 style={{ marginBottom: '1rem' }}>Key Metrics</h3>
                <div style={{ display: 'grid', gap: '1.5rem' }}>
                  {['Efficiency', 'Accuracy', 'Response Time'].map(m => (
                    <div key={m}>
                      <div style={{ fontSize: '0.8rem', color: '#64748b', marginBottom: '0.4rem' }}>{m}</div>
                      <div style={{ fontSize: '1.2rem', fontWeight: '700' }}>{Math.floor(Math.random() * 20) + 80}%</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        );
      case 'Members':
        return (
          <div style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '1rem' }}>Members Management</h1>
            <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '1rem', border: '1px solid #f1f5f9' }}>
              <p style={{ color: 'var(--text-muted)' }}>Manage member profiles and accessibility.</p>
            </div>
          </div>
        );
      case 'PlansDirectives':
        return (
          <div style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Plans & Directives</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>View and acknowledge organizational plans distributed to your unit.</p>
            <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '1rem', border: '1px solid #f1f5f9', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8', border: '2px dashed #e2e8f0' }}>
              Plans & Directives Workspace — Coming Soon
            </div>
          </div>
        );
      case 'TrainingRequests':
        return (
          <div style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Training Requests</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Submit and track requests for training programs and capacity-building sessions.</p>
            <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '1rem', border: '2px dashed #e2e8f0', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
              Training Request Form — Coming Soon
            </div>
          </div>
        );
      case 'BudgetRequests':
        return (
          <div style={{ padding: '1rem' }}>
            <h1 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>Budget Requests</h1>
            <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem', fontSize: '0.9rem' }}>Submit budget requests and track approval status for your department.</p>
            <div style={{ backgroundColor: '#fff', padding: '2rem', borderRadius: '1rem', border: '2px dashed #e2e8f0', minHeight: '300px', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
              Budget Request Form — Coming Soon
            </div>
          </div>
        );
      default:
        return <div style={{ padding: '2rem', textAlign: 'center', color: '#94a3b8' }}>{currentView} — Coming Soon</div>;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      {/* ── Sidebar ── */}
      <motion.aside
        animate={{ width: sidebarOpen ? '240px' : '72px' }}
        transition={{ duration: 0.25, ease: 'easeInOut' }}
        style={{
          background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)',
          display: 'flex', flexDirection: 'column',
          overflow: 'hidden', flexShrink: 0, position: 'relative',
        }}
      >
        {/* Logo + toggle */}
        <div style={{ padding: '1.25rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{
            width: '38px', height: '38px', borderRadius: '50%', flexShrink: 0,
            overflow: 'hidden',
            border: '2px solid rgba(255,255,255,0.2)',
            backgroundColor: '#fff',
          }}>
            <img src="/mk logo.png" alt="MK" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          <AnimatePresence>
            {sidebarOpen && (
              <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ overflow: 'hidden', whiteSpace: 'nowrap' }}>
                <div style={{ color: '#fff', fontWeight: '700', fontSize: '0.95rem', lineHeight: 1.2 }}>MK System</div>
                <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.72rem' }}>Management Portal</div>
              </motion.div>
            )}
          </AnimatePresence>
          <button
            onClick={() => setSidebarOpen(o => !o)}
            style={{ marginLeft: 'auto', background: 'none', border: 'none', cursor: 'pointer', color: 'rgba(255,255,255,0.5)', padding: '4px', display: 'flex', flexShrink: 0 }}
          >
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>

        {/* Nav */}
        <nav style={{ flex: 1, padding: '1rem 0.75rem', display: 'flex', flexDirection: 'column', gap: '4px' }}>
          {navItems.map(({ id, icon: Icon, label, badge }) => (
            <div
              key={id}
              onClick={() => setCurrentView(id)}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.75rem',
                padding: '0.7rem 0.75rem', borderRadius: '10px',
                backgroundColor: currentView === id ? 'rgba(99,102,241,0.25)' : 'transparent',
                color: currentView === id ? '#a5b4fc' : 'rgba(255,255,255,0.5)',
                cursor: 'pointer', position: 'relative',
                transition: 'all 0.2s', overflow: 'hidden', whiteSpace: 'nowrap',
              }}
              onMouseEnter={e => currentView !== id && (e.currentTarget.style.backgroundColor = 'rgba(255,255,255,0.06)')}
              onMouseLeave={e => currentView !== id && (e.currentTarget.style.backgroundColor = 'transparent')}
            >
              {currentView === id && <div style={{ position: 'absolute', left: 0, top: '20%', height: '60%', width: '3px', backgroundColor: '#818cf8', borderRadius: '0 3px 3px 0' }} />}
              <Icon size={19} style={{ flexShrink: 0 }} />
              <AnimatePresence>
                {sidebarOpen && (
                  <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ fontSize: '0.875rem', fontWeight: currentView === id ? '600' : '400' }}>
                    {label}
                  </motion.span>
                )}
              </AnimatePresence>
              {badge && sidebarOpen && (
                <span style={{ marginLeft: 'auto', backgroundColor: '#ef4444', color: '#fff', borderRadius: '10px', padding: '1px 7px', fontSize: '0.7rem', fontWeight: '700', flexShrink: 0 }}>
                  {badge}
                </span>
              )}
            </div>
          ))}
        </nav>

        {/* User + Logout */}
        <div style={{ padding: '0.75rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 0.75rem', borderRadius: '10px', overflow: 'hidden' }}>
            <div style={{
              width: '34px', height: '34px', borderRadius: '10px', flexShrink: 0,
              background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#fff', fontWeight: '700', fontSize: '0.8rem',
            }}>
              {user.initials}
            </div>
            <AnimatePresence>
              {sidebarOpen && (
                <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ overflow: 'hidden' }}>
                  <div style={{ color: '#fff', fontWeight: '600', fontSize: '0.825rem', whiteSpace: 'nowrap' }}>{user.fullName}</div>
                  <div style={{ color: 'rgba(255,255,255,0.4)', fontSize: '0.7rem' }}>{user.position === 'sub_chairman' ? 'Sub Chairman' : 'Member'}</div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          <button
            onClick={() => {
              localStorage.removeItem('mk_user');
              navigate('/login');
            }}
            style={{
              width: '100%', marginTop: '0.5rem',
              display: 'flex', alignItems: 'center', gap: '0.75rem',
              padding: '0.6rem 0.75rem', borderRadius: '10px',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'rgba(255,255,255,0.4)', transition: 'color 0.2s',
              overflow: 'hidden', whiteSpace: 'nowrap',
            }}
            onMouseEnter={e => e.currentTarget.style.color = '#f87171'}
            onMouseLeave={e => e.currentTarget.style.color = 'rgba(255,255,255,0.4)'}
          >
            <LogOut size={18} style={{ flexShrink: 0 }} />
            <AnimatePresence>
              {sidebarOpen && (
                <motion.span initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} style={{ fontSize: '0.85rem', fontWeight: '500' }}>
                  Sign Out
                </motion.span>
              )}
            </AnimatePresence>
          </button>
        </div>
      </motion.aside>

      {/* ── Main ── */}
      <main style={{ flex: 1, overflow: 'auto', padding: '2rem', display: 'flex', flexDirection: 'column', gap: '2rem', minWidth: 0 }}>
        {renderContent()}
      </main>
    </div>
  );
};

/* ── Page entry — shows loader then dashboard ─────────────────────────────── */
const DashboardPage = () => {
  const [loaded, setLoaded] = useState(false);

  return (
    <AnimatePresence mode="wait">
      {!loaded ? (
        <LoadingScreen key="loader" onDone={() => setLoaded(true)} />
      ) : (
        <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
          <DashboardContent />
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default DashboardPage;
