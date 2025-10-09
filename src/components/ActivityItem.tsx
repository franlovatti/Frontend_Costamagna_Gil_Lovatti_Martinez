import React from "react";
import "./cssComponentes/ActivityItem.css";

interface ActivityItemProps {
  icon: React.ReactNode;
  text: string;
  time: string;
}

const ActivityItem = ({ icon, text, time }: ActivityItemProps) => {
  return (
    <div className="activity-item">
      <span className="activity-icon">{icon}</span>
      <div className="flex-grow-1">
        <p className="activity-text mb-1">{text}</p>
        <span className="activity-time">{time}</span>
      </div>
    </div>
  );
};

export default ActivityItem;

