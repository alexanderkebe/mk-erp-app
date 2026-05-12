import React from 'react';
import { motion } from 'framer-motion';

/* MK Logo mark */
const MKLogo = () => (
  <div style={{
    display: 'inline-flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '72px',
    height: '72px',
    borderRadius: '50%',
    overflow: 'hidden',
    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
    border: '3px solid rgba(255,255,255,0.9)',
    backgroundColor: '#fff',
    marginBottom: '1rem',
  }}>
    <img
      src="/mk logo.png"
      alt="Mahibere Kidusan Logo"
      style={{ width: '100%', height: '100%', objectFit: 'cover' }}
    />
  </div>
);

const AuthLayout = ({ children, title, subtitle }) => {
  return (
    <div style={{
      minHeight: '100vh',
      width: '100%',
      display: 'flex',
      justifyContent: 'center',
      alignItems: 'center',
      padding: '1.5rem',
      background: 'var(--bg-gradient)',
      backgroundAttachment: 'fixed',
    }}>
      <motion.div
        initial={{ opacity: 0, y: 24 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
        style={{
          width: '100%',
          maxWidth: '520px',
          backgroundColor: 'var(--card-bg)',
          backdropFilter: 'blur(20px)',
          WebkitBackdropFilter: 'blur(20px)',
          padding: '2.75rem',
          borderRadius: 'var(--radius-xl)',
          boxShadow: 'var(--shadow-lg)',
          border: '1px solid rgba(255, 255, 255, 0.8)',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative top gradient bar */}
        <div style={{
          position: 'absolute',
          top: 0, left: 0, right: 0,
          height: '4px',
          background: 'linear-gradient(90deg, #0ea5e9, #6366f1, #a855f7)',
          borderRadius: 'var(--radius-xl) var(--radius-xl) 0 0',
        }} />

        <header style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <MKLogo />
          <h1 style={{
            fontSize: '1.75rem',
            fontWeight: '800',
            color: 'var(--text-main)',
            marginBottom: '0.4rem',
            letterSpacing: '-0.5px',
          }}>
            {title}
          </h1>
          {subtitle && (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', lineHeight: '1.5' }}>
              {subtitle}
            </p>
          )}
        </header>

        {children}
      </motion.div>
    </div>
  );
};

export default AuthLayout;
