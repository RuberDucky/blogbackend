import { Router } from 'express';
import blogController from '../controllers/blogController.js';
import { authenticate, optionalAuth } from '../middlewares/auth.js';
import { blogLimiter } from '../middlewares/rateLimiter.js';
import {
    validateBlogCreation,
    validateBlogUpdate,
    validateUUID,
    validateSlug,
    validatePagination,
} from '../middlewares/validation.js';

const router = Router();

// Public routes
router.get('/', validatePagination, blogController.getAllBlogs);
router.get(
    '/slug/:slug',
    validateSlug,
    optionalAuth,
    blogController.getBlogBySlug,
);
router.get(
    '/author/:authorId',
    validateUUID,
    validatePagination,
    blogController.getBlogsByAuthor,
);
router.get('/stats', blogController.getBlogStats);

// Protected routes
router.post(
    '/',
    authenticate,
    blogLimiter,
    validateBlogCreation,
    blogController.createBlog,
);
router.get('/my', authenticate, validatePagination, blogController.getMyBlogs);
router.get('/my/stats', authenticate, blogController.getBlogStats);

// Routes with ID parameter
router.get('/:id', validateUUID, optionalAuth, blogController.getBlogById);
router.put(
    '/:id',
    authenticate,
    validateUUID,
    validateBlogUpdate,
    blogController.updateBlog,
);
router.delete('/:id', authenticate, validateUUID, blogController.deleteBlog);
router.post('/:id/like', validateUUID, blogController.toggleLike);

export default router;
