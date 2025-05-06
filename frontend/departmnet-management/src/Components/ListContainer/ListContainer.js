import React from 'react';
import './ListContainer.css';
import FilterBar from '../FilterBar/FilterBar';
import SearchBar from '../SearchBar/SearchBar';
import ListItem from '../ListItem/ListItem';

const ListContainer = ({ 
  title, 
  items, 
  searchPlaceholder, 
  filterOptions, 
  onSearch, 
  onFilter 
}) => {
  return (
    <div className="list-container">
      <div className="list-header">
        <SearchBar 
          placeholder={searchPlaceholder} 
          onSearch={onSearch} 
        />
        <FilterBar options={filterOptions} onFilter={onFilter} />
      </div>
      
      <div className="list-title">
        <span className="dropdown-icon">▼</span>
        <h2>{title}</h2>
      </div>
      
      <div className="list-items">
        {items.length > 0 ? (
          items.map((item, index) => (
            <ListItem 
              key={index}
              title={item.title}
              statusText={item.statusText}
              statusType={item.statusType}
              deadline={item.deadline}
              deadlineLabel={item.deadlineLabel}
            />
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