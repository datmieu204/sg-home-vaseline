import React from 'react';
import './ListContainer.css';
import FilterBar from '../FilterBar/FilterBar';
import SearchBar from '../SearchBar/SearchBar';
import ListItem from '../ListItem/ListItem';

const ListContainer = ({ 
  title, 
  items,
  rawTasks = [],
  searchPlaceholder, 
  onSearch, 
  onFilter,
  onItemClick,
  filterConfig = {} // New prop for filter configuration
}) => {
  return (
    <div className="list-container">
      <div className="list-header">
        <SearchBar 
          placeholder={searchPlaceholder} 
          onSearch={onSearch} 
        />
       <FilterBar 
        tasks={rawTasks} 
        onFilter={onFilter}
        showStatusFilter={filterConfig.showStatusFilter !== false}
        showMonthFilter={filterConfig.showMonthFilter !== false}
        showYearFilter={filterConfig.showYearFilter !== false}
        initialFilters={filterConfig.initialFilters || {}}
      />
      </div>
      <div className="list-title">
        <span className="dropdown-icon">▼</span>
        <h2>{title}</h2>
      </div>
      
      <div className="list-items">
        {items.length > 0 ? (
          items.map((item, index) => (
            <div 
              key={item.id || index}
              onClick={() => onItemClick && onItemClick(item.id)} 
              className="list-item-wrapper"
            >
              <ListItem 
                title={item.title}
                statusText={item.statusText}
                statusType={item.statusType}
                deadline={item.deadline}
                deadlineLabel={item.deadlineLabel}
              />
            </div>
          ))
        ) : (
          <div className="empty-list">
            <p>Không có dữ liệu hiển thị</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default ListContainer;