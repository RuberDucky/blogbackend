import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';

// Import configurations
import config from './config/config.js';
import { connectDB } from './utils/database.js';

// Import routes
import routes from './routes/index.js';

// Import middlewares
import { generalLimiter } from './middlewares/rateLimiter.js';
import {
    errorHandler,
    notFound,
    handleUnhandledRejection,
    handleUncaughtException,
} from './middlewares/errorHandler.js';

// Import models to ensure associations are loaded
import './models/index.js';

// Load environment variables
dotenv.config();

// Handle uncaught exceptions
handleUncaughtException();

const app = express();

// Trust proxy (for rate limiting behind reverse proxy)
app.set('trust proxy', 1);

// Security middleware
app.use(
    helmet({
        crossOriginResourcePolicy: { policy: 'cross-origin' },
    }),
);

// CORS configuration - allow multiple origins for development and production
const corsOptions = {
    origin: function (origin, callback) {
        // Allow requests with no origin (like mobile apps or curl requests)
        if (!origin) return callback(null, true);

        const allowedOrigins = [
            config.FRONTEND_URL,
            'http://localhost:3000',
            'http://localhost:5173',
            'http://localhost:4173',
            'https://localhost:3000',
            'https://localhost:5173',
            'https://localhost:4173'
        ];

        if (allowedOrigins.indexOf(origin) !== -1) {
            callback(null, true);
        } else {
            console.log('CORS blocked origin:', origin);
            callback(new Error('Not allowed by CORS'));
        }
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
    allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'Accept',
        'Origin',
        'Access-Control-Request-Method',
        'Access-Control-Request-Headers',
    ],
    exposedHeaders: ['Content-Length', 'X-Kuma-Revision'],
    optionsSuccessStatus: 200,
    preflightContinue: false,
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Handle preflight requests explicitly
app.options('*', (req, res) => {
    res.header('Access-Control-Allow-Origin', req.headers.origin);
    res.header(
        'Access-Control-Allow-Methods',
        'GET,POST,PUT,DELETE,OPTIONS,PATCH',
    );
    res.header(
        'Access-Control-Allow-Headers',
        'Content-Type,Authorization,X-Requested-With,Accept,Origin,Access-Control-Request-Method,Access-Control-Request-Headers',
    );
    res.header('Access-Control-Allow-Credentials', 'true');
    res.sendStatus(200);
});

// Rate limiting
app.use(generalLimiter);

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Request logging middleware (development only)
if (config.NODE_ENV === 'development') {
    app.use((req, res, next) => {
        console.log(`${new Date().toISOString()} - ${req.method} ${req.path}`);
        next();
    });
}

// Routes
app.use('/api', routes);

// Root endpoint
app.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Welcome to Blog Backend API',
        version: '1.0.0',
        documentation: '/api',
        health: '/api/health',
    });
});

// 404 handler
app.use(notFound);

// Global error handler
app.use(errorHandler);

// Start server
const startServer = async () => {
    try {
        // Connect to database
        await connectDB();

        // Start server
        const server = app.listen(config.PORT, () => {
            console.log(`
🚀 Server is running in ${config.NODE_ENV} mode
📍 Server URL: http://localhost:${config.PORT}
📚 API Documentation: http://localhost:${config.PORT}/api
💚 Health Check: http://localhost:${config.PORT}/api/health
      `);
        });

        // Handle unhandled promise rejections
        handleUnhandledRejection();

        // Graceful shutdown
        process.on('SIGTERM', () => {
            console.log('SIGTERM received. Shutting down gracefully...');
            server.close(() => {
                console.log('Process terminated');
            });
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
};

// Start the server
startServer();

export default app;
