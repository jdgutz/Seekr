/**
 * Recent Searches Page JavaScript
 * Displays user's search history from last 30 days, grouped by date with pagination
 */

let recentSearchHistory = [];
let recentCurrentPage = 1;
const recentItemsPerPage = 1; // Show 1 day per page

// Initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    await loadSearchHistory();
});

/**
 * Load search history from backend
 */
async function loadSearchHistory() {
    const loadingState = document.getElementById('loadingState');
    const searchHistoryContainer = document.getElementById('searchHistory');
    const emptyState = document.getElementById('emptyState');

    try {
        loadingState.style.display = 'flex';
        searchHistoryContainer.style.display = 'none';
        emptyState.style.display = 'none';

        console.log('🔄 Fetching search history from /api/search/history...');
        const response = await fetch('/api/search/history');
        console.log('📡 Response status:', response.status);

        if (!response.ok) {
            throw new Error('Failed to load search history');
        }

        const data = await response.json();
        console.log('📦 Data received:', data);
        recentSearchHistory = data.history || [];
        console.log('✅ Search history loaded:', recentSearchHistory.length, 'searches');

        loadingState.style.display = 'none';

        if (recentSearchHistory.length === 0) {
            console.log('⚠️ No search history found, showing empty state');
            emptyState.style.display = 'flex';
        } else {
            console.log('✅ Rendering search history');
            searchHistoryContainer.style.display = 'block';
            renderSearchHistory();
        }
    } catch (error) {
        console.error('❌ Error loading search history:', error);
        loadingState.style.display = 'none';
        emptyState.style.display = 'flex';
    }
}

/**
 * Group search history by date
 */
function groupByDate(history) {
    const grouped = {};

    history.forEach(item => {
        const date = new Date(item.timestamp);
        const dateKey = date.toISOString().split('T')[0]; // YYYY-MM-DD

        if (!grouped[dateKey]) {
            grouped[dateKey] = [];
        }
        grouped[dateKey].push(item);
    });

    // Sort dates descending (newest first)
    const sortedDates = Object.keys(grouped).sort((a, b) => new Date(b) - new Date(a));

    return sortedDates.map(date => ({
        date: date,
        searches: grouped[date]
    }));
}

/**
 * Format date for display
 */
function formatDateHeader(dateStr) {
    const date = new Date(dateStr);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    // Check if today
    if (date.toDateString() === today.toDateString()) {
        return 'Today';
    }

    // Check if yesterday
    if (date.toDateString() === yesterday.toDateString()) {
        return 'Yesterday';
    }

    // Format as "Monday, July 21, 2026"
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString('en-US', options);
}

/**
 * Format time for display
 */
function formatTime(timestamp) {
    const date = new Date(timestamp);
    const hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'PM' : 'AM';
    const displayHours = hours % 12 || 12;

    return `${displayHours}:${minutes} ${ampm}`;
}

/**
 * Get relative time (e.g., "2 hours ago")
 */
function getRelativeTime(timestamp) {
    const now = new Date();
    const then = new Date(timestamp);
    const diffMs = now - then;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins === 1) return '1 minute ago';
    if (diffMins < 60) return `${diffMins} minutes ago`;
    if (diffHours === 1) return '1 hour ago';
    if (diffHours < 24) return `${diffHours} hours ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 30) return `${diffDays} days ago`;

    return formatTime(timestamp);
}

/**
 * Render search history with pagination
 */
function renderSearchHistory() {
    const container = document.getElementById('searchHistory');

    // Group by date
    const groupedHistory = groupByDate(recentSearchHistory);

    console.log('📊 Recent Searches Stats:', {
        totalSearches: recentSearchHistory.length,
        groupedDays: groupedHistory.length,
        currentPage: recentCurrentPage,
        itemsPerPage: recentItemsPerPage
    });

    // Calculate pagination
    const totalPages = Math.ceil(groupedHistory.length / recentItemsPerPage);
    const startIndex = (recentCurrentPage - 1) * recentItemsPerPage;
    const endIndex = startIndex + recentItemsPerPage;
    const paginatedGroups = groupedHistory.slice(startIndex, endIndex);

    console.log('📄 Pagination:', {
        totalPages,
        startIndex,
        endIndex,
        paginatedGroups: paginatedGroups.length
    });

    // Build HTML
    let html = '<div class="search-history-list">';

    paginatedGroups.forEach(group => {
        html += `
            <div class="history-date-group">
                <h2 class="date-header">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                        <line x1="16" y1="2" x2="16" y2="6"/>
                        <line x1="8" y1="2" x2="8" y2="6"/>
                        <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    ${formatDateHeader(group.date)}
                </h2>
                <div class="history-items">
        `;

        // Sort searches within the day by time (newest first)
        const sortedSearches = group.searches.sort((a, b) =>
            new Date(b.timestamp) - new Date(a.timestamp)
        );

        sortedSearches.forEach(item => {
            let sources = item.sources || [];

            // If sources array is empty, infer from keywords
            if (sources.length === 0) {
                const queryLower = item.query.toLowerCase();
                const inferredSources = [];

                // GitHub
                if (queryLower.includes('repo') || queryLower.includes('github')) {
                    inferredSources.push('github');
                }

                // GitLab
                if (queryLower.includes('repo') || queryLower.includes('gitlab')) {
                    inferredSources.push('gitlab');
                }

                // Jira/OHSS
                if (queryLower.includes('jira') || queryLower.includes('ohss')) {
                    inferredSources.push('jira');
                }

                // SFDC
                if (queryLower.includes('sfdc') || queryLower.includes('salesforce') || queryLower.includes('case')) {
                    inferredSources.push('sfdc');
                }

                // Slack
                if (queryLower.includes('slack')) {
                    inferredSources.push('slack');
                }

                // KCS
                if (queryLower.includes('kcs')) {
                    inferredSources.push('kcs');
                }

                // If no keywords matched, show all sources
                if (inferredSources.length === 0) {
                    sources = ['jira', 'sfdc', 'slack', 'kcs', 'sop', 'docs', 'github', 'gitlab'];
                } else {
                    sources = inferredSources;
                }
            }

            const sourceBadges = sources.length > 0 ? sources.map(source => {
                const sourceInfo = getSourceInfo(source);
                return `<span class="source-badge ${sourceInfo.class}">${sourceInfo.label}</span>`;
            }).join('') : '';

            html += `
                <div class="history-item" onclick="rerunSearch('${escapeHtml(item.query)}')">
                    <div class="history-item-wrapper">
                        <div class="history-item-left">
                            <div class="history-query">
                                <svg class="query-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                    <circle cx="11" cy="11" r="8"/>
                                    <path d="m21 21-4.35-4.35"/>
                                </svg>
                                <span class="query-text">${escapeHtml(item.query)}</span>
                            </div>
                            <div class="history-item-footer">
                                <div class="history-time">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <circle cx="12" cy="12" r="10"/>
                                        <polyline points="12 6 12 12 16 14"/>
                                    </svg>
                                    ${formatTime(item.timestamp)}
                                </div>
                                <div class="history-results">
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                                        <rect x="3" y="3" width="18" height="18" rx="2" ry="2"/>
                                        <polyline points="9 12 11 14 15 10"/>
                                    </svg>
                                    ${item.results_count || 0} result${item.results_count === 1 ? '' : 's'}
                                </div>
                            </div>
                        </div>
                        <div class="history-item-right">
                            ${sourceBadges ? `<div class="history-sources">${sourceBadges}</div>` : ''}
                        </div>
                    </div>
                </div>
            `;
        });

        html += `
                </div>
            </div>
        `;
    });

    html += '</div>';

    // Add pagination
    if (totalPages > 1) {
        html += renderPagination(totalPages, groupedHistory);
    }

    container.innerHTML = html;
}

/**
 * Render pagination controls
 */
function renderPagination(totalPages, groupedHistory) {
    let html = '<div class="pagination">';

    // Previous button
    html += `
        <button class="pagination-btn ${recentCurrentPage === 1 ? 'disabled' : ''}"
                onclick="goToPage(${recentCurrentPage - 1})"
                ${recentCurrentPage === 1 ? 'disabled' : ''}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="15 18 9 12 15 6"/>
            </svg>
            Previous
        </button>
    `;

    // Page numbers
    html += '<div class="pagination-pages">';

    // Always show first page
    if (recentCurrentPage > 3) {
        html += `<button class="pagination-page" onclick="goToPage(1)">1</button>`;
        if (recentCurrentPage > 4) {
            html += '<span class="pagination-ellipsis">...</span>';
        }
    }

    // Show pages around current page
    for (let i = Math.max(1, recentCurrentPage - 2); i <= Math.min(totalPages, recentCurrentPage + 2); i++) {
        html += `
            <button class="pagination-page ${i === recentCurrentPage ? 'active' : ''}"
                    onclick="goToPage(${i})">
                ${i}
            </button>
        `;
    }

    // Always show last page
    if (recentCurrentPage < totalPages - 2) {
        if (recentCurrentPage < totalPages - 3) {
            html += '<span class="pagination-ellipsis">...</span>';
        }
        html += `<button class="pagination-page" onclick="goToPage(${totalPages})">${totalPages}</button>`;
    }

    html += '</div>';

    // Next button
    html += `
        <button class="pagination-btn ${recentCurrentPage === totalPages ? 'disabled' : ''}"
                onclick="goToPage(${recentCurrentPage + 1})"
                ${recentCurrentPage === totalPages ? 'disabled' : ''}>
            Next
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="9 18 15 12 9 6"/>
            </svg>
        </button>
    `;

    html += '</div>';

    // Add page info
    const currentDateGroup = groupedHistory[recentCurrentPage - 1];
    const dateLabel = currentDateGroup ? formatDateHeader(currentDateGroup.date) : '';

    html += `
        <div class="pagination-info">
            Page ${recentCurrentPage} of ${totalPages} ${dateLabel ? `• ${dateLabel}` : ''}
        </div>
    `;

    return html;
}

/**
 * Navigate to a specific page
 */
function goToPage(page) {
    const groupedHistory = groupByDate(recentSearchHistory);
    const totalPages = Math.ceil(groupedHistory.length / recentItemsPerPage);

    if (page < 1 || page > totalPages) return;

    recentCurrentPage = page;
    renderSearchHistory();

    // Scroll to top
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

/**
 * Get source information for badge display
 */
function getSourceInfo(source) {
    const sourceMap = {
        'jira': { label: 'Jira', class: 'jira' },
        'sfdc': { label: 'SFDC', class: 'sfdc' },
        'slack': { label: 'Slack', class: 'slack' },
        'kcs': { label: 'KCS', class: 'kcs' },
        'sop': { label: 'SOP', class: 'sop' },
        'docs': { label: 'Docs', class: 'docs' },
        'github': { label: 'GitHub', class: 'github' },
        'gitlab': { label: 'GitLab', class: 'gitlab' }
    };

    return sourceMap[source.toLowerCase()] || { label: source, class: 'default' };
}

/**
 * Escape HTML to prevent XSS
 */
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

/**
 * Rerun a search from history
 */
function rerunSearch(query) {
    // Redirect to main search page with the query
    window.location.href = `/seekr/main?q=${encodeURIComponent(query)}`;
}

/**
 * Handle header search
 */
document.getElementById('headerSearchBtn')?.addEventListener('click', () => {
    const query = document.getElementById('headerSearchInput')?.value.trim();
    if (query) {
        window.location.href = `/seekr/main?q=${encodeURIComponent(query)}`;
    }
});

document.getElementById('headerSearchInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        const query = e.target.value.trim();
        if (query) {
            window.location.href = `/seekr/main?q=${encodeURIComponent(query)}`;
        }
    }
});
