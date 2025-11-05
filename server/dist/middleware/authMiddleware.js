import { verifyJwt } from '../utils/jwt.js';
export function authMiddleware(req, res, next) {
    const header = req.headers.authorization;
    if (!header || !header.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized' });
    }
    const token = header.slice('Bearer '.length);
    try {
        const decoded = verifyJwt(token);
        req.user = decoded;
        return next();
    }
    catch {
        return res.status(401).json({ message: 'Invalid token' });
    }
}
