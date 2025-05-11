import React, { useState } from 'react';
import './HouseholdList.css';
import SearchBar from '../../SearchBar/SearchBar';
import {FiUser} from 'react-icons/fi';
import {FiFilter} from 'react-icons/fi';

const HouseholdList = ({ title, households, onRowClick }) => {
  const [filteredHouseholds, setFilteredHouseholds] = useState(households);
  const [showFloorFilter, setShowFloorFilter] = useState(false);
  const [activeFloor, setActiveFloor] = useState(null);

  const handleSearch = (term) => {
    if (!term) {
      setFilteredHouseholds(filterByFloor(households, activeFloor));
      return;
    }
    
    const filtered = households.filter(household => 
      household.name.toLowerCase().includes(term.toLowerCase()) || 
      household.room_number.toString().includes(term)
    );
    setFilteredHouseholds(filterByFloor(filtered, activeFloor));
  };

  const filterByFloor = (householdList, floor) => {
    if (!floor) return householdList;
    
    return householdList.filter(household => {
      const roomNumber = household.room_number.toString();
      const floorNumber = roomNumber.length >= 2 ? parseInt(roomNumber[0]) : null;
      return floorNumber === floor;
    });
  };

  const handleFloorFilter = (floor) => {
    setActiveFloor(floor === activeFloor ? null : floor);
    setFilteredHouseholds(filterByFloor(households, floor === activeFloor ? null : floor));
    setShowFloorFilter(false);
  };

  // Get available floors from room numbers
  const getAvailableFloors = () => {
    const floors = new Set();
    households.forEach(household => {
      const roomNumber = household.room_number.toString();
      if (roomNumber.length >= 2) {
        floors.add(parseInt(roomNumber[0]));
      }
    });
    return Array.from(floors).sort();
  };

  return (
    <div className="household-list-container">
      <div className="household-search-container">
        <SearchBar 
          placeholder="Tìm kiếm theo số phòng..." 
          onSearch={handleSearch} 
        />
        <div className="floor-filter-container">
          <button 
            className="floor-filter-button"
            onClick={() => setShowFloorFilter(!showFloorFilter)}
          >
            <FiFilter className="filter-icon" />
            <span>Xem theo Tầng</span>
          </button>
          
          {showFloorFilter && (
            <div className="floor-dropdown">
              <div 
                className={`floor-option ${activeFloor === null ? 'active' : ''}`}
                onClick={() => handleFloorFilter(null)}
              >
                Tất cả các tầng
              </div>
              {getAvailableFloors().map(floor => (
                <div 
                  key={floor} 
                  className={`floor-option ${activeFloor === floor ? 'active' : ''}`}
                  onClick={() => handleFloorFilter(floor)}
                >
                  Tầng {floor}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
      
      <div className="household-section">
        <div className="section-header">
          <span className="dropdown-icon">▼</span>
          <h2 className="table-title">
            {title || (activeFloor ? `Tầng ${activeFloor}` : "Tất cả Hộ cư dân")}
          </h2>
        </div>
        
        <div className="household-items">
          {filteredHouseholds.map((item) => (
            <div 
              key={item.account_id} 
              className="household-item"
              onClick={() => onRowClick(item.account_id)}
            >
              <div className="avatar-circle">
                <FiUser className="avatar-icon" />
              </div>
              <div className="household-info">
                <h3 className="room-number">Phòng {item.room_number}</h3>
                <p className="resident-name">{item.name}</p>
              </div>
            </div>
          ))}
          
          {filteredHouseholds.length === 0 && (
            <div className="no-results">Không tìm thấy hộ cư dân phù hợp</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default HouseholdList;
