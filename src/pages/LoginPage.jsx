import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, ArrowRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthLayout from '../components/AuthLayout';
import { InputField } from '../components/FormFields';
import { useLanguage } from '../i18n/LanguageContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { t, toggleLanguage, language } = useLanguage();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleQuickLogin = (roleKey) => {
    setLoading(true);
    
    // Mock user data for bypassing the server
    const mockUsers = {
      abebe_chairman: {
        fullName: 'Abebe Tadesse',
        username: 'abebe_chairman',
        category: 'coordinator',
        subRole: 'main_office',
        position: 'chairman'
      },
      sara_sec: {
        fullName: 'Sara Mekonnen',
        username: 'sara_sec',
        category: 'coordinator',
        subRole: 'main_office',
        position: 'secretary'
      },
      kebede_sub: {
        fullName: 'Kebede Alemu',
        username: 'kebede_sub',
        category: 'coordinator',
        subRole: 'main_office',
        position: 'sub_chairman'
      },
      meron_regional: {
        fullName: 'Meron Girma',
        username: 'meron_regional',
        category: 'regional',
        subRole: 'main_office',
        region: 'akaki_kilinto',
        position: 'member'
      }
    };

    const user = mockUsers[roleKey];
    if (user) {
      setTimeout(() => {
        localStorage.setItem('mk_token', 'bypass_token_' + Date.now());
        localStorage.setItem('mk_user', JSON.stringify(user));
        navigate('/dashboard');
        setLoading(false);
      }, 800);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    const apiUrl = import.meta.env.VITE_API_URL || '';

    try {
      const res = await fetch(`${apiUrl}/api/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: formData.username.toLowerCase(),
          password: formData.password
        }),
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem('mk_token', data.token);
        localStorage.setItem('mk_user', JSON.stringify(data.user));
        navigate('/dashboard');
      } else {
        setError(data.message || 'Login failed');
      }
    } catch (err) {
      setError(t('err_server_connection'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <AuthLayout 
      title={t('login_title')} 
      subtitle={t('login_subtitle')}
    >
      {/* Language Toggle */}
      <div style={{ position: 'absolute', top: '1.25rem', right: '1.5rem', zIndex: 10 }}>
        <button 
          onClick={toggleLanguage}
          style={{
            padding: '4px 12px', borderRadius: '20px', border: '1px solid var(--accent)',
            background: 'var(--card-bg)', color: 'var(--accent)', cursor: 'pointer', fontSize: '0.75rem', fontWeight: '700',
            boxShadow: 'var(--shadow-sm)', transition: 'all 0.2s'
          }}
        >
          {language === 'am' ? 'English' : 'አማርኛ'}
        </button>
      </div>

      <div style={{ marginTop: '0.5rem' }}>
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca',
                borderRadius: '12px', color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1.5rem', textAlign: 'center', fontWeight: '600'
              }}
            >
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem' }}>
          <InputField
            label={t('label_username')}
            name="username"
            value={formData.username}
            onChange={handleChange}
            required
            icon={User}
            placeholder={t('placeholder_username') || 'Username'}
          />

          <div style={{ position: 'relative' }}>
            <InputField
              label={t('label_password')}
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              required
              icon={Lock}
              placeholder={t('placeholder_password') || 'Password'}
            />
            <a href="#" style={{
              position: 'absolute', top: 0, right: 0, fontSize: '0.8rem', color: 'var(--accent)', textDecoration: 'none', fontWeight: '600'
            }}>
              {t('forgot_password')}
            </a>
          </div>

          <motion.button
            whileHover={{ scale: 1.01, boxShadow: 'var(--shadow-glow)' }}
            whileTap={{ scale: 0.98 }}
            type="submit"
            disabled={loading}
            style={{
              marginTop: '0.5rem', padding: '1rem', borderRadius: 'var(--radius-md)',
              backgroundColor: 'var(--accent)', color: 'white', border: 'none', fontSize: '1rem', fontWeight: '700',
              cursor: loading ? 'not-allowed' : 'pointer', boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
              opacity: loading ? 0.7 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem'
            }}
          >
            {loading ? t('loading_authenticating') : t('btn_signin')}
            <ArrowRight size={20} />
          </motion.button>
        </form>

        {/* Quick Login - NOW WITH BYPASS */}
        <div style={{ marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid #f1f5f9' }}>
          <p style={{ fontSize: '0.7rem', fontWeight: '800', color: 'var(--text-subtle)', textTransform: 'uppercase', marginBottom: '1rem', textAlign: 'center', letterSpacing: '0.05em' }}>
            Quick Login (Demo Bypass)
          </p>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
            {[
              { label: 'Chairman', user: 'abebe_chairman' },
              { label: 'Secretary', user: 'sara_sec' },
              { label: 'Sub-Chair', user: 'kebede_sub' },
              { label: 'Regional', user: 'meron_regional' }
            ].map(test => (
              <button
                key={test.user}
                type="button"
                onClick={() => handleQuickLogin(test.user)}
                style={{
                  padding: '12px', borderRadius: '12px', border: '1px solid #e2e8f0',
                  background: '#fff', fontSize: '0.8rem', fontWeight: '700',
                  color: 'var(--text-main)', cursor: 'pointer', textAlign: 'left',
                  display: 'flex', alignItems: 'center', gap: '0.5rem', transition: 'all 0.2s'
                }}
                onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--accent)'}
                onMouseLeave={e => e.currentTarget.style.borderColor = '#e2e8f0'}
              >
                <span style={{ fontSize: '1.1rem' }}>⚡</span> {test.label}
              </button>
            ))}
          </div>
        </div>

        <p style={{ textAlign: 'center', marginTop: '2rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          {t('no_account_text')}{' '}
          <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>
            {t('link_create_account')}
          </Link>
        </p>
      </div>
    </AuthLayout>
  );
};

export default LoginPage;
