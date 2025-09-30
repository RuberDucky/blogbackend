import config from '../config/config.js';

// Global error handler
export const errorHandler = (err, req, res, next) => {
    let error = { ...err };
    error.message = err.message;

    // Log error
    console.error(err);

    // Sequelize validation error
    if (err.name === 'SequelizeValidationError') {
        const message = err.errors.map((error) => error.message).join(', ');
        error = {
            message,
            statusCode: 400,
        };
    }

    // Sequelize unique constraint error
    if (err.name === 'SequelizeUniqueConstraintError') {
        const message = 'Duplicate field value entered';
        error = {
            message,
            statusCode: 400,
        };
    }

    // JWT error
    if (err.name === 'JsonWebTokenError') {
        const message = 'Invalid token';
        error = {
            message,
            statusCode: 401,
        };
    }

    // JWT expired error
    if (err.name === 'TokenExpiredError') {
        const message = 'Token expired';
        error = {
            message,
            statusCode: 401,
        };
    }

    // Sequelize database connection error
    if (err.name === 'SequelizeConnectionError') {
        const message = 'Database connection error';
        error = {
            message,
            statusCode: 500,
        };
    }

    res.status(error.statusCode || 500).json({
        success: false,
        message: error.message || 'Server Error',
        ...(config.NODE_ENV === 'development' && { stack: err.stack }),
    });
};

// Handle unhandled promise rejections
export const handleUnhandledRejection = () => {
    process.on('unhandledRejection', (err, promise) => {
        console.log(`Error: ${err.message}`);
        // Close server & exit process
        process.exit(1);
    });
};

// Handle uncaught exceptions
export const handleUncaughtException = () => {
    process.on('uncaughtException', (err) => {
        console.log(`Error: ${err.message}`);
        console.log('Shutting down the server due to Uncaught Exception');
        process.exit(1);
    });
};

// 404 handler
export const notFound = (req, res, next) => {
    const error = new Error(`Not found - ${req.originalUrl}`);
    error.statusCode = 404;
    next(error);
};

// Async error wrapper
export const asyncHandler = (fn) => (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
};
