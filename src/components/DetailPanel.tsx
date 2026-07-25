import React, { useState } from 'react';

interface SearchResult {
  id: string;
  type: string;
  title: string;
  ticketNumber?: string;
  description: string;
  product: string;
  severity?: string;
  status?: string;
  updated: string;
  details?: {
    rootCause?: string;
    resolution?: string;
    relatedContent?: Array<{ type: string; title: string }>;
  };
}

interface DetailPanelProps {
  result: SearchResult;
}

const DetailPanel: React.FC<DetailPanelProps> = ({ result }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'details' | 'timeline' | 'attachments'>(
    'overview'
  );
  const [activeRelatedTab, setActiveRelatedTab] = useState<'kcs' | 'slack'>('kcs');

  const tabs = [
    { id: 'overview', label: 'Overview' },
    { id: 'details', label: 'Details' },
    { id: 'timeline', label: 'Timeline' },
    { id: 'attachments', label: 'Attachments (2)' },
  ] as const;

  const relatedKCS = result.details?.relatedContent?.filter((item) => item.type === 'kcs') || [];
  const relatedSlack = result.details?.relatedContent?.filter((item) => item.type === 'slack') || [];

  return (
    <div className="detail-panel">
      <div className="detail-header">
        <div className="detail-title-section">
          <svg width="24" height="24" viewBox="0 0 24 24" fill="#00A1E0">
            <path d="M10.006 5.415a4.795 4.795 0 013.694-1.736c1.666 0 3.129.85 3.982 2.139a5.946 5.946 0 011.595-.217 5.96 5.96 0 015.96 5.96 5.96 5.96 0 01-5.96 5.96h-1.095a3.73 3.73 0 01-.308 1.486H19.277a7.446 7.446 0 100-14.892c-.877 0-1.717.151-2.498.43a6.28 6.28 0 00-11.83 2.85 5.213 5.213 0 00-2.695-.755A5.254 5.254 0 000 12.005a5.254 5.254 0 005.254 5.254h4.578a3.73 3.73 0 01.308-1.486H5.254a3.768 3.768 0 110-7.536c.45 0 .877.08 1.273.224a6.254 6.254 0 013.479-2.046z" />
          </svg>
          <h2>Salesforce Ticket {result.ticketNumber}</h2>
        </div>
        <div className="detail-actions">
          <button className="action-button" aria-label="Bookmark">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor">
              <path d="M3 2h10v12l-5-3-5 3V2z" strokeWidth="1.5" />
            </svg>
          </button>
          <button className="action-button" aria-label="Copy link">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M8.5 3.5L11 6M5 9l2.5 2.5M3.5 11.5a2.121 2.121 0 010-3l1-1a2.121 2.121 0 013 0M12.5 4.5a2.121 2.121 0 010 3l-1 1a2.121 2.121 0 01-3 0" />
            </svg>
          </button>
          <button className="action-button" aria-label="More options">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <circle cx="8" cy="3" r="1.5" />
              <circle cx="8" cy="8" r="1.5" />
              <circle cx="8" cy="13" r="1.5" />
            </svg>
          </button>
          <button className="collapse-button" aria-label="Collapse panel">
            <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
              <path d="M6 4L10 8H2L6 4z" />
            </svg>
          </button>
        </div>
      </div>

      <div className="detail-summary">
        <h3>{result.title}</h3>
        <div className="summary-meta">
          <span className="product-badge">Product: {result.product}</span>
          {result.severity && <span className={`severity-badge severity-${result.severity.toLowerCase()}`}>
            Severity: {result.severity}
          </span>}
          {result.status && <span className={`status-badge status-${result.status.toLowerCase()}`}>
            Status: {result.status}
          </span>}
          <span className="updated-time">Updated: {result.updated}</span>
        </div>
      </div>

      <div className="detail-tabs">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            className={`tab-button ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="detail-content">
        {activeTab === 'overview' && (
          <>
            <section className="content-section">
              <h4>Issue Description</h4>
              <p>
                Customer is experiencing ingress timeout when accessing applications after performing
                a cluster upgrade on ROSA.
              </p>
            </section>

            <section className="content-section">
              <h4>Root Cause</h4>
              <p>{result.details?.rootCause}</p>
            </section>

            <section className="content-section">
              <h4>Resolution</h4>
              <p>{result.details?.resolution}</p>
              <a href="#" className="resolution-link">
                View Resolution Steps →
              </a>
            </section>

            <section className="content-section related-content">
              <div className="related-header">
                <h4>Related Content</h4>
                <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
                  <path
                    fillRule="evenodd"
                    d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="related-tabs">
                <button
                  className={`related-tab ${activeRelatedTab === 'kcs' ? 'active' : ''}`}
                  onClick={() => setActiveRelatedTab('kcs')}
                >
                  KCS Articles ({relatedKCS.length})
                </button>
                <button
                  className={`related-tab ${activeRelatedTab === 'slack' ? 'active' : ''}`}
                  onClick={() => setActiveRelatedTab('slack')}
                >
                  Slack Threads ({relatedSlack.length})
                </button>
              </div>
              <div className="related-items">
                {activeRelatedTab === 'kcs' &&
                  relatedKCS.map((item, index) => (
                    <a key={index} href="#" className="related-item">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="#EE0000">
                        <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zm-2 4a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
                      </svg>
                      <div className="related-item-content">
                        <span className="related-item-title">{item.title}</span>
                        <span className="related-item-subtitle">
                          This article covers timeout configurations and best practices.
                        </span>
                      </div>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                        <path d="M4 2l4 4-4 4" />
                      </svg>
                    </a>
                  ))}
                {activeRelatedTab === 'slack' &&
                  relatedSlack.map((item, index) => (
                    <a key={index} href="#" className="related-item">
                      <svg width="20" height="20" viewBox="0 0 20 20" fill="currentColor">
                        <path
                          fill="#E01E5A"
                          d="M4.202 12.637a2.106 2.106 0 01-2.1 2.103 2.106 2.106 0 01-2.102-2.103c0-1.16.942-2.102 2.102-2.102h2.1v2.102z"
                        />
                      </svg>
                      <div className="related-item-content">
                        <span className="related-item-title">{item.title}</span>
                        <span className="related-item-subtitle">
                          Discussed by @jane.doe • {index === 0 ? '2 hours ago' : '1 day ago'}
                        </span>
                      </div>
                      <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                        <path d="M4 2l4 4-4 4" />
                      </svg>
                    </a>
                  ))}
              </div>
            </section>
          </>
        )}
      </div>

      <div className="detail-footer">
        <span className="footer-label">Was this helpful?</span>
        <div className="feedback-buttons">
          <button className="feedback-button" aria-label="Helpful">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M2 10.5a1.5 1.5 0 113 0v3a1.5 1.5 0 01-3 0v-3zM6 10.333v5.43a2 2 0 001.106 1.79l.05.025A4 4 0 008.943 18h5.416a2 2 0 001.962-1.608l1.2-6A2 2 0 0015.56 8H12V4a2 2 0 00-2-2 1 1 0 00-1 1v.667a4 4 0 01-.8 2.4L6.8 7.933a4 4 0 00-.8 2.4z" />
            </svg>
          </button>
          <button className="feedback-button" aria-label="Not helpful">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="currentColor">
              <path d="M14 5.5a1.5 1.5 0 11-3 0v-3a1.5 1.5 0 013 0v3zM10 5.667V.237a2 2 0 00-1.106-1.79l-.05-.025A4 4 0 007.057-2H1.641A2 2 0 00-.321-.392l-1.2 6A2 2 0 00.44 8H4v4a2 2 0 002 2 1 1 0 001-1v-.667a4 4 0 01.8-2.4l1.4-1.866a4 4 0 00.8-2.4z" />
            </svg>
          </button>
        </div>
      </div>
    </div>
  );
};

export default DetailPanel;
