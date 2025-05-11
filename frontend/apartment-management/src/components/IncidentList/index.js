import React from 'react';
import './IncidentList.css';

const IncidentList = ({ incidents, onIncidentClick }) => {
  if (!incidents.length) return <p>Không có sự cố nào.</p>;

  return (
    <div className="incident-list-wrapper">
      <ul className="incident-list">
        {incidents.map(incident => (
          <li key={incident.incident_id} onClick={() => onIncidentClick(incident.incident_id)}>
            <h4>{incident.incident_name}</h4>
            <p><strong>Thời gian:</strong> {new Date(incident.report_time).toLocaleString()}</p>
            <p><strong>Trạng thái:</strong> {incident.status}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default IncidentList;
