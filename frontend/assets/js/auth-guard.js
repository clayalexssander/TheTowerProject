(function () {
    const API_URL = 'http://localhost:3000/api';
    const LOGIN_PAGE = '../index.html';
    const LOGOUT_BUTTON_ID = 'logoutButton';
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

    async function logout() {
        try {
            await originalFetch(`${API_URL}/logout`, {
                method: 'POST',
                credentials: 'include'
            });
        } finally {
            localStorage.removeItem('user');
            window.location.replace(LOGIN_PAGE);
        }
    }

    function createLogoutButton() {
        if (document.getElementById(LOGOUT_BUTTON_ID)) {
            return;
        }

        const button = document.createElement('button');
        button.id = LOGOUT_BUTTON_ID;
        button.type = 'button';
        button.textContent = 'Sair';
        button.setAttribute('aria-label', 'Sair do sistema');
        button.addEventListener('click', logout);

        Object.assign(button.style, {
            position: 'fixed',
            top: '16px',
            right: '16px',
            zIndex: '9999',
            padding: '10px 16px',
            border: '0',
            borderRadius: '6px',
            background: '#1f2937',
            color: '#ffffff',
            fontFamily: 'Inter, Arial, sans-serif',
            fontSize: '14px',
            fontWeight: '700',
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(0, 0, 0, 0.18)'
        });

        button.addEventListener('mouseenter', () => {
            button.style.background = '#111827';
        });

        button.addEventListener('mouseleave', () => {
            button.style.background = '#1f2937';
        });

        document.body.appendChild(button);
    }

    document.addEventListener('DOMContentLoaded', createLogoutButton);

    window.authReady = validateSession();
})();
