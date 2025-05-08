import React from 'react';
import './ListItem.css';

const ListItem = ({ title, statusText, statusType, deadline, deadlineLabel }) => {
  return (
    <div className="list-item">
      <div className="item-title">{title}</div>
      <div className="item-details">
        <span className={`status-badge ${statusType}`}>{statusText}</span>
        <span className="separator">|</span>
        <span className="deadline-label">{deadlineLabel}</span>
        <span className="deadline-value">{deadline}</span>
      </div>
    </div>
  );
};

export default ListItem;