import React from 'react';
import { Link } from 'react-router-dom';
import { Home, FileText, Heart, Book, Users, GraduationCap, LogIn, UserPlus } from 'lucide-react';
import AccessCard from '../components/AccessCard';

const departments = [
  {
    icon: Home,
    titleAmharic: 'ጽሕፈት ቤት',
    titleEnglish: 'Main Office',
    description: 'Full access to all dashboards and reports',
    iconColor: '#ef4444', // Red
  },
  {
    icon: FileText,
    titleAmharic: 'ፕሮጀክት ክፍል',
    titleEnglish: 'Project Department',
    description: 'Manage project tasks and updates',
    iconColor: '#0ea5e9', // Blue
  },
  {
    icon: Heart,
    titleAmharic: 'ሐዋርያዊ አገልግሎት ክፍል',
    titleEnglish: 'Apostolic Service Department',
    description: 'Manage apostolic services',
    iconColor: '#0ea5e9', // Blue
  },
  {
    icon: Book,
    titleAmharic: 'ስብከተ ወንጌል ርቀት ት/ቤት',
    titleEnglish: 'Gospel Distance School',
    description: 'Manage distance education programs',
    iconColor: '#0ea5e9', // Blue
  },
  {
    icon: Users,
    titleAmharic: 'መንፈሳዊ ት/ቤቶች',
    titleEnglish: 'Spiritual Schools',
    description: 'Manage spiritual education',
    iconColor: '#0ea5e9', // Blue
  },
  {
    icon: GraduationCap,
    titleAmharic: 'ትምህርት አገልግሎት ክፍል',
    titleEnglish: 'Education Service Department',
    description: 'Manage education services',
    iconColor: '#0ea5e9', // Blue
  },
];

const SelectionPage = () => {
  return (
    <div
      className="selection-page"
      style={{
        padding: '2rem',
        maxWidth: '1200px',
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        flex: 1,
      }}
    >
      <div style={{ width: '100%', display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginBottom: '2rem' }}>
        <Link to="/login" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', color: 'var(--primary-blue)', fontWeight: '600', fontSize: '0.875rem' }}>
          <LogIn size={18} /> Sign In
        </Link>
        <Link to="/signup" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', textDecoration: 'none', backgroundColor: 'var(--primary-blue)', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', fontWeight: '600', fontSize: '0.875rem' }}>
          <UserPlus size={18} /> Sign Up
        </Link>
      </div>
      <header style={{ textAlign: 'center', marginBottom: '3rem' }}>
        <h1
          style={{
            fontSize: '2.5rem',
            fontWeight: '700',
            color: 'var(--text-main)',
            marginBottom: '0.5rem',
          }}
        >
          System Access Management
        </h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)' }}>
          Please identify yourself to access the system
        </p>
      </header>

      <div
        className="cards-grid"
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem',
          width: '100%',
          marginBottom: '4rem',
        }}
      >
        {departments.map((dept, index) => (
          <AccessCard key={index} {...dept} />
        ))}
      </div>

      <div
        className="info-box"
        style={{
          backgroundColor: 'rgba(224, 242, 254, 0.5)',
          padding: '2rem',
          borderRadius: '1rem',
          border: '1px solid #bae6fd',
          width: '100%',
          marginBottom: '4rem',
        }}
      >
        <h3
          style={{
            fontSize: '1.25rem',
            fontWeight: '700',
            marginBottom: '1rem',
            color: '#0c4a6e',
          }}
        >
          ስለ ሥርዓቱ / About This System
        </h3>
        <p style={{ color: '#0369a1', lineHeight: '1.6' }}>
          This system provides role-based access to organizational dashboards. Office staff have edit access across all departments, while department staff can only edit their own department's information. All users can view all departments in read-only mode.
        </p>
      </div>

      <footer
        style={{
          textAlign: 'center',
          color: 'var(--text-muted)',
          fontSize: '0.875rem',
          marginTop: 'auto',
          paddingBottom: '2rem',
        }}
      >
        © 2024 Mahibere Kidusan. All rights reserved.
      </footer>
    </div>
  );
};

export default SelectionPage;
