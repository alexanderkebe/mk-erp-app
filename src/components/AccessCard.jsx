import React from 'react';
import { motion } from 'framer-motion';

const AccessCard = ({ icon: Icon, titleAmharic, titleEnglish, description, iconColor }) => {
  return (
    <motion.div
      whileHover={{ y: -5, boxShadow: 'var(--shadow-lg)' }}
      className="access-card"
      style={{
        backgroundColor: 'var(--card-bg)',
        padding: '2rem',
        borderRadius: '1rem',
        boxShadow: 'var(--shadow-md)',
        cursor: 'pointer',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        transition: 'background-color 0.3s ease',
        border: '1px solid rgba(255, 255, 255, 0.5)',
        backdropFilter: 'blur(8px)',
      }}
    >
      <div
        className="icon-container"
        style={{
          backgroundColor: iconColor,
          padding: '1rem',
          borderRadius: '50%',
          marginBottom: '1.5rem',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          color: 'white',
          boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
        }}
      >
        <Icon size={32} />
      </div>
      <h3
        style={{
          fontSize: '1.25rem',
          fontWeight: '700',
          marginBottom: '0.25rem',
          color: 'var(--text-main)',
        }}
      >
        {titleAmharic}
      </h3>
      <h4
        style={{
          fontSize: '1rem',
          fontWeight: '500',
          marginBottom: '1rem',
          color: 'var(--text-muted)',
        }}
      >
        {titleEnglish}
      </h4>
      <p
        style={{
          fontSize: '0.875rem',
          color: 'var(--text-muted)',
          lineHeight: '1.4',
        }}
      >
        {description}
      </p>
    </motion.div>
  );
};

export default AccessCard;
