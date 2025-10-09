import React from "react";
import "./cssComponentes/StatCard.css";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  value: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value }) => (
  <div className="stat-card">
    <div className="stat-header">
      <span className="stat-icon">{icon}</span>
      <h3 className="stat-title">{title}</h3>
    </div>
    <p className="stat-number">{value}</p>
  </div>
);

export default StatCard;