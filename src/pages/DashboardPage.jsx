import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  LayoutDashboard, Users, FileText, Bell, Settings,
  ChevronRight, TrendingUp, CheckCircle, Clock, Activity,
  LogOut, Menu, X, Building2, Globe, Shield,
  BookOpen, Wallet, GraduationCap, Calendar
} from 'lucide-react';
import { useLanguage } from '../i18n/LanguageContext';

/* ── Loading Screen ──────────────────────────────────────────────────────── */
const LoadingScreen = ({ onDone }) => {
  const { t } = useLanguage();
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState(t('loading_authenticating'));

  useEffect(() => {
    const steps = [
      { p: 30, t: t('loading_departments') },
      { p: 60, t: t('loading_reports') },
      { p: 85, t: t('loading_preparing') },
      { p: 100, t: t('loading_ready') },
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
  }, [onDone, t]);

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

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        style={{ textAlign: 'center' }}
      >
        <h1 style={{ color: '#fff', fontSize: '1.6rem', fontWeight: '800', marginBottom: '0.4rem', letterSpacing: '-0.5px' }}>
          {t('app_title')}
        </h1>
        <p style={{ color: 'rgba(255,255,255,0.5)', fontSize: '0.9rem' }}>
          {t('app_subtitle')}
        </p>
      </motion.div>

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
    </motion.div>
  );
};

/* ── Dashboard UI ─────────────────────────────────────────────────────────── */
const DashboardContent = () => {
  const navigate = useNavigate();
  const { t, language, toggleLanguage } = useLanguage();
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [user, setUser] = useState(null);
  const [currentView, setCurrentView] = useState('Dashboard');
  const [usersList, setUsersList] = useState([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState('');

  useEffect(() => {
    const savedUser = localStorage.getItem('mk_user');
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    } else {
      navigate('/login');
    }
  }, [navigate]);

  useEffect(() => {
    if (currentView === 'Members') {
      const fetchUsers = async () => {
        setUsersLoading(true);
        setUsersError('');
        try {
          const res = await fetch('/api/users');
          if (!res.ok) throw new Error('Failed to fetch users');
          const data = await res.json();
          setUsersList(data);
        } catch (err) {
          setUsersError(err.message);
        } finally {
          setUsersLoading(false);
        }
      };
      fetchUsers();
    }
  }, [currentView]);

  if (!user) return null;

  const isChairman = user.position === 'chairman';
  const isSubChairman = user.position === 'sub_chairman';
  const isSecretary = user.position === 'secretary';

  const STAT_CARDS = [
    { label: t('stat_active_members'), value: '1,240', icon: Users, color: '#0ea5e9', change: '+12%' },
    { label: t('stat_reports_submitted'), value: '87', icon: FileText, color: '#6366f1', change: '+5%' },
    { label: t('stat_pending_approvals'), value: '14', icon: Clock, color: '#f59e0b', change: '-3' },
    { label: t('stat_regional_branches'), value: '5', icon: Globe, color: '#22c55e', change: 'Active' },
  ];

  const subChairmanNav = [
    { id: 'Dashboard', icon: LayoutDashboard, label: t('nav_dashboard') },
    { id: 'Plans', icon: Shield, label: t('nav_plan_mgmt') },
    { id: 'Tasks', icon: Activity, label: t('nav_task_mgmt') },
    { id: 'Analysis', icon: TrendingUp, label: t('nav_report_analysis') },
    { id: 'Notifications', icon: Bell, label: t('nav_notifications'), badge: 4 },
    { id: 'Settings', icon: Settings, label: t('nav_settings') },
  ];

  const secretaryNav = [
    { id: 'Dashboard', icon: LayoutDashboard, label: t('nav_dashboard') },
    { id: 'Meetings', icon: Clock, label: t('nav_meetings') },
    { id: 'SupportivePlans', icon: Shield, label: t('nav_supportive_plans') },
    { id: 'Reporting', icon: FileText, label: t('nav_reporting') },
    { id: 'Members', icon: Users, label: t('nav_member_mgmt') },
    { id: 'Notifications', icon: Bell, label: t('nav_notifications'), badge: 3 },
    { id: 'Settings', icon: Settings, label: t('nav_settings') },
  ];

  const chairmanNav = [
    { id: 'Dashboard', icon: LayoutDashboard, label: t('nav_dashboard') },
    { id: 'Plans', icon: Shield, label: t('nav_plan_mgmt') },
    { id: 'Tasks', icon: Activity, label: t('nav_task_mgmt') },
    { id: 'Meetings', icon: Clock, label: t('nav_meetings') },
    { id: 'SupportivePlans', icon: Shield, label: t('nav_supportive_plans') },
    { id: 'Reporting', icon: FileText, label: t('nav_reporting') },
    { id: 'Analysis', icon: TrendingUp, label: t('nav_report_analysis') },
    { id: 'Members', icon: Users, label: t('nav_member_mgmt') },
    { id: 'Notifications', icon: Bell, label: t('nav_notifications'), badge: 7 },
    { id: 'Settings', icon: Settings, label: t('nav_settings') },
  ];

  const regularNav = [
    { id: 'Dashboard',          icon: LayoutDashboard, label: t('nav_dashboard') },
    { id: 'PlansDirectives',    icon: BookOpen,        label: t('nav_plans_directives') },
    { id: 'TrainingRequests',   icon: GraduationCap,   label: t('nav_training_requests') },
    { id: 'BudgetRequests',     icon: Wallet,          label: t('nav_budget_requests') },
    { id: 'Meetings',           icon: Calendar,        label: t('nav_meetings') },
    { id: 'Reporting',          icon: FileText,        label: t('nav_reporting') },
    { id: 'Notifications',      icon: Bell,            label: t('nav_notifications'), badge: 2 },
    { id: 'Settings',           icon: Settings,        label: t('nav_settings') },
  ];

  const navItems = isChairman ? chairmanNav : isSubChairman ? subChairmanNav : isSecretary ? secretaryNav : regularNav;

  const renderContent = () => {
    switch (currentView) {
      case 'Dashboard':
        return (
          <>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <div>
                <h1 style={{ fontSize: '1.6rem', fontWeight: '800', color: 'var(--text-main)', letterSpacing: '-0.5px' }}>
                  {t('greeting_prefix')} {user.fullName.split(' ')[0]} 👋
                </h1>
                <p style={{ color: 'var(--text-muted)', marginTop: '0.25rem', fontSize: '0.9rem' }}>
                  {user.category === 'coordinator' ? t('label_coordinator') : t('label_regional')} · {t(user.position) || user.position}
                </p>
              </div>
              <button 
                onClick={toggleLanguage}
                style={{ padding: '6px 16px', borderRadius: '20px', border: '1px solid #e2e8f0', backgroundColor: '#fff', fontSize: '0.8rem', fontWeight: '700', cursor: 'pointer' }}
              >
                {language === 'am' ? 'English' : 'አማርኛ'}
              </button>
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.25rem' }}>
              {STAT_CARDS.map(({ label, value, icon: Icon, color, change }, i) => (
                <motion.div key={label} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: i * 0.08 }} style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: 'var(--radius-md)', boxShadow: 'var(--shadow-sm)', border: '1px solid #f1f5f9', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ width: '44px', height: '44px', borderRadius: '12px', backgroundColor: `${color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', color }}><Icon size={22} /></div>
                    <span style={{ fontSize: '0.75rem', fontWeight: '600', color: change.startsWith('+') ? '#22c55e' : '#64748b', backgroundColor: change.startsWith('+') ? '#f0fdf4' : '#f8fafc', padding: '2px 8px', borderRadius: '20px' }}>{change}</span>
                  </div>
                  <div>
                    <div style={{ fontSize: '1.75rem', fontWeight: '800', color: 'var(--text-main)', lineHeight: 1 }}>{value}</div>
                    <div style={{ fontSize: '0.825rem', color: 'var(--text-muted)', marginTop: '0.3rem' }}>{label}</div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid #f1f5f9' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem' }}>{t('overview_upcoming_schedule')}</h3>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                  {['Staff Training (10 AM)', 'Executive Meeting (2 PM)', 'Digital Expansion Strategy'].map((item, i) => (
                    <div key={i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontSize: '0.85rem' }}>{item}</span>
                      <div style={{ width: '100px', height: '6px', backgroundColor: '#f1f5f9', borderRadius: '3px' }}><div style={{ width: `${70 - i * 20}%`, height: '100%', backgroundColor: 'var(--accent)', borderRadius: '3px' }} /></div>
                    </div>
                  ))}
                </div>
              </div>
              <div style={{ backgroundColor: '#fff', padding: '1.5rem', borderRadius: 'var(--radius-md)', border: '1px solid #f1f5f9' }}>
                <h3 style={{ fontSize: '1rem', fontWeight: '700', marginBottom: '1rem' }}>{t('overview_regional_perf')}</h3>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', height: '100px', paddingBottom: '0.5rem' }}>
                  {[40, 70, 45, 90, 60].map((h, i) => (
                    <div key={i} style={{ flex: 1, height: `${h}%`, backgroundColor: 'var(--accent)', opacity: 0.7, borderRadius: '4px' }} />
                  ))}
                </div>
              </div>
            </div>
          </>
        );
      case 'Members':
        return (
          <div style={{ padding: '1rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div>
                <h1 style={{ fontSize: '1.5rem', fontWeight: '800' }}>{t('members_title')}</h1>
                <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem' }}>{t('members_subtitle')}</p>
              </div>
              <button onClick={() => {}} style={{ padding: '0.5rem 1rem', borderRadius: '8px', backgroundColor: 'var(--primary)', color: '#fff', border: 'none', fontWeight: '600', cursor: 'pointer' }}>
                {t('refresh_data')}
              </button>
            </div>
            <div style={{ backgroundColor: '#fff', borderRadius: '1rem', border: '1px solid #f1f5f9', overflow: 'hidden' }}>
              {usersLoading ? <div style={{ padding: '4rem', textAlign: 'center' }}>{t('loading_reports')}</div> : (
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                  <thead style={{ backgroundColor: '#f8fafc' }}>
                    <tr>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>{t('table_col_user')}</th>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>{t('table_col_category')}</th>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>{t('table_col_position')}</th>
                      <th style={{ padding: '1rem', textAlign: 'left' }}>{t('table_col_contact')}</th>
                    </tr>
                  </thead>
                  <tbody>
                    {usersList.map(u => (
                      <tr key={u._id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                        <td style={{ padding: '1rem' }}>{u.fullName}</td>
                        <td style={{ padding: '1rem' }}>{u.category === 'coordinator' ? t('label_coordinator') : (t(u.region) || u.region)}</td>
                        <td style={{ padding: '1rem' }}>{t(u.position) || u.position}</td>
                        <td style={{ padding: '1rem' }}>{u.phone}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        );
      default:
        return <div style={{ padding: '2rem', textAlign: 'center' }}>{t('coming_soon')}</div>;
    }
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc' }}>
      <motion.aside animate={{ width: sidebarOpen ? '240px' : '72px' }} style={{ background: 'linear-gradient(180deg, #0f172a 0%, #1e1b4b 100%)', display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
        <div style={{ padding: '1.25rem 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
          <div style={{ width: '38px', height: '38px', borderRadius: '50%', backgroundColor: '#fff', overflow: 'hidden' }}>
            <img src="/mk logo.png" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
          </div>
          {sidebarOpen && <div style={{ color: '#fff', fontWeight: '700' }}>MK System</div>}
          <button onClick={() => setSidebarOpen(!sidebarOpen)} style={{ marginLeft: 'auto', background: 'none', border: 'none', color: '#fff' }}>
            {sidebarOpen ? <X size={18} /> : <Menu size={18} />}
          </button>
        </div>
        <nav style={{ flex: 1, padding: '1rem' }}>
          {navItems.map(({ id, icon: Icon, label }) => (
            <div key={id} onClick={() => setCurrentView(id)} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', color: currentView === id ? '#a5b4fc' : 'rgba(255,255,255,0.5)', cursor: 'pointer', backgroundColor: currentView === id ? 'rgba(99,102,241,0.2)' : 'transparent', borderRadius: '8px' }}>
              <Icon size={20} />
              {sidebarOpen && <span>{label}</span>}
            </div>
          ))}
        </nav>
        <div style={{ padding: '1rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
          <button onClick={() => { localStorage.removeItem('mk_user'); navigate('/login'); }} style={{ width: '100%', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.75rem', color: 'rgba(255,255,255,0.5)', background: 'none', border: 'none', cursor: 'pointer' }}>
            <LogOut size={20} />
            {sidebarOpen && <span>{t('sidebar_footer_signout')}</span>}
          </button>
        </div>
      </motion.aside>
      <main style={{ flex: 1, padding: '2rem', overflowY: 'auto' }}>
        {renderContent()}
      </main>
    </div>
  );
};

const DashboardPage = () => {
  const [loaded, setLoaded] = useState(false);
  return (
    <AnimatePresence mode="wait">
      {!loaded ? <LoadingScreen key="loader" onDone={() => setLoaded(true)} /> : (
        <motion.div key="dashboard" initial={{ opacity: 0 }} animate={{ opacity: 1 }}><DashboardContent /></motion.div>
      )}
    </AnimatePresence>
  );
};

export default DashboardPage;
