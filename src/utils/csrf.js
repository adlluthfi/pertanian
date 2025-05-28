export const generateCSRFToken = () => {
    return Math.random().toString(36).substring(2) + Date.now().toString(36);
};

export const getCSRFToken = () => {
    let token = localStorage.getItem('csrf_token');
    if (!token) {
        token = generateCSRFToken();
        localStorage.setItem('csrf_token', token);
    }
    return token;
};