import { Router } from 'express';
import authRoutes from './authRoutes.js';
import blogRoutes from './blogRoutes.js';

const router = Router();

// Health check endpoint
router.get('/health', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Server is running successfully',
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
    });
});

// API routes
router.use('/auth', authRoutes);
router.use('/blogs', blogRoutes);

// API info endpoint
router.get('/', (req, res) => {
    res.status(200).json({
        success: true,
        message: 'Blog API v1.0',
        endpoints: {
            auth: {
                register: 'POST /api/auth/register',
                login: 'POST /api/auth/login',
                profile: 'GET /api/auth/profile',
                updateProfile: 'PUT /api/auth/profile',
                logout: 'POST /api/auth/logout',
            },
            blogs: {
                getAll: 'GET /api/blogs',
                getById: 'GET /api/blogs/:id',
                getBySlug: 'GET /api/blogs/slug/:slug',
                getByAuthor: 'GET /api/blogs/author/:authorId',
                getMyBlogs: 'GET /api/blogs/my',
                create: 'POST /api/blogs',
                update: 'PUT /api/blogs/:id',
                delete: 'DELETE /api/blogs/:id',
                like: 'POST /api/blogs/:id/like',
                stats: 'GET /api/blogs/stats',
                myStats: 'GET /api/blogs/my/stats',
            },
        },
    });
});

export default router;
