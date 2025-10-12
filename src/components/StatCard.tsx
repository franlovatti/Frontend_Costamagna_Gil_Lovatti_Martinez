import React from "react";
import "./cssComponentes/StatCard.css";

interface StatCardProps {
  icon: React.ReactNode;
  title: string;
  subtitle?: string;
  value: string | number;
  value2?: string | number;
}

const StatCard: React.FC<StatCardProps> = ({ icon, title, value, subtitle, value2 }) => (
  // <div className="stat-card">
  //   <div className="stat-header">
  //     <span className="stat-icon">{icon}</span>
  //     <h3 className="stat-title">{title}</h3>
  //   </div>
  //   <p className="stat-number">{value}</p>
  //   {subtitle && value2 !== undefined && (
  //     <p className="stat-subtext">{subtitle}: {value2}</p>
  //   )}
  // </div>
  <div className="stat-card-large">
    <div className="stat-icon-large">{icon}</div>
    <div>
      <p className="stat-label">{title}</p>
      <h3 className="stat-value">{value}</h3>
      <p className="stat-subtext">{subtitle}: {value2}</p>
    </div>
  </div>
);

export default StatCard;