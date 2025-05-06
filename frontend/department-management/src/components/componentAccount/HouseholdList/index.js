import React from 'react';
import './HouseholdList.css';

const HouseholdList = ({ title, households, onRowClick }) => {
  return (
    <div className="household-list-container">
      <h2 className="household-list-title">{title}</h2>
      <table className="household-table">
        <thead>
          <tr>
            <th>STT</th>
            <th>Tên hộ cư dân</th>
            <th>Số phòng</th>
          </tr>
        </thead>
        <tbody>
          {households.map((item, index) => (
            <tr key={item.account_id} onClick={() => onRowClick(item.account_id)}>
              <td>{index + 1}</td>
              <td>{item.name}</td>
              <td>{item.room_number}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default HouseholdList;
