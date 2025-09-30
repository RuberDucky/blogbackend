import authService from '../services/authService.js';

export const authenticate = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (!authHeader || !authHeader.startsWith('Bearer ')) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. No token provided.',
            });
        }

        const token = authHeader.substring(7); // Remove 'Bearer ' prefix

        try {
            const decoded = authService.verifyToken(token);
            const user = await authService.getProfile(decoded.id);

            if (!user || !user.isActive) {
                return res.status(401).json({
                    success: false,
                    message: 'Invalid token or user not found.',
                });
            }

            req.user = {
                id: user.id,
                email: user.email,
                role: user.role,
            };

            next();
        } catch (tokenError) {
            return res.status(401).json({
                success: false,
                message: 'Invalid or expired token.',
            });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Server error during authentication.',
        });
    }
};

export const authorize = (...roles) => {
    return (req, res, next) => {
        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: 'Access denied. Authentication required.',
            });
        }

        if (!roles.includes(req.user.role)) {
            return res.status(403).json({
                success: false,
                message: 'Access denied. Insufficient permissions.',
            });
        }

        next();
    };
};

export const optionalAuth = async (req, res, next) => {
    try {
        const authHeader = req.headers.authorization;

        if (authHeader && authHeader.startsWith('Bearer ')) {
            const token = authHeader.substring(7);

            try {
                const decoded = authService.verifyToken(token);
                const user = await authService.getProfile(decoded.id);

                if (user && user.isActive) {
                    req.user = {
                        id: user.id,
                        email: user.email,
                        role: user.role,
                    };
                }
            } catch (tokenError) {
                // Invalid token, but continue without user
                req.user = null;
            }
        }

        next();
    } catch (error) {
        next();
    }
};
