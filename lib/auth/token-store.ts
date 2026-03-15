let accessToken: string | null = null;

const STORAGE_KEY = "obliq.accessToken";

function canUseStorage() {
    return typeof window !== "undefined";
}

export function setAccessToken(token: string | null) {
    accessToken = token;

    if (!canUseStorage()) {
        return;
    }

    if (!token) {
        window.localStorage.removeItem(STORAGE_KEY);
        return;
    }

    window.localStorage.setItem(STORAGE_KEY, token);
}

export function getAccessToken() {
    if (accessToken) {
        return accessToken;
    }

    if (!canUseStorage()) {
        return null;
    }

    const storedToken = window.localStorage.getItem(STORAGE_KEY);
    accessToken = storedToken || null;
    return accessToken;
}

export function clearAccessToken() {
    accessToken = null;

    if (!canUseStorage()) {
        return;
    }

    window.localStorage.removeItem(STORAGE_KEY);
}