import React from 'react';

interface SearchResult {
  id: string;
  type: 'salesforce' | 'ohss' | 'slack' | 'kcs' | 'documentation' | 'github';
  title: string;
  ticketNumber?: string;
  description: string;
  product: string;
  severity?: string;
  status?: string;
  updated: string;
}

interface SearchResultsProps {
  results: SearchResult[];
  query: string;
  onResultClick: (result: SearchResult) => void;
  selectedId?: string;
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, query, onResultClick, selectedId }) => {
  const getProductBadgeClass = (product: string) => {
    return `product-badge product-${product.toLowerCase().replace(' ', '-')}`;
  };

  const getSeverityBadgeClass = (severity?: string) => {
    if (!severity) return '';
    return `severity-badge severity-${severity.toLowerCase()}`;
  };

  const getStatusBadgeClass = (status?: string) => {
    if (!status) return '';
    return `status-badge status-${status.toLowerCase()}`;
  };

  const getSourceIcon = (type: string) => {
    switch (type) {
      case 'salesforce':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#00A1E0">
            <path d="M10.006 5.415a4.795 4.795 0 013.694-1.736c1.666 0 3.129.85 3.982 2.139a5.946 5.946 0 011.595-.217 5.96 5.96 0 015.96 5.96 5.96 5.96 0 01-5.96 5.96h-1.095a3.73 3.73 0 01-.308 1.486H19.277a7.446 7.446 0 100-14.892c-.877 0-1.717.151-2.498.43a6.28 6.28 0 00-11.83 2.85 5.213 5.213 0 00-2.695-.755A5.254 5.254 0 000 12.005a5.254 5.254 0 005.254 5.254h4.578a3.73 3.73 0 01.308-1.486H5.254a3.768 3.768 0 110-7.536c.45 0 .877.08 1.273.224a6.254 6.254 0 013.479-2.046z" />
          </svg>
        );
      case 'slack':
        return (
          <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
            <path
              fill="#E01E5A"
              d="M5.042 15.165a2.528 2.528 0 01-2.52 2.523A2.528 2.528 0 010 15.165a2.527 2.527 0 012.522-2.52h2.52v2.52z"
            />
            <path
              fill="#36C5F0"
              d="M6.313 15.165a2.527 2.527 0 012.521-2.52 2.527 2.527 0 012.521 2.52v6.313A2.528 2.528 0 018.834 24a2.528 2.528 0 01-2.521-2.522v-6.313z"
            />
          </svg>
        );
      default:
        return null;
    }
  };

  return (
    <div className="search-results">
      <div className="results-header">
        <h2>
          245 results for "{query}"
        </h2>
        <div className="results-controls">
          <label htmlFor="sort">Sort by:</label>
          <select id="sort" className="sort-dropdown">
            <option value="relevance">Relevance</option>
            <option value="date">Date</option>
            <option value="severity">Severity</option>
          </select>
          <button className="view-toggle" aria-label="Toggle view">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <rect x="1" y="1" width="6" height="6" />
              <rect x="9" y="1" width="6" height="6" />
              <rect x="1" y="9" width="6" height="6" />
              <rect x="9" y="9" width="6" height="6" />
            </svg>
          </button>
        </div>
      </div>

      <div className="results-section">
        <div className="section-header">
          <div className="source-icon">{getSourceIcon('salesforce')}</div>
          <h3>Salesforce Tickets (45)</h3>
          <button className="expand-button">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M6 8L2 4h8L6 8z" />
            </svg>
          </button>
        </div>

        {results.map((result) => (
          <div
            key={result.id}
            className={`result-card ${selectedId === result.id ? 'selected' : ''}`}
            onClick={() => onResultClick(result)}
          >
            <div className="result-content">
              <div className="result-header">
                <div className="source-icon-small">{getSourceIcon(result.type)}</div>
                <div className="result-title-section">
                  <h4 className="result-title">{result.title}</h4>
                  {result.ticketNumber && <span className="ticket-number">{result.ticketNumber}</span>}
                </div>
                <div className="result-actions">
                  <button className="bookmark-button" aria-label="Bookmark">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
                      <path d="M3 2h10v12l-5-3-5 3V2z" strokeWidth="1.5" />
                    </svg>
                  </button>
                  <button className="more-button" aria-label="More options">
                    <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                      <circle cx="8" cy="3" r="1.5" />
                      <circle cx="8" cy="8" r="1.5" />
                      <circle cx="8" cy="13" r="1.5" />
                    </svg>
                  </button>
                </div>
              </div>
              <p className="result-description">{result.description}</p>
              <div className="result-meta">
                <span className={getProductBadgeClass(result.product)}>{result.product}</span>
                {result.severity && <span className={getSeverityBadgeClass(result.severity)}>{result.severity}</span>}
                {result.status && <span className={getStatusBadgeClass(result.status)}>{result.status}</span>}
                <span className="updated-time">Updated {result.updated}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="results-section collapsed">
        <div className="section-header">
          <div className="source-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="#A855F7">
              <circle cx="12" cy="12" r="10" />
            </svg>
          </div>
          <h3>OHSS Tickets (31)</h3>
          <button className="expand-button">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M6 4L10 8H2L6 4z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="pagination">
        <button className="page-button" aria-label="Previous page">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M8 2L4 6l4 4" />
          </svg>
        </button>
        <button className="page-button active">1</button>
        <button className="page-button">2</button>
        <button className="page-button">3</button>
        <button className="page-button">4</button>
        <button className="page-button">5</button>
        <span>...</span>
        <button className="page-button">25</button>
        <button className="page-button" aria-label="Next page">
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M4 2l4 4-4 4" />
          </svg>
        </button>
      </div>
    </div>
  );
};

export default SearchResults;
