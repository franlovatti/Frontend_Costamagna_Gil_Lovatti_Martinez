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
    container: {
      position: 'relative' as const,
      width: '56px',
      height: '28px'
    },
    button: {
      width: '100%',
      height: '100%',
      backgroundColor: 'var(--background)',
      border: '1px solid var(--border)',
      borderRadius: '14px',
      cursor: 'pointer',
      position: 'relative' as const,
      transition: 'all 0.3s ease',
      padding: 0
    },
    toggle: {
      position: 'absolute' as const,
      top: '3px',
      left: theme === 'dark' ? '3px' : '29px',
      width: '20px',
      height: '20px',
      borderRadius: '50%',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontSize: '10px'
    }
  };

  return (
    <div style={styles.container}>
      <button
        style={styles.button}
        onClick={toggleTheme}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'var(--border-hover)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'var(--border)';
        }}
        aria-label={`Cambiar a tema ${theme === 'dark' ? 'claro' : 'oscuro'}`}
        title={theme === 'dark' ? 'Cambiar a tema claro' : 'Cambiar a tema oscuro'}
      >
        <div style={styles.toggle}>
          {theme === 'dark' ? '🌙' : '☀️'}
        </div>
      </button>
    </div>
  );
};

export default ThemeToggle;