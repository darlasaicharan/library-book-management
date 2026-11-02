import React from 'react';

const StatusBadge = ({ status }) => {
  const isAvailable = status === 'AVAILABLE';
  const label = isAvailable ? 'Available' : 'Issued';

  return (
    <span className={`status-badge ${isAvailable ? 'status-available' : 'status-issued'}`}>
      <span className="status-badge-dot"></span>
      {label}
    </span>
  );
};

export default StatusBadge;

