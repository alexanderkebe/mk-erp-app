import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  User, Lock, Phone, ArrowRight, ChevronLeft, 
  CheckCircle2, Camera, Building2, Landmark, MapPin, 
  Loader2, Shield, Users 
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthLayout from '../components/AuthLayout';
import { InputField, PremiumSelect, CategoryCard, SelectWrapper } from '../components/FormFields';
import { 
  CATEGORIES, 
  COORDINATOR_ROLES, 
  REGIONAL_ROLES, 
  MAIN_OFFICE_POSITIONS, 
  REGIONS 
} from '../data/roles';
import { useLanguage } from '../i18n/LanguageContext';

const SignUpPage = () => {
  const navigate = useNavigate();
  const { t, language, toggleLanguage } = useLanguage();
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

  const handleCategorySelect = (categoryId) => {
    setFormData(prev => ({
      ...prev,
      category: categoryId,
      subRole: '',
      region: '',
      position: ''
    }));
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setLoading(true);
    setError('');
    
    try {
      const res = await fetch('/api/auth/register', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });

      const data = await res.json();

      if (res.ok) {
        setStep(3);
        setTimeout(() => navigate('/login'), 5000);
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
    const source = formData.category === 'coordinator' ? COORDINATOR_ROLES : REGIONAL_ROLES;
    return (source || []).map(r => ({
      id: r.id,
      amharic: r.amharic,
      english: r.english
    }));
  };

  const getRegionOptions = () => {
    return REGIONS.map(r => ({
      id: r.id,
      amharic: r.amharic || r.name,
      english: r.name
    }));
  };

  const getPositionOptions = () => {
    return MAIN_OFFICE_POSITIONS.map(p => ({
      id: p.id,
      amharic: p.amharic,
      english: p.english
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

      <AnimatePresence mode="wait">
        {step === 1 && (
          <motion.div
            key="step1"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}
          >
            {/* Step Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#fff', fontSize: '0.75rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>1</div>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('step_account')}</span>
              <div style={{ flex: 1, height: '2px', backgroundColor: '#f1f5f9' }} />
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: '#f1f5f9', color: 'var(--text-subtle)', fontSize: '0.75rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</div>
            </div>

            {/* Photo */}
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '0.5rem' }}>
              <div style={{ position: 'relative' }}>
                <div style={{ width: '96px', height: '96px', borderRadius: '50%', backgroundColor: '#f8fafc', border: '2px dashed #cbd5e1', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#94a3b8' }}>
                  <User size={38} />
                </div>
                <div style={{ position: 'absolute', bottom: 0, right: 0, width: '30px', height: '30px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #fff', cursor: 'pointer' }}>
                  <Camera size={14} />
                </div>
              </div>
            </div>

            <InputField label={t('label_fullname')} name="fullName" value={formData.fullName} onChange={handleChange} required placeholder={t('placeholder_fullname')} />
            <InputField label={t('label_username')} name="username" value={formData.username} onChange={handleChange} required icon={User} placeholder={t('placeholder_username')} />
            <InputField label={t('label_phone')} type="tel" name="phone" value={formData.phone} onChange={handleChange} required icon={Phone} placeholder={t('placeholder_phone')} />
            <InputField label={t('label_password')} type="password" name="password" value={formData.password} onChange={handleChange} required icon={Lock} placeholder="••••••••" />
            <p style={{ fontSize: '0.75rem', color: formData.password && formData.password.length < 6 ? 'var(--danger)' : 'var(--text-subtle)', marginTop: '-0.75rem' }}>
              {t('hint_password')}
            </p>

            <motion.button
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              onClick={() => setStep(2)}
              disabled={!isStep1Valid}
              style={{
                marginTop: '0.5rem', padding: '1rem', borderRadius: 'var(--radius-md)',
                backgroundColor: 'var(--accent)', color: 'white', border: 'none',
                fontWeight: '700', cursor: isStep1Valid ? 'pointer' : 'not-allowed',
                opacity: isStep1Valid ? 1 : 0.6, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem',
                boxShadow: isStep1Valid ? '0 4px 12px rgba(99, 102, 241, 0.25)' : 'none'
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
            {/* Step Indicator */}
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--success)', color: '#fff', fontSize: '0.75rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}><CheckCircle2 size={14} /></div>
              <div style={{ flex: 1, height: '2px', backgroundColor: 'var(--primary)' }} />
              <div style={{ width: '24px', height: '24px', borderRadius: '50%', backgroundColor: 'var(--primary)', color: '#fff', fontSize: '0.75rem', fontWeight: '700', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>2</div>
              <span style={{ fontSize: '0.75rem', fontWeight: '800', color: 'var(--text-main)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>{t('step_role')}</span>
            </div>

            {error && (
              <div style={{ padding: '0.75rem', backgroundColor: '#fef2f2', border: '1px solid #fecaca', borderRadius: '12px', color: 'var(--danger)', fontSize: '0.85rem' }}>
                {error}
              </div>
            )}

            <div>
              <label style={{ display: 'block', fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', marginBottom: '0.8rem', textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                {t('category_title')}
              </label>
              <div style={{ display: 'flex', gap: '1rem' }}>
                <CategoryCard
                  selected={formData.category === 'coordinator'}
                  onClick={() => handleCategorySelect('coordinator')}
                  amharic="ማስተባበሪያ"
                  english="Coordinator"
                  icon={Shield}
                  color="#0ea5e9"
                />
                <CategoryCard
                  selected={formData.category === 'regional'}
                  onClick={() => handleCategorySelect('regional')}
                  amharic="ግንኙነት ማዕከል"
                  english="Regional"
                  icon={Users}
                  color="#6366f1"
                />
              </div>
            </div>

            <AnimatePresence mode="wait">
              {formData.category === 'coordinator' && (
                <motion.div key="coordinator" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <SelectWrapper>
                    <PremiumSelect 
                      label={t('label_department')}
                      name="subRole" 
                      value={formData.subRole} 
                      onChange={handleChange} 
                      options={getSubRoleOptions()} 
                      placeholder={t('placeholder_department')} 
                      icon={Building2} 
                      required 
                    />
                  </SelectWrapper>

                  <AnimatePresence>
                    {formData.subRole === 'main_office' && (
                      <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
                        <SelectWrapper>
                          <PremiumSelect 
                            label={t('label_position')}
                            name="position" 
                            value={formData.position} 
                            onChange={handleChange} 
                            options={getPositionOptions()} 
                            placeholder={t('placeholder_position')} 
                            icon={Landmark} 
                            required 
                          />
                        </SelectWrapper>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              )}

              {formData.category === 'regional' && (
                <motion.div key="regional" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                  <SelectWrapper>
                    <PremiumSelect 
                      label={t('label_region')}
                      name="region" 
                      value={formData.region} 
                      onChange={handleChange} 
                      options={getRegionOptions()} 
                      placeholder={t('placeholder_region')} 
                      icon={MapPin} 
                      required 
                    />
                  </SelectWrapper>
                  <SelectWrapper>
                    <PremiumSelect 
                      label={t('label_sub_dept')}
                      name="subRole" 
                      value={formData.subRole} 
                      onChange={handleChange} 
                      options={getSubRoleOptions()} 
                      placeholder={t('placeholder_sub_dept')} 
                      icon={Building2} 
                      required 
                    />
                  </SelectWrapper>
                </motion.div>
              )}
            </AnimatePresence>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button
                onClick={() => setStep(1)}
                style={{
                  flex: '0 0 auto', padding: '0.9rem 1.5rem', borderRadius: 'var(--radius-md)',
                  backgroundColor: '#fff', color: 'var(--text-main)', border: '2px solid #e2e8f0',
                  fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem'
                }}
              >
                <ChevronLeft size={18} /> {t('btn_back')}
              </button>
              <motion.button
                whileHover={isStep2Valid ? { scale: 1.01 } : {}}
                whileTap={isStep2Valid ? { scale: 0.99 } : {}}
                onClick={handleSubmit}
                disabled={loading || !isStep2Valid}
                style={{
                  flex: 1, padding: '0.9rem', borderRadius: 'var(--radius-md)',
                  background: isStep2Valid ? 'linear-gradient(135deg, #0ea5e9, #6366f1)' : '#e2e8f0',
                  color: isStep2Valid ? '#fff' : 'var(--text-subtle)', border: 'none',
                  fontWeight: '700', cursor: loading || !isStep2Valid ? 'not-allowed' : 'pointer',
                  boxShadow: isStep2Valid ? '0 8px 20px rgba(14,165,233,0.3)' : 'none',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem'
                }}
              >
                {loading ? <Loader2 size={20} className="animate-spin" /> : t('btn_complete')}
              </motion.button>
            </div>
          </motion.div>
        )}

        {step === 3 && (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            style={{ textAlign: 'center', padding: '1.5rem 0' }}
          >
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.1 }}
              style={{
                display: 'inline-flex', alignItems: 'center', justifyContent: 'center',
                width: '88px', height: '88px', borderRadius: '50%',
                background: 'linear-gradient(135deg, #22c55e20, #22c55e10)',
                color: '#22c55e', marginBottom: '1.5rem',
              }}
            >
              <CheckCircle2 size={52} />
            </motion.div>

            <h2 style={{ fontSize: '1.5rem', fontWeight: '800', color: 'var(--text-main)', marginBottom: '0.5rem' }}>
              {t('success_welcome').replace('{name}', formData.fullName.split(' ')[0])}
            </h2>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '2rem' }}>
              {t('success_msg')}
            </p>

            <div style={{ height: '4px', backgroundColor: '#e2e8f0', borderRadius: '4px', marginBottom: '1.5rem', overflow: 'hidden' }}>
              <motion.div
                initial={{ width: '0%' }}
                animate={{ width: '100%' }}
                transition={{ duration: 5, ease: 'linear' }}
                style={{ height: '100%', background: 'linear-gradient(90deg, #0ea5e9, #6366f1)', borderRadius: '4px' }}
              />
            </div>

            <button
              onClick={() => navigate('/login')}
              style={{
                width: '100%', padding: '0.95rem',
                background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                color: '#fff', border: 'none', borderRadius: 'var(--radius-md)',
                fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer',
                boxShadow: '0 8px 20px rgba(14,165,233,0.30)',
              }}
            >
              {t('btn_signin_now') || 'Sign In Now'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {step < 3 && (
        <p style={{ textAlign: 'center', marginTop: '2rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
          {language === 'am' ? 'አካውንት አለዎት?' : 'Already have an account?'}{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>
            {t('btn_signin')}
          </Link>
        </p>
      )}
    </AuthLayout>
  );
};

export default SignUpPage;
