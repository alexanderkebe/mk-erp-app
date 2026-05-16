import React, { useState } from 'react';
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
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.username || !formData.password) {
      setError(t('err_fill_fields'));
      return;
    }

    setLoading(true);
    setError('');

    try {
      const res = await fetch('/api/auth/login', {
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
        setError(data.message || t('err_login_failed'));
      }
    } catch (err) {
      console.error('Login error:', err);
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

      <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              style={{
                padding: '0.75rem 1rem',
                backgroundColor: '#fef2f2',
                border: '1px solid #fecaca',
                borderRadius: 'var(--radius-md)',
                color: 'var(--danger)',
                fontSize: '0.85rem',
                fontWeight: '500',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
              }}
            >
              <div style={{ width: '4px', height: '4px', borderRadius: '50%', backgroundColor: 'var(--danger)' }} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

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
            position: 'absolute',
            top: 0,
            right: 0,
            fontSize: '0.8rem',
            color: 'var(--accent)',
            textDecoration: 'none',
            fontWeight: '600'
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
            marginTop: '0.5rem',
            padding: '1rem',
            borderRadius: 'var(--radius-md)',
            backgroundColor: 'var(--accent)',
            color: 'white',
            border: 'none',
            fontSize: '1rem',
            fontWeight: '700',
            cursor: loading ? 'not-allowed' : 'pointer',
            boxShadow: '0 4px 12px rgba(99, 102, 241, 0.25)',
            opacity: loading ? 0.7 : 1,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '0.75rem',
          }}
        >
          {loading ? t('loading_authenticating') : (
            <>
              {t('btn_signin')}
              <ArrowRight size={18} />
            </>
          )}
        </motion.button>

        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '1rem',
          margin: '0.5rem 0'
        }}>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
          <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontWeight: '600' }}>OR</span>
          <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
        </div>

        <p style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {t('no_account_text')}{' '}
          <Link to="/signup" style={{ color: 'var(--accent)', fontWeight: '700', textDecoration: 'none' }}>
            {t('link_create_account')}
          </Link>
        </p>
      </form>
    </AuthLayout>
  );
};

export default LoginPage;
