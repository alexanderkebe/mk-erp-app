import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, Eye, EyeOff } from 'lucide-react';

/* ─── Input Field ─────────────────────────────────────────────────────────── */
export const InputField = ({
  label, type = 'text', name, value, onChange,
  placeholder, required = false, icon: Icon,
}) => {
  const [focused, setFocused] = useState(false);
  const [showPw, setShowPw] = useState(false);
  const isPassword = type === 'password';
  const inputType = isPassword ? (showPw ? 'text' : 'password') : type;

  return (
    <div style={{ marginBottom: '1.25rem' }}>
      <label style={{
        display: 'block', marginBottom: '0.4rem',
        fontSize: '0.8rem', fontWeight: '600',
        color: focused ? 'var(--primary)' : 'var(--text-muted)',
        letterSpacing: '0.04em', textTransform: 'uppercase',
        transition: 'color 0.2s',
      }}>
        {label}{required && <span style={{ color: 'var(--danger)', marginLeft: '3px' }}>*</span>}
      </label>

      <div style={{ position: 'relative' }}>
        {Icon && (
          <span style={{
            position: 'absolute', left: '1rem', top: '50%',
            transform: 'translateY(-50%)',
            color: focused ? 'var(--primary)' : 'var(--text-subtle)',
            transition: 'color 0.2s',
            display: 'flex', alignItems: 'center',
            pointerEvents: 'none',
          }}>
            <Icon size={17} />
          </span>
        )}

        <input
          type={inputType}
          name={name}
          value={value}
          onChange={onChange}
          placeholder={placeholder}
          required={required}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          style={{
            width: '100%',
            padding: `0.85rem ${isPassword ? '3rem' : '1rem'} 0.85rem ${Icon ? '2.75rem' : '1rem'}`,
            borderRadius: 'var(--radius-md)',
            border: `2px solid ${focused ? 'var(--primary)' : '#e2e8f0'}`,
            backgroundColor: 'var(--input-bg)',
            color: 'var(--text-main)',
            fontSize: '0.95rem',
            outline: 'none',
            boxShadow: focused ? '0 0 0 4px rgba(14,165,233,0.10)' : 'none',
            transition: 'border-color 0.2s, box-shadow 0.2s',
          }}
        />

        {isPassword && (
          <button
            type="button"
            onClick={() => setShowPw(!showPw)}
            style={{
              position: 'absolute', right: '1rem', top: '50%',
              transform: 'translateY(-50%)',
              background: 'none', border: 'none', cursor: 'pointer',
              color: 'var(--text-subtle)', display: 'flex', alignItems: 'center',
              padding: 0,
            }}
          >
            {showPw ? <EyeOff size={17} /> : <Eye size={17} />}
          </button>
        )}
      </div>
    </div>
  );
};

/* ─── Category Card ───────────────────────────────────────────────────────── */
export const CategoryCard = ({ selected, onClick, amharic, english, icon: Icon, color = '#0ea5e9' }) => (
  <motion.button
    type="button"
    whileHover={{ y: -3, scale: 1.02 }}
    whileTap={{ scale: 0.97 }}
    onClick={onClick}
    style={{
      flex: 1,
      padding: '1.4rem 1rem',
      borderRadius: 'var(--radius-md)',
      backgroundColor: selected ? color : '#ffffff',
      color: selected ? '#ffffff' : 'var(--text-main)',
      border: `2px solid ${selected ? color : '#e2e8f0'}`,
      cursor: 'pointer',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      gap: '0.6rem',
      boxShadow: selected ? `0 12px 28px ${color}40` : 'var(--shadow-sm)',
      transition: 'all 0.25s ease',
      outline: 'none',
    }}
  >
    <div style={{
      width: '48px', height: '48px', borderRadius: '14px',
      backgroundColor: selected ? 'rgba(255,255,255,0.2)' : `${color}18`,
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      color: selected ? '#ffffff' : color,
    }}>
      <Icon size={24} />
    </div>
    <div style={{ textAlign: 'center' }}>
      <div style={{ fontWeight: '700', fontSize: '0.95rem' }}>{amharic}</div>
      <div style={{ fontSize: '0.78rem', opacity: 0.8, marginTop: '1px' }}>{english}</div>
    </div>
  </motion.button>
);

/* ─── Premium Select ──────────────────────────────────────────────────────── */
export const PremiumSelect = ({
  label, name, value, onChange, options,
  placeholder = 'Select an option', required = false, icon: Icon,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const ref = useRef(null);

  // Close on outside click
  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setIsOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const selected = options.find(o => o.id === value || o.name === value);
  const displayLabel = selected
    ? (selected.amharic ? `${selected.amharic} — ${selected.english}` : selected.name)
    : placeholder;

  const handleSelect = (optValue) => {
    onChange({ target: { name, value: optValue } });
    setIsOpen(false);
  };

  return (
    <div style={{ marginBottom: '1.25rem' }} ref={ref}>
      <label style={{
        display: 'block', marginBottom: '0.4rem',
        fontSize: '0.8rem', fontWeight: '600',
        color: isOpen ? 'var(--primary)' : 'var(--text-muted)',
        letterSpacing: '0.04em', textTransform: 'uppercase',
        transition: 'color 0.2s',
      }}>
        {label}{required && <span style={{ color: 'var(--danger)', marginLeft: '3px' }}>*</span>}
      </label>

      {/* Trigger */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => e.key === 'Enter' && setIsOpen(!isOpen)}
        style={{
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '0.85rem 1rem',
          borderRadius: 'var(--radius-md)',
          border: `2px solid ${isOpen ? 'var(--primary)' : '#e2e8f0'}`,
          backgroundColor: 'var(--input-bg)',
          cursor: 'pointer',
          userSelect: 'none',
          boxShadow: isOpen ? '0 0 0 4px rgba(14,165,233,0.10)' : 'none',
          transition: 'all 0.2s',
          outline: 'none',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', overflow: 'hidden' }}>
          {Icon && (
            <span style={{ color: isOpen ? 'var(--primary)' : 'var(--text-subtle)', flexShrink: 0, display: 'flex' }}>
              <Icon size={17} />
            </span>
          )}
          <span style={{
            color: selected ? 'var(--text-main)' : 'var(--text-subtle)',
            fontWeight: selected ? '600' : '400',
            fontSize: '0.95rem',
            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
          }}>
            {displayLabel}
          </span>
        </div>
        <motion.span
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.2 }}
          style={{ color: 'var(--text-subtle)', flexShrink: 0, display: 'flex', marginLeft: '0.5rem' }}
        >
          <ChevronDown size={17} />
        </motion.span>
      </div>

      {/* Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.97 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.97 }}
            transition={{ duration: 0.18, ease: 'easeOut' }}
            style={{
              position: 'absolute',
              top: '100%', left: 0, right: 0,
              marginTop: '6px',
              backgroundColor: '#fff',
              borderRadius: 'var(--radius-md)',
              border: '1px solid #e2e8f0',
              boxShadow: '0 12px 32px rgba(0,0,0,0.12)',
              zIndex: 999,
              maxHeight: '240px',
              overflowY: 'auto',
              padding: '0.4rem',
            }}
          >
            {options.map((opt) => {
              const optVal = opt.id ?? opt.name;
              const isSelected = value === optVal;
              const label = opt.amharic ? `${opt.amharic} — ${opt.english}` : opt.name;
              return (
                <div
                  key={optVal}
                  onClick={() => handleSelect(optVal)}
                  style={{
                    display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                    padding: '0.7rem 0.9rem',
                    borderRadius: 'var(--radius-sm)',
                    backgroundColor: isSelected ? 'rgba(14,165,233,0.08)' : 'transparent',
                    color: isSelected ? 'var(--primary)' : 'var(--text-main)',
                    fontWeight: isSelected ? '600' : '400',
                    fontSize: '0.9rem',
                    cursor: 'pointer',
                    transition: 'background-color 0.15s',
                  }}
                  onMouseEnter={e => !isSelected && (e.currentTarget.style.backgroundColor = '#f8fafc')}
                  onMouseLeave={e => !isSelected && (e.currentTarget.style.backgroundColor = 'transparent')}
                >
                  <span>{label}</span>
                  {isSelected && <Check size={15} style={{ flexShrink: 0 }} />}
                </div>
              );
            })}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

/* Wrapper needed so PremiumSelect dropdown is positioned correctly */
export const SelectWrapper = ({ children }) => (
  <div style={{ position: 'relative' }}>{children}</div>
);
