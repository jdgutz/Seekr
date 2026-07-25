import React from 'react';

interface HeaderProps {
  searchQuery: string;
  onSearch: (query: string) => void;
}

const Header: React.FC<HeaderProps> = ({ searchQuery, onSearch }) => {
  return (
    <header className="app-header">
      <div className="header-left">
        <div className="logo">
          <svg width="40" height="40" viewBox="0 0 40 40" fill="none">
            <path
              d="M20 5C11.716 5 5 11.716 5 20c0 8.284 6.716 15 15 15 8.284 0 15-6.716 15-15 0-8.284-6.716-15-15-15z"
              fill="#EE0000"
            />
          </svg>
          <h1 className="app-title">
            <span className="brand-name">SeekrAI</span>
            <span className="subtitle">Search tool</span>
          </h1>
        </div>
      </div>
      <div className="search-container">
        <svg className="search-icon" width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
          <path
            fillRule="evenodd"
            d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
            clipRule="evenodd"
          />
        </svg>
        <input
          type="text"
          className="search-input"
          value={searchQuery}
          onChange={(e) => onSearch(e.target.value)}
          placeholder="Search..."
        />
        <button className="search-button">Search</button>
      </div>
      <div className="header-right">
        <button className="notification-button">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
          </svg>
          <span className="notification-badge">3</span>
        </button>
        <div className="user-menu">
          <span className="user-initial">J</span>
          <span className="user-name">Judith</span>
          <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
            <path d="M6 8L2 4h8L6 8z" />
          </svg>
        </div>
      </div>
    </header>
  );
};

export default Header;
