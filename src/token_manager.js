/**
 * Token Manager for Seekr
 * Handles API token retrieval, validation, and expiry checking
 * Used across the application for authenticated API calls
 */

class TokenManager {
    constructor() {
        this.tokens = {
            atlassian: null,
            redhat: null,
            slack: { xoxc: null, xoxd: null }
        };
        this.lastCheck = null;
        this.checkInterval = 5 * 60 * 1000; // 5 minutes
    }

    //Initialize token manager and load all tokens

    async initialize() {
        await this.loadAllTokens();
        return this;
    }

    //Load all tokens from backend
     
    async loadAllTokens() {
        try {
            const [atlassian, redhat, slack, github, gitlab] = await Promise.all([
                this.loadAtlassianToken(),
                this.loadRedHatToken(),
                this.loadSlackTokens(),
                this.loadGitHubToken(),
                this.loadGitLabToken()
            ]);

            this.lastCheck = Date.now();
            return {
                atlassian,
                redhat,
                slack,
                github,
                gitlab
            };
        } catch (error) {
            console.error('Error loading tokens:', error);
            return null;
        }
    }

    //Load GitHub API token
    
    async loadGitHubToken() {
        try {
            const response = await fetch('/api/settings/github-token');
            if (response.ok) {
                const data = await response.json();
                if (data.token) {
                    this.tokens.github = data.token;

                    // Populate the form fields if we're on settings page
                    const githubInput = document.getElementById('githubToken');
                    const githubExpiryInput = document.getElementById('githubTokenExpiry');

                    if (githubInput) {
                        githubInput.value = data.token;
                    }
                    if (githubExpiryInput && data.expiry_date) {
                        githubExpiryInput.value = data.expiry_date;
                    }

                    return {
                        valid: true,
                        token: data.token,
                        expiry_date: data.expiry_date,
                        days_remaining: data.days_remaining
                    };
                }
            }
            this.tokens.github = null;
            return { valid: false };
        } catch (error) {
            console.error('Error loading GitHub token:', error);
            return { valid: false };
        }
    }

    //Load GitLab API token
     
    async loadGitLabToken() {
        try {
            const response = await fetch('/api/settings/gitlab-token');
            if (response.ok) {
                const data = await response.json();
                if (data.token) {
                    this.tokens.gitlab = data.token;

                    // Populate the form fields if we're on settings page
                    const gitlabInput = document.getElementById('gitlabToken');
                    const gitlabExpiryInput = document.getElementById('gitlabTokenExpiry');

                    if (gitlabInput) {
                        gitlabInput.value = data.token;
                    }
                    if (gitlabExpiryInput && data.expiry_date) {
                        gitlabExpiryInput.value = data.expiry_date;
                    }

                    return {
                        valid: true,
                        token: data.token,
                        url: data.url,
                        expiry_date: data.expiry_date,
                        days_remaining: data.days_remaining
                    };
                }
            }
            this.tokens.gitlab = null;
            return { valid: false };
        } catch (error) {
            console.error('Error loading GitLab token:', error);
            return { valid: false };
        }
    }

    //Load Atlassian API token
    
    async loadAtlassianToken() {
        try {
            const response = await fetch('/api/settings/atlassian-token');
            if (response.ok) {
                const data = await response.json();

                if (data.expired) {
                    console.warn('Atlassian token has expired');
                    this.tokens.atlassian = null;
                    return { valid: false, expired: true, message: data.message };
                }

                if (data.token) {
                    this.tokens.atlassian = data.token;

                    // Populate the form fields if we're on settings page
                    const atlassianInput = document.getElementById('atlassianToken');
                    const atlassianEmailInput = document.getElementById('atlassianEmail');
                    const atlassianExpiryInput = document.getElementById('atlassianTokenExpiry');

                    if (atlassianInput) {
                        atlassianInput.value = data.token;
                    }
                    if (atlassianEmailInput && data.email) {
                        atlassianEmailInput.value = data.email;
                    }
                    if (atlassianExpiryInput && data.expiry_date) {
                        atlassianExpiryInput.value = data.expiry_date;
                    }

                    return {
                        valid: true,
                        expired: false,
                        token: data.token,
                        email: data.email,
                        expiry_date: data.expiry_date,
                        days_remaining: data.days_remaining
                    };
                }
            }

            this.tokens.atlassian = null;
            return { valid: false, expired: false };
        } catch (error) {
            console.error('Error loading Atlassian token:', error);
            return { valid: false, expired: false };
        }
    }

    //Load Red Hat API token
     
    async loadRedHatToken() {
        try {
            const response = await fetch('/api/settings/redhat-token');
            if (response.ok) {
                const data = await response.json();

                if (data.expired) {
                    console.warn('Red Hat token has expired');
                    this.tokens.redhat = null;
                    return { valid: false, expired: true, message: data.message };
                }

                if (data.token) {
                    this.tokens.redhat = data.token;

                    // Populate the form fields if we're on settings page
                    const redhatInput = document.getElementById('redhatToken');

                    if (redhatInput) {
                        redhatInput.value = data.token;
                    }

                    return {
                        valid: true,
                        expired: false,
                        token: data.token,
                        expiry_date: data.expiry_date,
                        days_remaining: data.days_remaining
                    };
                }
            }

            this.tokens.redhat = null;
            return { valid: false, expired: false };
        } catch (error) {
            console.error('Error loading Red Hat token:', error);
            return { valid: false, expired: false };
        }
    }

    //Load Slack API tokens
    
    async loadSlackTokens() {
        try {
            const response = await fetch('/api/settings/slack-tokens');
            if (response.ok) {
                const data = await response.json();

                if (data.xoxc && data.xoxd) {
                    this.tokens.slack = {
                        xoxc: data.xoxc,
                        xoxd: data.xoxd
                    };

                    // Populate the form fields if we're on settings page
                    const slackXoxcInput = document.getElementById('slackXoxcToken');
                    const slackXoxdInput = document.getElementById('slackXoxdToken');

                    if (slackXoxcInput) {
                        slackXoxcInput.value = data.xoxc;
                    }
                    if (slackXoxdInput) {
                        slackXoxdInput.value = data.xoxd;
                    }

                    return {
                        valid: true,
                        tokens: this.tokens.slack
                    };
                }
            }

            this.tokens.slack = { xoxc: null, xoxd: null };
            return { valid: false };
        } catch (error) {
            console.error('Error loading Slack tokens:', error);
            return { valid: false };
        }
    }

    //Get Atlassian token (auto-refresh if needed)
    
    async getAtlassianToken() {
        await this.refreshIfNeeded();

        if (!this.tokens.atlassian) {
            throw new Error('Atlassian API token not configured. Please add it in Settings.');
        }

        return this.tokens.atlassian;
    }

    //Get Red Hat token (auto-refresh if needed)
    
    async getRedHatToken() {
        await this.refreshIfNeeded();

        if (!this.tokens.redhat) {
            throw new Error('Red Hat API token not configured. Please add it in Settings.');
        }

        return this.tokens.redhat;
    }

    //Get Slack tokens (auto-refresh if needed)
     
    async getSlackTokens() {
        await this.refreshIfNeeded();

        if (!this.tokens.slack.xoxc || !this.tokens.slack.xoxd) {
            throw new Error('Slack API tokens not configured. Please add them in Settings.');
        }

        return this.tokens.slack;
    }

    //Check if token refresh is needed and refresh if necessary
    
    async refreshIfNeeded() {
        const now = Date.now();

        // Refresh if never checked or last check was more than checkInterval ago
        if (!this.lastCheck || (now - this.lastCheck) > this.checkInterval) {
            await this.loadAllTokens();
        }
    }

    //Check if all tokens are configured
    
    areAllTokensConfigured() {
        return !!(
            this.tokens.atlassian &&
            this.tokens.redhat &&
            this.tokens.slack.xoxc &&
            this.tokens.slack.xoxd
        );
    }

    //Get status of all tokens
    
    async getTokenStatus() {
        try {
            const response = await fetch('/api/settings/token-status');
            if (response.ok) {
                return await response.json();
            }
            return null;
        } catch (error) {
            console.error('Error getting token status:', error);
            return null;
        }
    }

    //Check if a specific token is valid and not expired
    
    async isTokenValid(tokenType) {
        const status = await this.getTokenStatus();
        if (!status || !status[tokenType]) {
            return false;
        }

        const tokenStatus = status[tokenType];
        return tokenStatus.configured && !tokenStatus.expired;
    }
}


// GitHub Token Management

async function saveGitHubToken() {
    const token = document.getElementById('githubToken').value.trim();
    const expiryDate = document.getElementById('githubTokenExpiry').value;
    const statusDiv = document.getElementById('githubStatusMessage');

    if (!token) {
        statusDiv.innerHTML = '<p class="error">⚠️ Please enter a GitHub token</p>';
        statusDiv.style.display = 'block';
        return;
    }

    // Validate format
    if (!token.startsWith('ghp_') && !token.startsWith('github_pat_')) {
        statusDiv.innerHTML = '<p class="error">⚠️ Invalid GitHub token format. Must start with ghp_ or github_pat_</p>';
        statusDiv.style.display = 'block';
        return;
    }

    // Validate expiry date is required
    if (!expiryDate) {
        statusDiv.innerHTML = '<p class="error">⚠️ Please enter the token expiry date</p>';
        statusDiv.style.display = 'block';
        return;
    }

    const selectedDate = new Date(expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        statusDiv.innerHTML = '<p class="error">⚠️ Expiry date cannot be in the past</p>';
        statusDiv.style.display = 'block';
        return;
    }

    try {
        const response = await fetch('/api/settings/github-token', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({token, expiry_date: expiryDate})
        });

        const data = await response.json();

        if (data.success) {
            statusDiv.innerHTML = '<p class="success">✅ GitHub token saved successfully!</p>';
        } else {
            statusDiv.innerHTML = `<p class="error">❌ ${data.message || 'Failed to save token'}</p>`;
        }
        statusDiv.style.display = 'block';
    } catch (error) {
        statusDiv.innerHTML = `<p class="error">❌ Error: ${error.message}</p>`;
        statusDiv.style.display = 'block';
    }
}

async function testGitHubToken() {
    const token = document.getElementById('githubToken').value.trim();
    const statusDiv = document.getElementById('githubStatusMessage');

    if (!token) {
        statusDiv.innerHTML = '<p class="error">⚠️ Please enter a GitHub token first</p>';
        statusDiv.style.display = 'block';
        return;
    }

    statusDiv.innerHTML = '<p class="info">⏳ Testing GitHub connection...</p>';
    statusDiv.style.display = 'block';

    try {
        const response = await fetch('/api/settings/test-github-token', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({token})
        });

        const data = await response.json();

        if (data.valid) {
            statusDiv.innerHTML = `<p class="success">${data.message}</p>`;
        } else {
            statusDiv.innerHTML = `<p class="error">${data.message}</p>`;
        }
        statusDiv.style.display = 'block';
    } catch (error) {
        statusDiv.innerHTML = `<p class="error">❌ Error: ${error.message}</p>`;
        statusDiv.style.display = 'block';
    }
}


// GitLab Token Management

async function saveGitLabToken() {
    const token = document.getElementById('gitlabToken').value.trim();
    const url = 'https://gitlab.cee.redhat.com';  // Red Hat internal GitLab
    const expiryDate = document.getElementById('gitlabTokenExpiry').value;
    const statusDiv = document.getElementById('gitlabStatusMessage');

    if (!token) {
        statusDiv.innerHTML = '<p class="error">⚠️ Please enter a GitLab token</p>';
        statusDiv.style.display = 'block';
        return;
    }

    // Validate format - GitLab tokens can be:
  
    if (token.length < 10) {
        statusDiv.innerHTML = '<p class="error">⚠️ GitLab token appears to be too short. Please check and try again.</p>';
        statusDiv.style.display = 'block';
        return;
    }

    // Validate expiry date is required
    if (!expiryDate) {
        statusDiv.innerHTML = '<p class="error">⚠️ Please enter the token expiry date</p>';
        statusDiv.style.display = 'block';
        return;
    }

    const selectedDate = new Date(expiryDate);
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    if (selectedDate < today) {
        statusDiv.innerHTML = '<p class="error">⚠️ Expiry date cannot be in the past</p>';
        statusDiv.style.display = 'block';
        return;
    }

    try {
        const response = await fetch('/api/settings/gitlab-token', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({token, url, expiry_date: expiryDate})
        });

        const data = await response.json();

        if (data.success) {
            statusDiv.innerHTML = '<p class="success">✅ GitLab token saved successfully!</p>';
        } else {
            statusDiv.innerHTML = `<p class="error">❌ ${data.message || 'Failed to save token'}</p>`;
        }
        statusDiv.style.display = 'block';
    } catch (error) {
        statusDiv.innerHTML = `<p class="error">❌ Error: ${error.message}</p>`;
        statusDiv.style.display = 'block';
    }
}

async function testGitLabToken() {
    const token = document.getElementById('gitlabToken').value.trim();
    const url = 'https://gitlab.cee.redhat.com';  // Red Hat internal GitLab
    const statusDiv = document.getElementById('gitlabStatusMessage');

    if (!token) {
        statusDiv.innerHTML = '<p class="error">⚠️ Please enter a GitLab token first</p>';
        statusDiv.style.display = 'block';
        return;
    }

    statusDiv.innerHTML = '<p class="info">⏳ Testing GitLab connection...</p>';
    statusDiv.style.display = 'block';

    try {
        const response = await fetch('/api/settings/test-gitlab-token', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({token, url})
        });

        const data = await response.json();

        if (data.valid) {
            statusDiv.innerHTML = `<p class="success">${data.message}</p>`;
        } else {
            statusDiv.innerHTML = `<p class="error">${data.message}</p>`;
        }
        statusDiv.style.display = 'block';
    } catch (error) {
        statusDiv.innerHTML = `<p class="error">❌ Error: ${error.message}</p>`;
        statusDiv.style.display = 'block';
    }
}

// Attach event listeners
document.addEventListener('DOMContentLoaded', () => {
    // GitHub
    const saveGitHubBtn = document.getElementById('saveGitHubTokenBtn');
    const testGitHubBtn = document.getElementById('testGitHubTokenBtn');
    const toggleGitHubBtn = document.getElementById('toggleGitHubToken');

    if (saveGitHubBtn) saveGitHubBtn.addEventListener('click', saveGitHubToken);
    if (testGitHubBtn) testGitHubBtn.addEventListener('click', testGitHubToken);
    if (toggleGitHubBtn) {
        toggleGitHubBtn.addEventListener('click', () => {
            const input = document.getElementById('githubToken');
            input.type = input.type === 'password' ? 'text' : 'password';
        });
    }

    // GitLab
    const saveGitLabBtn = document.getElementById('saveGitLabTokenBtn');
    const testGitLabBtn = document.getElementById('testGitLabTokenBtn');
    const toggleGitLabBtn = document.getElementById('toggleGitLabToken');

    if (saveGitLabBtn) saveGitLabBtn.addEventListener('click', saveGitLabToken);
    if (testGitLabBtn) testGitLabBtn.addEventListener('click', testGitLabToken);
    if (toggleGitLabBtn) {
        toggleGitLabBtn.addEventListener('click', () => {
            const input = document.getElementById('gitlabToken');
            input.type = input.type === 'password' ? 'text' : 'password';
        });
    }
});

// Create global instance
window.tokenManager = new TokenManager();

// Auto-initialize on page load
document.addEventListener('DOMContentLoaded', async () => {
    await window.tokenManager.initialize();
    console.log('Token Manager initialized');
});
