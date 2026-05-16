import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Phone, ArrowRight, ArrowLeft, CheckCircle2, Camera } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthLayout from '../components/AuthLayout';
import { InputField, PremiumSelect } from '../components/FormFields';
import { CATEGORIES, POSITIONS, REGIONS } from '../data/roles';
import { useLanguage } from '../i18n/LanguageContext';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { t, language } = useLanguage();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    phone: '',
    category: '',
    subRole: '',
    region: '',
    position: '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name, value) => {
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      if (name === 'category') {
        newData.subRole = '';
        newData.region = '';
        newData.position = '';
      }
      return newData;
    });
  };

  const handleSubmit = async () => {
    setLoading(true);
    setError('');
    
    const apiUrl = import.meta.env.VITE_API_URL || '';
    
    try {
      const res = await fetch(`${apiUrl}/api/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStep(3);
        setTimeout(() => navigate('/login'), 4000);
      } else {
        setError(data.message || 'Registration failed');
      }
    } catch (err) {
      setError(t('err_server_connection'));
    } finally {
      setLoading(false);
    }
  };

  const isStep1Valid = 
    formData.fullName.trim() && 
    formData.username.trim() && 
    formData.password.length >= 6 && 
    formData.phone.trim();

  const isStep2Valid = formData.category === 'coordinator'
    ? (formData.subRole && (formData.subRole === 'main_office' ? !!formData.position : true))
    : (formData.region && formData.subRole);

  const getSubRoleOptions = () => {
    if (formData.category === 'coordinator') {
      return CATEGORIES.COORDINATOR.subDepartments.map(d => ({ 
        value: d.id, 
        label: language === 'am' ? d.amharic : d.label 
      }));
    }
    if (formData.category === 'regional') {
      return CATEGORIES.REGIONAL.subDepartments.map(d => ({ 
        value: d.id, 
        label: language === 'am' ? d.amharic : d.label 
      }));
    }
    return [];
  };

  const getRegionOptions = () => {
    return REGIONS.map(r => ({ 
      value: r.id, 
      label: language === 'am' ? r.amharic : r.label 
    }));
  };

  const getPositionOptions = () => {
    return POSITIONS.map(p => ({ 
      value: p.id, 
      label: language === 'am' ? p.amharic : p.label 
    }));
  };

  return (
    <AuthLayout 
      title={step === 3 ? t('step_success') : t('signup_title')} 
      subtitle={step === 3 ? t('success_msg') : t('signup_subtitle')}
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

      {/* Progress Bar */}
      {step < 3 && (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%', 
              backgroundColor: step >= 1 ? 'var(--primary)' : '#e2e8f0',
              color: '#fff', fontSize: '0.75rem', fontWeight: '700',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>1</div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: step >= 1 ? 'var(--text-main)' : 'var(--text-subtle)', textTransform: 'uppercase' }}>
              {t('step_account')}
            </span>
          </div>
          <div style={{ width: '40px', height: '2px', backgroundColor: step >= 2 ? 'var(--primary)' : '#e2e8f0' }} />
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{
              width: '24px', height: '24px', borderRadius: '50%', 
              backgroundColor: step >= 2 ? 'var(--primary)' : '#e2e8f0',
              color: '#fff', fontSize: '0.75rem', fontWeight: '700',
              display: 'flex', alignItems: 'center', justifyContent: 'center'
            }}>2</div>
            <span style={{ fontSize: '0.75rem', fontWeight: '700', color: step >= 2 ? 'var(--text-main)' : 'var(--text-subtle)', textTransform: 'uppercase' }}>
              {t('step_role')}
            </span>
          </div>
        </div>
      )}

      {error && (
        <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', color: 'var(--danger)', fontSize: '0.85rem', marginBottom: '1.5rem' }}>
          {error}
        </div>
      )}

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          >
            {/* Photo Upload Placeholder */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: '100px', height: '100px', borderRadius: '50%', backgroundColor: '#f8fafc', border: '2px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                  <User size={40} />
                </div>
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: '32px', height: '32px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff', cursor: 'pointer' }}>
                  <Camera size={16} />
                </div>
              </div>
            </div>

            <InputField label={t('label_fullname')} name="fullName" value={formData.fullName} onChange={handleChange} required placeholder={t('placeholder_fullname') || "Abebe Bikila"} />
            <InputField label={t('label_username')} name="username" value={formData.username} onChange={handleChange} required icon={User} placeholder={t('label_username')} />
            <InputField label={t('label_phone')} type="tel" name="phone" value={formData.phone} onChange={handleChange} required icon={Phone} placeholder="+251 9XX XXX XXX" />
            <InputField label={t('label_password')} type="password" name="password" value={formData.password} onChange={handleChange} required icon={Lock} placeholder="••••••••" />
            <p style={{ fontSize: '0.75rem', color: formData.password && formData.password.length < 6 ? 'var(--danger)' : 'var(--text-subtle)', marginTop: '-0.75rem' }}>
              {t('hint_password')}
            </p>

            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setStep(2)}
              disabled={!isStep1Valid}
              style={{
                marginTop: '1rem', padding: '1rem', borderRadius: '12px',
                backgroundColor: 'var(--accent)', color: 'white', border: 'none',
                fontWeight: '700', cursor: isStep1Valid ? 'pointer' : 'not-allowed',
                opacity: isStep1Valid ? 1 : 0.6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
              }}
            >
              {t('btn_continue')}
              <ArrowRight size={18} />
            </motion.button>
          </motion.div>
        )}

        {step === 2 && (
          <motion.div
            key="step2"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          >
            <div>
              <label style={{ display: 'block', fontSize: '0.85rem', fontWeight: '700', color: 'var(--text-subtle)', marginBottom: '1rem', textTransform: 'uppercase' }}>
                {t('category_title')}
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div 
                  onClick={() => handleSelectChange('category', 'coordinator')}
                  style={{
                    padding: '1.25rem', borderRadius: '16px', border: `2px solid ${formData.category === 'coordinator' ? 'var(--accent)' : '#f1f5f9'}`,
                    backgroundColor: formData.category === 'coordinator' ? 'var(--accent)05' : '#fff',
                    cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>🛡️</div>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{t('amharic_coordinator')}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>{t('label_coordinator')}</div>
                </div>
                <div 
                  onClick={() => handleSelectChange('category', 'regional')}
                  style={{
                    padding: '1.25rem', borderRadius: '16px', border: `2px solid ${formData.category === 'regional' ? 'var(--accent)' : '#f1f5f9'}`,
                    backgroundColor: formData.category === 'regional' ? 'var(--accent)05' : '#fff',
                    cursor: 'pointer', textAlign: 'center', transition: 'all 0.2s'
                  }}
                >
                  <div style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>👥</div>
                  <div style={{ fontWeight: '700', fontSize: '0.9rem' }}>{t('amharic_regional')}</div>
                  <div style={{ fontSize: '0.7rem', color: 'var(--text-subtle)' }}>{t('label_regional')}</div>
                </div>
              </div>
            </div>

            {formData.category === 'regional' && (
              <PremiumSelect 
                label={t('label_region')}
                options={getRegionOptions()}
                value={formData.region}
                onChange={(val) => handleSelectChange('region', val)}
                placeholder={t('placeholder_region')}
              />
            )}

            {formData.category && (
              <PremiumSelect 
                label={formData.category === 'coordinator' ? t('label_department') : t('label_sub_dept')}
                options={getSubRoleOptions()}
                value={formData.subRole}
                onChange={(val) => handleSelectChange('subRole', val)}
                placeholder={formData.category === 'coordinator' ? t('placeholder_department') : t('placeholder_sub_dept')}
              />
            )}

            {formData.category === 'coordinator' && formData.subRole === 'main_office' && (
              <PremiumSelect 
                label={t('label_position')}
                options={getPositionOptions()}
                value={formData.position}
                onChange={(val) => handleSelectChange('position', val)}
                placeholder={t('placeholder_position')}
              />
            )}

            <div style={{ display: 'grid', gridTemplateColumns: '100px 1fr', gap: '1rem', marginTop: '1rem' }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  padding: '1rem', borderRadius: '12px', backgroundColor: '#f1f5f9', color: 'var(--text-main)', border: 'none', fontWeight: '600', cursor: 'pointer'
                }}
              >
                {t('btn_back')}
              </button>
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSubmit}
                disabled={loading || !isStep2Valid}
                style={{
                  padding: '1rem', borderRadius: '12px', backgroundColor: 'var(--primary)', color: 'white', border: 'none', fontWeight: '700', cursor: loading || !isStep2Valid ? 'not-allowed' : 'pointer', opacity: loading || !isStep2Valid ? 0.6 : 1
                }}
              >
                {loading ? t('loading_authenticating') : t('btn_complete')}
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: '2rem 0' }}
          >
            <div style={{ width: '80px', height: '80px', borderRadius: '50%', backgroundColor: '#f0fdf4', color: 'var(--success)', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem' }}>
              <CheckCircle2 size={48} />
            </div>
            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', marginBottom: '0.5rem' }}>{t('step_success')}</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>{t('success_redirect')}</p>
            <Link to="/login" style={{ display: 'inline-block', padding: '0.75rem 2rem', borderRadius: '12px', backgroundColor: 'var(--primary)', color: '#fff', textDecoration: 'none', fontWeight: '700' }}>
              {t('btn_signin')}
            </Link>
          </motion.div>
        )}
      </AnimatePresence>

      {step < 3 && (
        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.9rem' }}>
          {t('no_account_text') === "Don't have an account?" ? "Already have an account?" : "አካውንት አለዎት?"}{' '}
          <Link to="/login" style={{ color: 'var(--accent)', fontWeight: '700', textDecoration: 'none' }}>
            {t('btn_signin')}
          </Link>
        </p>
      )}
    </AuthLayout>
  );
};

export default SignUpPage;
