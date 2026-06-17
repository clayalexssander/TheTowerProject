const crypto = require('crypto');

const SESSION_COOKIE_NAME = 'thetower_session';
const SESSION_DURATION_MS = 1000 * 60 * 60 * 8;
const sessions = new Map();

function parseCookies(cookieHeader = '') {
    return cookieHeader.split(';').reduce((cookies, cookie) => {
        const [name, ...valueParts] = cookie.trim().split('=');

        if (!name || valueParts.length === 0) {
            return cookies;
        }

        cookies[name] = decodeURIComponent(valueParts.join('='));
        return cookies;
    }, {});
}

function buildSessionCookie(token, maxAgeSeconds) {
    const secureFlag = process.env.NODE_ENV === 'production' ? '; Secure' : '';

    return [
        `${SESSION_COOKIE_NAME}=${encodeURIComponent(token)}`,
        'HttpOnly',
        'SameSite=Lax',
        'Path=/',
        `Max-Age=${maxAgeSeconds}`,
        secureFlag
    ].join('; ');
}

function createSession(res, user) {
    const token = crypto.randomBytes(32).toString('hex');
    const expiresAt = Date.now() + SESSION_DURATION_MS;

    sessions.set(token, { user, expiresAt });
    res.setHeader('Set-Cookie', buildSessionCookie(token, SESSION_DURATION_MS / 1000));

    return { token, user, expiresAt };
}

function destroySession(req, res) {
    const token = getSessionToken(req);

    if (token) {
        sessions.delete(token);
    }

    res.setHeader('Set-Cookie', buildSessionCookie('', 0));
}

function getSessionToken(req) {
    const cookies = parseCookies(req.headers.cookie);
    return cookies[SESSION_COOKIE_NAME];
}

function getSession(req) {
    const token = getSessionToken(req);

    if (!token) {
        return null;
    }

    const session = sessions.get(token);

    if (!session) {
        return null;
    }

    if (session.expiresAt <= Date.now()) {
        sessions.delete(token);
        return null;
    }

    session.expiresAt = Date.now() + SESSION_DURATION_MS;
    return session;
}

function requireAuth(req, res, next) {
    const session = getSession(req);

    if (!session) {
        return res.status(401).json({
            success: false,
            message: 'Sessao expirada ou usuario nao autenticado.'
        });
    }

    req.user = session.user;
    next();
}

module.exports = {
    createSession,
    destroySession,
    getSession,
    requireAuth
};
