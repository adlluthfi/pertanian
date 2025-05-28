import DOMPurify from 'dompurify';

export const sanitizeInput = (input) => {
    if (typeof input === 'string') {
        return DOMPurify.sanitize(input, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    }
    return input;
};

export const sanitizeObject = (obj) => {
    if (typeof obj !== 'object') return obj;
    
    return Object.keys(obj).reduce((acc, key) => {
        acc[key] = sanitizeInput(obj[key]);
        return acc;
    }, {});
};