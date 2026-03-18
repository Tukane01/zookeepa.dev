import jwt from 'jsonwebtoken';

const JWT_SECRET = import.meta.env.VITE_JWT_SECRET || 'zookeepa_super_secret_key_2026';

export function authenticateToken(req, res, next) {
  const authHeader = req.headers?.authorization;
  const token = authHeader?.split(' ')[1];

  if (!token) {
    return res.status?.(401)?.json?.({ message: 'Access denied. No token provided.' }) || null;
  }

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) {
      return res.status?.(403)?.json?.({ message: 'Invalid or expired token.' }) || null;
    }
    req.user = user;
    next?.();
  });
}

export function authorizeRoles(...allowedRoles) {
  return (req, res, next) => {
    if (!req.user || !allowedRoles.includes(req.user.role)) {
      return res.status?.(403)?.json?.({ message: 'Forbidden: You do not have the required permissions.' }) || null;
    }
    next?.();
  };
}
