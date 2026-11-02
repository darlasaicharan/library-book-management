import React from 'react';
import { BookOpen, CheckCircle, BookMinus, Layers } from 'lucide-react';

const DashboardCards = ({ stats, loading }) => {
  const cards = [
    {
      label: 'Total Books',
      value: stats?.totalBooks ?? 0,
      icon: BookOpen,
      iconClass: 'stat-icon-total',
    },
    {
      label: 'Available Books',
      value: stats?.availableBooks ?? 0,
      icon: CheckCircle,
      iconClass: 'stat-icon-available',
    },
    {
      label: 'Issued Books',
      value: stats?.issuedBooks ?? 0,
      icon: BookMinus,
      iconClass: 'stat-icon-issued',
    },
    {
      label: 'Total Categories',
      value: stats?.totalCategories ?? 0,
      icon: Layers,
      iconClass: 'stat-icon-categories',
    },
  ];

  return (
    <div className="stats-grid">
      {cards.map((card, index) => {
        const IconComponent = card.icon;
        return (
          <div className="stat-card" key={index}>
            <div className="stat-info">
              <span className="stat-label">{card.label}</span>
              <span className="stat-value">
                {loading ? '...' : card.value.toLocaleString()}
              </span>
            </div>
            <div className={`stat-icon-wrapper ${card.iconClass}`}>
              <IconComponent size={26} />
            </div>
          </div>
        );
      })}
    </div>
  );
};

export default DashboardCards;

