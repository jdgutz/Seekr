import React, { useState } from 'react';

interface FilterPanelProps {
  activeFilters: {
    sources: string[];
    products: string[];
  };
  setActiveFilters: (filters: any) => void;
}

const FilterPanel: React.FC<FilterPanelProps> = ({ activeFilters, setActiveFilters }) => {
  const [showSources, setShowSources] = useState(true);
  const [showProducts, setShowProducts] = useState(true);
  const [filtersExpanded, setFiltersExpanded] = useState(true);

  const sources = [
    { id: 'salesforce', label: 'Salesforce Tickets', count: 45 },
    { id: 'ohss', label: 'OHSS Tickets', count: 31 },
    { id: 'slack', label: 'Slack Threads', count: 62 },
    { id: 'kcs', label: 'KCS Articles', count: 27 },
    { id: 'documentation', label: 'Red Hat Documentation', count: 56 },
    { id: 'github', label: 'GitHub Repository', count: 24 },
  ];

  const products = [
    { id: 'aro', label: 'ARO', count: 72 },
    { id: 'aro-hcp', label: 'ARO HCP', count: 28 },
    { id: 'osd', label: 'OSD', count: 19 },
    { id: 'rosa', label: 'ROSA', count: 84 },
    { id: 'rosa-hcp', label: 'ROSA HCP', count: 42 },
  ];

  return (
    <div className="filter-panel">
      <div className="filter-header">
        <h3>Filters</h3>
        <button
          className="expand-button"
          onClick={() => setFiltersExpanded(!filtersExpanded)}
          aria-label={filtersExpanded ? 'Collapse filters' : 'Expand filters'}
        >
          <svg
            width="12"
            height="12"
            viewBox="0 0 12 12"
            fill="currentColor"
            style={{ transform: filtersExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}
          >
            <path d="M6 8L2 4h8L6 8z" />
          </svg>
        </button>
      </div>

      {filtersExpanded && (
        <>
          <div className="filter-section">
            <div className="filter-section-header" onClick={() => setShowSources(!showSources)}>
              <h4>Sources</h4>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="currentColor"
                style={{ transform: showSources ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                <path d="M6 8L2 4h8L6 8z" />
              </svg>
            </div>
            {showSources && (
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="checkbox"
                    checked={activeFilters.sources.length === sources.length}
                    onChange={() => {}}
                  />
                  <span className="checkmark"></span>
                  <span className="filter-label">
                    Select All <span className="filter-count">(245)</span>
                  </span>
                </label>
                {sources.map((source) => (
                  <label key={source.id} className="filter-option">
                    <input
                      type="checkbox"
                      checked={activeFilters.sources.includes(source.id)}
                      onChange={() => {}}
                    />
                    <span className="checkmark"></span>
                    <span className="filter-label">
                      {source.label} <span className="filter-count">({source.count})</span>
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>

          <div className="filter-section">
            <div className="filter-section-header" onClick={() => setShowProducts(!showProducts)}>
              <h4>Products</h4>
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="currentColor"
                style={{ transform: showProducts ? 'rotate(180deg)' : 'rotate(0deg)' }}
              >
                <path d="M6 8L2 4h8L6 8z" />
              </svg>
            </div>
            {showProducts && (
              <div className="filter-options">
                <label className="filter-option">
                  <input
                    type="checkbox"
                    checked={activeFilters.products.length === products.length}
                    onChange={() => {}}
                  />
                  <span className="checkmark"></span>
                  <span className="filter-label">
                    Select All <span className="filter-count">(245)</span>
                  </span>
                </label>
                {products.map((product) => (
                  <label key={product.id} className="filter-option">
                    <input
                      type="checkbox"
                      checked={activeFilters.products.includes(product.id)}
                      onChange={() => {}}
                    />
                    <span className="checkmark"></span>
                    <span className="filter-label">
                      {product.label} <span className="filter-count">({product.count})</span>
                    </span>
                  </label>
                ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default FilterPanel;
