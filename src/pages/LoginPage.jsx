import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, LogIn, Loader2, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthLayout from '../components/AuthLayout';
import { InputField } from '../components/FormFields';

const LoginPage = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ username: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setError('');
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!formData.username.trim() || !formData.password.trim()) {
      setError('Please fill in all fields.');
      return;
    }
    setIsLoading(true);
    setError('');
    
    // Simulate API login
    setTimeout(() => {
      // Default mock user
      const user = {
        fullName: formData.username,
        category: 'coordinator',
        role: 'main_office',
        position: 'member',
        initials: formData.username.substring(0, 2).toUpperCase(),
      };
      
      localStorage.setItem('mk_user', JSON.stringify(user));
      setIsLoading(false);
      navigate('/dashboard');
    }, 1500);
  };

  const handleQuickLogin = (type) => {
    setIsLoading(true);
    setTimeout(() => {
      let user = {};
      if (type === 'chairman') {
        user = {
          fullName: 'Chairman User',
          category: 'coordinator',
          role: 'main_office',
          position: 'chairman',
          initials: 'CH',
        };
      } else if (type === 'sub_chairman') {
        user = {
          fullName: 'Sub Chairman User',
          category: 'coordinator',
          role: 'main_office',
          position: 'sub_chairman',
          initials: 'SC',
        };
      } else if (type === 'secretary') {
        user = {
          fullName: 'Secretary User',
          category: 'coordinator',
          role: 'main_office',
          position: 'secretary',
          initials: 'SU',
        };
      } else {
        user = {
          fullName: 'Regular Member',
          category: 'regional',
          role: 'akaki_kilinto',
          position: 'member',
          initials: 'RM',
        };
      }
      localStorage.setItem('mk_user', JSON.stringify(user));
      setIsLoading(false);
      navigate('/dashboard');
    }, 800);
  };

  const isValid = formData.username.trim() && formData.password.trim();

  return (
    <AuthLayout
      title="Welcome Back"
      subtitle="Sign in to your MK management account"
    >
      <form onSubmit={handleSubmit}>
        {/* ... existing form fields ... */}
        {/* Error banner */}
        <AnimatePresence>
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -8, height: 0 }}
              animate={{ opacity: 1, y: 0, height: 'auto' }}
              exit={{ opacity: 0, y: -8, height: 0 }}
              style={{
                display: 'flex', alignItems: 'center', gap: '0.5rem',
                padding: '0.75rem 1rem', marginBottom: '1.25rem',
                backgroundColor: '#fef2f2', border: '1px solid #fecaca',
                borderRadius: 'var(--radius-sm)', color: '#dc2626',
                fontSize: '0.875rem', fontWeight: '500',
              }}
            >
              <AlertCircle size={16} style={{ flexShrink: 0 }} />
              {error}
            </motion.div>
          )}
        </AnimatePresence>

        <InputField
          label="Username"
          name="username"
          value={formData.username}
          onChange={handleChange}
          placeholder="Your username"
          required
          icon={User}
        />
        <InputField
          label="Password"
          type="password"
          name="password"
          value={formData.password}
          onChange={handleChange}
          placeholder="Your password"
          required
          icon={Lock}
        />

        <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: '1.5rem', marginTop: '-0.25rem' }}>
          <Link to="#" style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--primary)', textDecoration: 'none' }}>
            Forgot password?
          </Link>
        </div>

        <motion.button
          type="submit"
          disabled={!isValid || isLoading}
          whileHover={isValid && !isLoading ? { scale: 1.02 } : {}}
          whileTap={isValid && !isLoading ? { scale: 0.98 } : {}}
          style={{
            width: '100%', padding: '0.95rem',
            background: isValid ? 'linear-gradient(135deg, #0ea5e9, #6366f1)' : '#e2e8f0',
            color: isValid ? '#fff' : 'var(--text-subtle)',
            border: 'none', borderRadius: 'var(--radius-md)',
            fontSize: '0.95rem', fontWeight: '700',
            cursor: isValid && !isLoading ? 'pointer' : 'not-allowed',
            display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
            boxShadow: isValid ? '0 8px 20px rgba(14,165,233,0.30)' : 'none',
            transition: 'all 0.25s',
          }}
        >
          {isLoading ? (
            <>
              <motion.span
                animate={{ rotate: 360 }}
                transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                style={{ display: 'flex' }}
              >
                <Loader2 size={20} />
              </motion.span>
              Signing in...
            </>
          ) : (
            <>
              Sign In <LogIn size={18} />
            </>
          )}
        </motion.button>
      </form>

      {/* Development Quick Access */}
      <div style={{ marginTop: '2rem', padding: '1rem', border: '1px dashed #cbd5e1', borderRadius: 'var(--radius-md)', backgroundColor: 'rgba(241,245,249,0.5)' }}>
        <p style={{ fontSize: '0.75rem', fontWeight: '700', color: '#64748b', marginBottom: '0.75rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Development Quick Login
        </p>
        <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
          <button 
            onClick={() => handleQuickLogin('chairman')}
            style={{ flex: '1 1 100%', padding: '0.6rem', fontSize: '0.75rem', fontWeight: '700', borderRadius: '6px', border: '1px solid #ef4444', color: '#ef4444', background: '#fef2f2', cursor: 'pointer', marginBottom: '0.5rem' }}
          >
            Full Chairman Access
          </button>
          <button 
            onClick={() => handleQuickLogin('sub_chairman')}
            style={{ flex: '1 1 calc(50% - 0.25rem)', padding: '0.5rem', fontSize: '0.75rem', fontWeight: '600', borderRadius: '6px', border: '1px solid #0ea5e9', color: '#0ea5e9', background: 'none', cursor: 'pointer' }}
          >
            Sub-Chairman
          </button>
          <button 
            onClick={() => handleQuickLogin('secretary')}
            style={{ flex: '1 1 calc(50% - 0.25rem)', padding: '0.5rem', fontSize: '0.75rem', fontWeight: '600', borderRadius: '6px', border: '1px solid #6366f1', color: '#6366f1', background: 'none', cursor: 'pointer' }}
          >
            Secretary
          </button>
        </div>
      </div>

      {/* Divider */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', margin: '1.75rem 0 1.5rem' }}>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
        <span style={{ fontSize: '0.8rem', color: 'var(--text-subtle)', fontWeight: '500' }}>OR</span>
        <div style={{ flex: 1, height: '1px', backgroundColor: '#e2e8f0' }} />
      </div>

      <p style={{ textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
        Don't have an account?{' '}
        <Link to="/signup" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>
          Create one
        </Link>
      </p>
    </AuthLayout>
  );
};

export default LoginPage;
