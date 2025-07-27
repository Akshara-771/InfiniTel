import React from "react";
import "../FilterControls/FilterControls.css";

const FilterControls = ({
  areas,
  selectedArea,
  onAreaChange,
  searchTerm,
  onSearchChange,
}) => {
  return (
    <div className="filter-controls-container">
      <select
        value={selectedArea}
        onChange={(e) => onAreaChange(e.target.value)}
        className="area-filter"
      >
        <option value="">All Areas</option>
        {areas.map((area) => (
          <option key={area._id} value={area.district}>
            {area.district}
          </option>
        ))}
      </select>

      <div className="search-container">
        <input
          type="text"
          value={searchTerm}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search customers..."
          className="search-input"
        />
        <i className="fas fa-search search-icon"></i>
      </div>
    </div>
  );
};

export default FilterControls;
