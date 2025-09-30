import { validationResult } from 'express-validator';
import blogService from '../services/blogService.js';

class BlogController {
    // Create new blog post
    async createBlog(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation errors',
                    errors: errors.array(),
                });
            }

            const blog = await blogService.createBlog(req.body, req.user.id);

            res.status(201).json({
                success: true,
                message: 'Blog post created successfully',
                data: blog,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Get all blog posts
    async getAllBlogs(req, res) {
        try {
            const options = {
                page: req.query.page,
                limit: req.query.limit,
                status: req.query.status,
                category: req.query.category,
                tags: req.query.tags ? req.query.tags.split(',') : undefined,
                search: req.query.search,
                sortBy: req.query.sortBy,
                sortOrder: req.query.sortOrder,
            };

            const result = await blogService.getAllBlogs(options);

            res.status(200).json({
                success: true,
                message: 'Blog posts retrieved successfully',
                data: result.blogs,
                pagination: result.pagination,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Get blog post by ID
    async getBlogById(req, res) {
        try {
            const blog = await blogService.getBlogById(req.params.id);

            res.status(200).json({
                success: true,
                message: 'Blog post retrieved successfully',
                data: blog,
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Get blog post by slug
    async getBlogBySlug(req, res) {
        try {
            const blog = await blogService.getBlogBySlug(req.params.slug);

            res.status(200).json({
                success: true,
                message: 'Blog post retrieved successfully',
                data: blog,
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Update blog post
    async updateBlog(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation errors',
                    errors: errors.array(),
                });
            }

            const blog = await blogService.updateBlog(
                req.params.id,
                req.body,
                req.user.id,
            );

            res.status(200).json({
                success: true,
                message: 'Blog post updated successfully',
                data: blog,
            });
        } catch (error) {
            const statusCode = error.message.includes('Unauthorized')
                ? 403
                : error.message.includes('not found')
                ? 404
                : 400;

            res.status(statusCode).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Delete blog post
    async deleteBlog(req, res) {
        try {
            const result = await blogService.deleteBlog(
                req.params.id,
                req.user.id,
            );

            res.status(200).json({
                success: true,
                message: result.message,
            });
        } catch (error) {
            const statusCode = error.message.includes('Unauthorized')
                ? 403
                : error.message.includes('not found')
                ? 404
                : 400;

            res.status(statusCode).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Get user's blog posts
    async getMyBlogs(req, res) {
        try {
            const options = {
                page: req.query.page,
                limit: req.query.limit,
                status: req.query.status,
                sortBy: req.query.sortBy,
                sortOrder: req.query.sortOrder,
            };

            const result = await blogService.getBlogsByAuthor(
                req.user.id,
                options,
            );

            res.status(200).json({
                success: true,
                message: 'Your blog posts retrieved successfully',
                data: result.blogs,
                pagination: result.pagination,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Get blogs by specific author
    async getBlogsByAuthor(req, res) {
        try {
            const options = {
                page: req.query.page,
                limit: req.query.limit,
                status: 'published', // Only show published blogs for public view
                sortBy: req.query.sortBy,
                sortOrder: req.query.sortOrder,
            };

            const result = await blogService.getBlogsByAuthor(
                req.params.authorId,
                options,
            );

            res.status(200).json({
                success: true,
                message: 'Author blog posts retrieved successfully',
                data: result.blogs,
                pagination: result.pagination,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Like/Unlike blog post
    async toggleLike(req, res) {
        try {
            const result = await blogService.toggleLike(req.params.id);

            res.status(200).json({
                success: true,
                message: result.message,
                likes: result.likes,
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Get blog statistics
    async getBlogStats(req, res) {
        try {
            // If user is requesting their own stats, pass their ID
            const authorId = req.query.my === 'true' ? req.user.id : null;
            const stats = await blogService.getBlogStats(authorId);

            res.status(200).json({
                success: true,
                message: 'Blog statistics retrieved successfully',
                data: stats,
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                message: error.message,
            });
        }
    }
}

export default new BlogController();
