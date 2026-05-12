import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User, Lock, Phone, Camera, Shield, Users, Building2, MapPin, Landmark, ChevronRight, ChevronLeft, CheckCircle2, Loader2 } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import AuthLayout from '../components/AuthLayout';
import { InputField, CategoryCard, PremiumSelect, SelectWrapper } from '../components/FormFields';
import { CATEGORIES, COORDINATOR_ROLES, REGIONAL_ROLES, REGIONS, MAIN_OFFICE_POSITIONS } from '../data/roles';

const STEPS = ['Account', 'Role'];

const StepIndicator = ({ step }) => (
  <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', marginBottom: '2rem' }}>
    {STEPS.map((label, i) => {
      const idx = i + 1;
      const active = step === idx;
      const done = step > idx;
      return (
        <React.Fragment key={label}>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '4px' }}>
            <div style={{
              width: '32px', height: '32px', borderRadius: '50%',
              backgroundColor: done ? 'var(--primary)' : active ? 'var(--primary)' : '#e2e8f0',
              color: done || active ? '#fff' : 'var(--text-subtle)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontWeight: '700', fontSize: '0.85rem',
              boxShadow: active ? '0 4px 12px rgba(14,165,233,0.35)' : 'none',
              transition: 'all 0.3s',
            }}>
              {done ? <CheckCircle2 size={16} /> : idx}
            </div>
            <span style={{ fontSize: '0.7rem', fontWeight: '600', color: active ? 'var(--primary)' : 'var(--text-subtle)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>
              {label}
            </span>
          </div>
          {i < STEPS.length - 1 && (
            <div style={{ width: '48px', height: '2px', backgroundColor: step > idx ? 'var(--primary)' : '#e2e8f0', borderRadius: '2px', marginBottom: '20px', transition: 'background-color 0.3s' }} />
          )}
        </React.Fragment>
      );
    })}
  </div>
);

const slideVariants = {
  initial: (dir) => ({ opacity: 0, x: dir > 0 ? 40 : -40 }),
  animate: { opacity: 1, x: 0 },
  exit: (dir) => ({ opacity: 0, x: dir > 0 ? -40 : 40 }),
};

const SignUpPage = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [dir, setDir] = useState(1);
  const [isProcessing, setIsProcessing] = useState(false);
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    password: '',
    phone: '',
    profilePicture: null,
    profilePreview: null,
    category: CATEGORIES.COORDINATOR.id,
    subRole: '',
    region: '',
    position: '',
  });

  // Auto-redirect after success
  useEffect(() => {
    if (step === 3) {
      const t = setTimeout(() => navigate('/login'), 4000);
      return () => clearTimeout(t);
    }
  }, [step, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      ...(name === 'category' ? { subRole: '', region: '', position: '' } : {}),
      ...(name === 'subRole' ? { position: '' } : {}),
    }));
  };

  const handleCategorySelect = (id) => {
    setFormData(prev => ({ ...prev, category: id, subRole: '', region: '', position: '' }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData(prev => ({
        ...prev,
        profilePicture: file,
        profilePreview: URL.createObjectURL(file),
      }));
    }
  };

  const goNext = () => { setDir(1); setStep(s => s + 1); };
  const goBack = () => { setDir(-1); setStep(s => s - 1); };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!isStep2Valid) return;
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      setDir(1);
      setStep(3);
    }, 2000);
  };

  const isStep1Valid = formData.fullName.trim() && formData.username.trim() && formData.password.trim() && formData.phone.trim();
  const isStep2Valid = formData.category === CATEGORIES.COORDINATOR.id
    ? (formData.subRole && (formData.subRole === 'main_office' ? !!formData.position : true))
    : (formData.region && formData.subRole);

  return (
    <AuthLayout
      title={step === 3 ? 'Registration Complete' : 'Create Account'}
      subtitle={step === 3 ? 'Redirecting to login...' : 'ወደ ሲስተሙ ለመቀላቀል ይመዝገቡ'}
    >
      {step < 3 && <StepIndicator step={step} />}

      <form onSubmit={handleSubmit} style={{ position: 'relative' }}>
        <AnimatePresence mode="wait" custom={dir}>
          {/* ── STEP 1: Account Info ── */}
          {step === 1 && (
            <motion.div
              key="step1"
              custom={dir}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {/* Profile Picture */}
              <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1.75rem' }}>
                <div
                  onClick={() => document.getElementById('pp-upload').click()}
                  style={{
                    width: '90px', height: '90px',
                    borderRadius: '22px',
                    border: `2px dashed ${formData.profilePreview ? 'var(--primary)' : '#cbd5e1'}`,
                    backgroundColor: formData.profilePreview ? 'transparent' : '#f8fafc',
                    cursor: 'pointer',
                    overflow: 'hidden',
                    display: 'flex', flexDirection: 'column',
                    alignItems: 'center', justifyContent: 'center',
                    gap: '4px',
                    transition: 'border-color 0.2s, transform 0.2s',
                    position: 'relative',
                  }}
                  onMouseEnter={e => e.currentTarget.style.transform = 'scale(1.04)'}
                  onMouseLeave={e => e.currentTarget.style.transform = 'scale(1)'}
                >
                  {formData.profilePreview ? (
                    <img src={formData.profilePreview} alt="Profile" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  ) : (
                    <>
                      <Camera size={22} color="#94a3b8" />
                      <span style={{ fontSize: '0.65rem', fontWeight: '700', color: '#94a3b8', letterSpacing: '0.04em' }}>PHOTO</span>
                    </>
                  )}
                  <input id="pp-upload" type="file" accept="image/*" hidden onChange={handleFileChange} />
                </div>
              </div>

              {/* Fields in a grid */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0 1rem' }}>
                <InputField label="Full Name" name="fullName" value={formData.fullName} onChange={handleChange} required icon={User} placeholder="Abebe Bikila" />
                <InputField label="Username" name="username" value={formData.username} onChange={handleChange} required icon={User} placeholder="abebe123" />
              </div>
              <InputField label="Phone Number" type="tel" name="phone" value={formData.phone} onChange={handleChange} required icon={Phone} placeholder="+251 9XX XXX XXX" />
              <InputField label="Password" type="password" name="password" value={formData.password} onChange={handleChange} required icon={Lock} placeholder="Create a strong password" />

              <motion.button
                type="button"
                onClick={goNext}
                disabled={!isStep1Valid}
                whileHover={isStep1Valid ? { scale: 1.02 } : {}}
                whileTap={isStep1Valid ? { scale: 0.98 } : {}}
                style={{
                  marginTop: '0.5rem',
                  width: '100%', padding: '0.95rem',
                  background: isStep1Valid ? 'linear-gradient(135deg, #0ea5e9, #6366f1)' : '#e2e8f0',
                  color: isStep1Valid ? '#fff' : 'var(--text-subtle)',
                  border: 'none', borderRadius: 'var(--radius-md)',
                  fontSize: '0.95rem', fontWeight: '700',
                  cursor: isStep1Valid ? 'pointer' : 'not-allowed',
                  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                  boxShadow: isStep1Valid ? '0 8px 20px rgba(14,165,233,0.30)' : 'none',
                  transition: 'all 0.25s',
                }}
              >
                Continue <ChevronRight size={20} />
              </motion.button>
            </motion.div>
          )}

          {/* ── STEP 2: Role Selection ── */}
          {step === 2 && (
            <motion.div
              key="step2"
              custom={dir}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.3, ease: 'easeInOut' }}
            >
              {/* Category Cards */}
              <div style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.8rem', fontWeight: '600', color: 'var(--text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', marginBottom: '0.75rem', textAlign: 'center' }}>
                  Primary Category
                </p>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <CategoryCard
                    amharic="ማስተባበሪያ"
                    english="Coordinator"
                    icon={Shield}
                    selected={formData.category === CATEGORIES.COORDINATOR.id}
                    onClick={() => handleCategorySelect(CATEGORIES.COORDINATOR.id)}
                    color="#0ea5e9"
                  />
                  <CategoryCard
                    amharic="ግንኙነት ማዕከል"
                    english="Regional"
                    icon={Users}
                    selected={formData.category === CATEGORIES.REGIONAL.id}
                    onClick={() => handleCategorySelect(CATEGORIES.REGIONAL.id)}
                    color="#6366f1"
                  />
                </div>
              </div>

              {/* Coordinator fields */}
              <AnimatePresence mode="wait">
                {formData.category === CATEGORIES.COORDINATOR.id && (
                  <motion.div key="coordinator" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                    <SelectWrapper>
                      <PremiumSelect label="Department" name="subRole" value={formData.subRole} onChange={handleChange} options={COORDINATOR_ROLES} placeholder="Select your department" icon={Building2} required />
                    </SelectWrapper>

                    <AnimatePresence>
                      {formData.subRole === 'main_office' && (
                        <motion.div initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.2 }}>
                          <SelectWrapper>
                            <PremiumSelect label="Position" name="position" value={formData.position} onChange={handleChange} options={MAIN_OFFICE_POSITIONS} placeholder="Select your position" icon={Landmark} required />
                          </SelectWrapper>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                )}

                {/* Regional fields */}
                {formData.category === CATEGORIES.REGIONAL.id && (
                  <motion.div key="regional" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.25 }}>
                    <SelectWrapper>
                      <PremiumSelect label="Region" name="region" value={formData.region} onChange={handleChange} options={REGIONS} placeholder="Select your region" icon={MapPin} required />
                    </SelectWrapper>
                    <SelectWrapper>
                      <PremiumSelect label="Sub-department" name="subRole" value={formData.subRole} onChange={handleChange} options={REGIONAL_ROLES} placeholder="Select your role" icon={Building2} required />
                    </SelectWrapper>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Buttons */}
              <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.25rem' }}>
                <button
                  type="button"
                  onClick={goBack}
                  style={{
                    flex: '0 0 auto',
                    padding: '0.95rem 1.25rem',
                    background: '#fff', color: 'var(--text-main)',
                    border: '2px solid #e2e8f0', borderRadius: 'var(--radius-md)',
                    fontWeight: '600', cursor: 'pointer',
                    display: 'flex', alignItems: 'center', gap: '0.4rem',
                    fontSize: '0.9rem',
                  }}
                >
                  <ChevronLeft size={18} /> Back
                </button>
                <motion.button
                  type="submit"
                  disabled={!isStep2Valid || isProcessing}
                  whileHover={isStep2Valid ? { scale: 1.02 } : {}}
                  whileTap={isStep2Valid ? { scale: 0.98 } : {}}
                  style={{
                    flex: 1, padding: '0.95rem',
                    background: isStep2Valid ? 'linear-gradient(135deg, #0ea5e9, #6366f1)' : '#e2e8f0',
                    color: isStep2Valid ? '#fff' : 'var(--text-subtle)',
                    border: 'none', borderRadius: 'var(--radius-md)',
                    fontSize: '0.95rem', fontWeight: '700',
                    cursor: isStep2Valid ? 'pointer' : 'not-allowed',
                    display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem',
                    boxShadow: isStep2Valid ? '0 8px 20px rgba(14,165,233,0.30)' : 'none',
                    transition: 'all 0.25s',
                  }}
                >
                  {isProcessing ? (
                    <><motion.span animate={{ rotate: 360 }} transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }} style={{ display: 'flex' }}><Loader2 size={20} /></motion.span> Creating account...</>
                  ) : 'Complete Registration'}
                </motion.button>
              </div>
            </motion.div>
          )}

          {/* ── STEP 3: Success ── */}
          {step === 3 && (
            <motion.div
              key="step3"
              custom={dir}
              variants={slideVariants}
              initial="initial"
              animate="animate"
              exit="exit"
              transition={{ duration: 0.4, ease: 'easeInOut' }}
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
                Welcome, {formData.fullName.split(' ')[0]}!
              </h2>
              <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginBottom: '0.5rem' }}>
                Your account has been created.
              </p>
              <p style={{ color: 'var(--text-subtle)', fontSize: '0.85rem', marginBottom: '2rem' }}>
                You will be redirected to login automatically...
              </p>

              {/* Progress bar */}
              <div style={{ height: '4px', backgroundColor: '#e2e8f0', borderRadius: '4px', marginBottom: '1.5rem', overflow: 'hidden' }}>
                <motion.div
                  initial={{ width: '0%' }}
                  animate={{ width: '100%' }}
                  transition={{ duration: 4, ease: 'linear' }}
                  style={{ height: '100%', background: 'linear-gradient(90deg, #0ea5e9, #6366f1)', borderRadius: '4px' }}
                />
              </div>

              <button
                type="button"
                onClick={() => navigate('/login')}
                style={{
                  width: '100%', padding: '0.95rem',
                  background: 'linear-gradient(135deg, #0ea5e9, #6366f1)',
                  color: '#fff', border: 'none', borderRadius: 'var(--radius-md)',
                  fontSize: '0.95rem', fontWeight: '700', cursor: 'pointer',
                  boxShadow: '0 8px 20px rgba(14,165,233,0.30)',
                }}
              >
                Sign In Now →
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </form>

      {step < 3 && (
        <p style={{ textAlign: 'center', marginTop: '1.75rem', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          Already have an account?{' '}
          <Link to="/login" style={{ color: 'var(--primary)', fontWeight: '700', textDecoration: 'none' }}>
            Sign In
          </Link>
        </p>
      )}
    </AuthLayout>
  );
};

export default SignUpPage;
