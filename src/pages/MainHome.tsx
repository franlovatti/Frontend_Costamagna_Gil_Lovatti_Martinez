import { useAuth } from '../hooks/useAuth';
import { useDeporte } from '../hooks/useDeporte.tsx';
import { useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import apiAxios from '../helpers/api';
import type { Torneo } from '../types';
import './MainHome.css';
import CardTorneos from '../components/CardTorneos';
import StatCard from '../components/admin/StatCard';

export default function MainHome() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [featuredTorneos, setFeaturedTorneos] = useState<Torneo[]>([]);
  const { deportes } = useDeporte();
  const [stats, setStats] = useState({
    totalTorneos: 0,
    participantes: 0,
    deportes: 0
  });

  //Esto hay que pasarlo al provider de Torneo cuando se acomode eso
  useEffect(() => {
    // Cargar torneos destacados y estadísticas
    apiAxios.get('/eventos')
      .then((res) => {
        const torneos = res.data.data || [];
        setFeaturedTorneos(torneos.slice(0, 3)); // Primeros 3 torneos
        setStats({
          totalTorneos: torneos.length,
          participantes: torneos.reduce((acc: number, t: Torneo) => 
            acc + (t.equipos?.length || 0), 0),
          deportes: deportes.length
        });
      })
      .catch((error) => console.error('Error cargando datos:', error));
  }, [deportes]);

  const features = [
    {
      icon: '🏆',
      title: 'Crea Torneos',
      description: 'Organiza competiciones personalizadas con formatos de liga o copa'
    },
    {
      icon: '👥',
      title: 'Juega en Equipo',
      description: 'Forma equipos con tus amigos o participa individualmente'
    },
    {
      icon: '📊',
      title: 'Seguimiento en Vivo',
      description: 'Consulta estadísticas, tablas de posiciones y resultados en tiempo real'
    },
    {
      icon: '🎯',
      title: 'Múltiples Deportes',
      description: 'Más de 15 disciplinas deportivas disponibles para competir'
    }
  ];

  return (
    <div className="main-home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            Bienvenido a <span className="text-gradient">Gestor de Torneos</span>
          </h1>
          {user && (
            <p className="hero-greeting">
              ¡Hola, <strong>{user.nombre}</strong>! 👋
            </p>
          )}
          <p className="hero-description">
            La plataforma definitiva para organizar, gestionar y participar en 
            torneos deportivos. Crea competiciones épicas o únete a las existentes.
          </p>
          <div className="hero-actions">
            <button 
              className="btn-hero-primary"
              onClick={() => navigate('/home/torneos/crear-torneo')}
            >
              Crear Torneo
            </button>
            <button 
              className="btn-hero-secondary"
              onClick={() => navigate('/home/torneos')}
            >
              Explorar Torneos
            </button>
          </div>
        </div>
        <div className="hero-decoration">
          <div className="decoration-circle circle-1"></div>
          <div className="decoration-circle circle-2"></div>
          <div className="decoration-circle circle-3"></div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="stats-section">
        <div className="stats-grid">
          <StatCard
          icon="🏆"
          value={stats.totalTorneos}
          title="Torneos Activos"
          />
          <StatCard
            icon="👥"
            value={stats.participantes}
            title="Equipos Registrados"
          />
          <StatCard
            icon="⚽"
            value={stats.deportes}
            title="Deportes"
          />
        </div>
        
      </section>

      {/* Por que elegir nuestra plataforma */}
      <section className="features-section">
        <h2 className="section-title pb-4">¿Por qué elegir nuestra plataforma?</h2>
        <div className="features-grid">
          {features.map((feature, index) => (
            <div key={index} className="feature-card">
              <div className="feature-icon">{feature.icon}</div>
              <h3 className="feature-title">{feature.title}</h3>
              <p className="feature-description">{feature.description}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Eventos Destacados */}
      {featuredTorneos.length > 0 && (
        <section className="featured-section">
          <div className="section-header">
            <h2 className="section-title">Torneos Destacados</h2>
            <button 
              className="btn-view-all"
              onClick={() => navigate('/home/torneos')}
            >
              Ver todos →
            </button>
          </div>
          <div className="featured-grid">
            {featuredTorneos.map((torneo) => (
              <CardTorneos
                key={torneo.id}
                torneo={torneo}
                handleClick={() => navigate(`/home/torneos/${torneo.id}`)}
                isMember={false}
                onEnroll={() => navigate(`/home/torneos/${torneo.id}`)}
              />
            ))}
          </div>
        </section>
      )}

      {/* CTA Section */}
      <section className="cta-section">
        <div className="cta-content">
          <h2 className="cta-title">¿Listo para competir?</h2>
          <p className="cta-description">
            Crea tu primer torneo en minutos o únete a una competición existente. 
            La gloria te espera.
          </p>
          <button 
            className="btn-cta"
            onClick={() => navigate('/home/torneos')}
          >
            Comenzar Ahora
          </button>
        </div>
      </section>
    </div>
  );
}