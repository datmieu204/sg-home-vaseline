import React from 'react';
import './FilterBar.css';

const FilterBar = ({ options, onFilter }) => {
  return (
    <div className="filter-options">
      {options.map((option, index) => (
        <button 
          key={index} 
          className="filter-button"
          onClick={() => onFilter(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;