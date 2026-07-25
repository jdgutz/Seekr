import React, { useState } from 'react';
import './SearchInterface.css';
import Header from './Header';
import Sidebar from './Sidebar';
import SearchResults from './SearchResults';
import DetailPanel from './DetailPanel';
import FilterPanel from './FilterPanel';

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
  details?: any;
}

const SearchInterface: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('networking ingress timeout');
  const [selectedResult, setSelectedResult] = useState<SearchResult | null>(null);
  const [activeFilters, setActiveFilters] = useState({
    sources: ['salesforce', 'ohss', 'slack', 'kcs', 'documentation', 'github'],
    products: ['aro', 'aro-hcp', 'osd', 'rosa', 'rosa-hcp'],
  });

  const mockResults: SearchResult[] = [
    {
      id: '1',
      type: 'salesforce',
      title: 'Ingress timeout issue during upgrade on ROSA',
      ticketNumber: '#0256789',
      description: 'Customer experiencing timeout when accessing application after ingress upgrade.',
      product: 'ROSA',
      severity: 'High',
      status: 'Open',
      updated: '2 hours ago',
      details: {
        rootCause: 'The issue occurs due to misconfigured timeout values in the ingress controller configuration.',
        resolution: 'Update the ingress controller timeout values and restart the router pods.',
        relatedContent: [
          { type: 'kcs', title: 'KCS-123456: ARO Ingress Controller Timeouts' },
          { type: 'kcs', title: 'KCS-987654: Troubleshooting Ingress Issues in ROSA' },
          { type: 'slack', title: '#rosa-ingress-timeout' },
          { type: 'slack', title: '#networking-help' },
        ],
      },
    },
    {
      id: '2',
      type: 'salesforce',
      title: 'Intermittent connection timeout - ARO cluster',
      ticketNumber: '#0249987',
      description: 'Ingress connection dropping intermittently on ARO cluster with high latency.',
      product: 'ARO',
      severity: 'Medium',
      status: 'Open',
      updated: '1 day ago',
    },
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleResultClick = (result: SearchResult) => {
    setSelectedResult(result);
  };

  return (
    <div className="search-interface">
      <Header searchQuery={searchQuery} onSearch={handleSearch} />
      <div className="main-container">
        <Sidebar />
        <div className="content-area">
          <div className="quick-filters">
            <span className="filter-label">Quick Filters:</span>
            {['ARO', 'ARO HCP', 'OSD', 'ROSA', 'ROSA HCP', 'KCS', 'Salesforce', 'Documentation'].map(
              (filter) => (
                <button key={filter} className="filter-chip">
                  {filter}
                </button>
              )
            )}
          </div>
          <div className="search-content">
            <FilterPanel activeFilters={activeFilters} setActiveFilters={setActiveFilters} />
            <SearchResults
              results={mockResults}
              query={searchQuery}
              onResultClick={handleResultClick}
              selectedId={selectedResult?.id}
            />
            {selectedResult && <DetailPanel result={selectedResult} />}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SearchInterface;
