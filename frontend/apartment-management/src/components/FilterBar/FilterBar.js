import React, { useState } from 'react';
import './FilterBar.css';

const FilterBar = ({ 
  onFilter, 
  tasks = [], 
  showStatusFilter = true,
  showMonthFilter = true,
  showYearFilter = true,
  initialFilters = {}
}) => {
  // Default filters state
  const [selectedValues, setSelectedValues] = useState(initialFilters);
  
  // Generate filter options based on tasks data
  const generateFilterOptions = () => {
    const filterOptions = [];
    
    // Status filter
    if (showStatusFilter) {
      filterOptions.push({
        label: 'Trạng thái',
        options: [
          { label: 'Tất cả', value: 'all' },
          { label: 'Hoàn thành', value: 'completed' },
          { label: 'Đang xử lý', value: 'in_progress' }
        ]
      });
    }
    
    // Month filter
    if (showMonthFilter) {
      filterOptions.push({
        label: 'Tháng',
        options: [
          { label: 'Tất cả tháng', value: '' },
          ...Array.from({ length: 12 }, (_, i) => ({ 
            label: `Tháng ${i + 1}`, 
            value: String(i + 1) 
          }))
        ]
      });
    }
    
    // Year filter
    if (showYearFilter && tasks.length > 0) {
      // Extract unique years from task deadlines
      const years = Array.from(
        new Set(tasks.map(t => 
          t.deadline ? new Date(t.deadline).getFullYear() : new Date().getFullYear()
        ))
      ).sort((a, b) => b - a); // Sort years in descending order
      
      filterOptions.push({
        label: 'Năm',
        options: [
          { label: 'Tất cả năm', value: '' },
          ...years.map(year => ({ 
            label: `Năm ${year}`, 
            value: String(year) 
          }))
        ]
      });
    }
    
    return filterOptions;
  };
  
  const handleDropdownChange = (e, filterType) => {
    const value = e.target.value;
    
    // Update selected values
    setSelectedValues(prev => ({
      ...prev,
      [filterType]: value
    }));
    
    // Call parent handler
    onFilter(filterType, value);
  };

  // Get dynamically generated filter options
  const filterOptions = generateFilterOptions();

  return (
    <div className="filter-bar">
      {filterOptions.map((filterGroup, groupIndex) => (
        <div key={groupIndex} className="filter-group">
          <label className="filter-group-label" htmlFor={`filter-${filterGroup.label}`}>
            {filterGroup.label}:
          </label>
          <select 
            id={`filter-${filterGroup.label}`}
            className="filter-dropdown"
            value={selectedValues[filterGroup.label] || ''}
            onChange={(e) => handleDropdownChange(e, filterGroup.label)}
          >
            {filterGroup.options.map((option, index) => (
              <option 
                key={index} 
                value={option.value}
              >
                {option.label}
              </option>
            ))}
          </select>
        </div>
      ))}
    </div>
  );
};

export default FilterBar;