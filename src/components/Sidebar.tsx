import React from 'react';

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <nav className="sidebar-nav">
        <a href="#" className="nav-item">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path d="M10.707 2.293a1 1 0 00-1.414 0l-7 7a1 1 0 001.414 1.414L4 10.414V17a1 1 0 001 1h2a1 1 0 001-1v-2a1 1 0 011-1h2a1 1 0 011 1v2a1 1 0 001 1h2a1 1 0 001-1v-6.586l.293.293a1 1 0 001.414-1.414l-7-7z" />
          </svg>
          <span>Home</span>
        </a>
        <a href="#" className="nav-item active">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
              clipRule="evenodd"
            />
          </svg>
          <span>Search</span>
        </a>
        <a href="#" className="nav-item">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
              clipRule="evenodd"
            />
          </svg>
          <span>Recent Searches</span>
        </a>
        <a href="#" className="nav-item">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z"
              clipRule="evenodd"
            />
          </svg>
          <span>Settings</span>
        </a>
        <a href="#" className="nav-item">
          <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
            <path
              fillRule="evenodd"
              d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
              clipRule="evenodd"
            />
          </svg>
          <span>Help</span>
        </a>
      </nav>
      <div className="sidebar-footer">
        <div className="red-hat-logo">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#EE0000">
            <path d="M20.3 7.8c-.2-.4-.5-.7-.9-.9-.4-.2-.9-.3-1.3-.3h-1.4c-.5 0-.9-.1-1.3-.3-.4-.2-.7-.5-.9-.9l-.6-1.2c-.2-.4-.5-.7-.9-.9-.4-.2-.9-.3-1.3-.3h-1.4c-.5 0-.9.1-1.3.3-.4.2-.7.5-.9.9l-.6 1.2c-.2.4-.5.7-.9.9-.4.2-.9.3-1.3.3H4.9c-.5 0-.9.1-1.3.3-.4.2-.7.5-.9.9L2.1 9c-.2.4-.3.9-.3 1.3v7.8c0 .5.1.9.3 1.3.2.4.5.7.9.9.4.2.9.3 1.3.3h13.4c.5 0 .9-.1 1.3-.3.4-.2.7-.5.9-.9.2-.4.3-.9.3-1.3v-7.8c0-.5-.1-.9-.3-1.3l-.6-1.2z" />
          </svg>
          <span className="company-name">Red Hat</span>
        </div>
        <div className="copyright">
          © 2026 Red Hat, Inc.
          <br />
          All rights reserved.
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
