(function () {
    const API_URL = window.location.port === '3000' ? '/api' : 'http://localhost:3000/api';
    const LOGIN_PAGE = '../index.html';
    const originalFetch = window.fetch.bind(window);

    window.fetch = async (resource, options = {}) => {
        const url = typeof resource === 'string' ? resource : resource.url;
        const shouldSendSession = url && url.startsWith(API_URL);
        const requestOptions = shouldSendSession
            ? { ...options, credentials: 'include' }
            : options;

        const response = await originalFetch(resource, requestOptions);

        if (shouldSendSession && response.status === 401) {
            localStorage.removeItem('user');
            window.location.replace(LOGIN_PAGE);
        }

        return response;
    };

    async function validateSession() {
        try {
            const response = await originalFetch(`${API_URL}/session`, {
                credentials: 'include'
            });

            if (!response.ok) {
                throw new Error('Sessao invalida');
            }

            const session = await response.json();
            localStorage.setItem('user', JSON.stringify(session.user));
        } catch (error) {
            localStorage.removeItem('user');
            window.location.replace(LOGIN_PAGE);
        }
    }

    window.authReady = validateSession();
})();
