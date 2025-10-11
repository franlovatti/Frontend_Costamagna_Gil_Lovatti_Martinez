import { useState, useEffect } from 'react';

const ThemeToggle = () => {
  // Cargar tema guardado o usar 'dark' por defecto
  const [theme, setTheme] = useState(() => {
    const savedTheme = localStorage.getItem('theme');
    return savedTheme || 'dark';
  });

  useEffect(() => {
    // Aplicar el tema al documento
    document.documentElement.setAttribute('data-theme', theme);
    // Guardar en localStorage
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'dark' ? 'light' : 'dark');
  };

  const styles = {
    button: {
      padding: '0.5rem 1rem',
      backgroundColor: 'var(--background-secondary)',
      border: '1px solid var(--border)',
      borderRadius: '6px',
      color: 'var(--text)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      fontSize: '0.95rem',
      fontWeight: '300',
      display: 'flex',
      alignItems: 'center',
      gap: '0.5rem'
    }
  };

  return (
    <button
      style={styles.button}
      onClick={toggleTheme}
      onMouseEnter={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--hover-bg)';
        e.currentTarget.style.borderColor = 'var(--border-hover)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.backgroundColor = 'var(--background-secondary)';
        e.currentTarget.style.borderColor = 'var(--border)';
      }}
      aria-label={`Cambiar a tema ${theme === 'dark' ? 'claro' : 'oscuro'}`}
    >
      <span style={{ fontSize: '1.2rem' }}>
        {theme === 'dark' ? '🌙' : '☀️'}
      </span>
      <span>
        {theme === 'dark' ? 'Oscuro' : 'Claro'}
      </span>
    </button>
  );
};

export default ThemeToggle;