import Blog from '../models/Blog.js';
import User from '../models/User.js';
import { Op } from 'sequelize';

class BlogService {
    // Create new blog post
    async createBlog(blogData, authorId) {
        try {
            const blog = await Blog.create({
                ...blogData,
                authorId,
            });

            // Fetch blog with author details
            const createdBlog = await Blog.findByPk(blog.id, {
                include: [
                    {
                        model: User,
                        as: 'author',
                        attributes: [
                            'id',
                            'firstName',
                            'lastName',
                            'email',
                            'profileImage',
                        ],
                    },
                ],
            });

            return createdBlog;
        } catch (error) {
            throw error;
        }
    }

    // Get all blogs with pagination and filters
    async getAllBlogs(options = {}) {
        try {
            const {
                page = 1,
                limit = 10,
                isPublished,
                category,
                tags,
                search,
                sortBy = 'createdAt',
                sortOrder = 'DESC',
            } = options;
            const offset = (page - 1) * limit;

            // Build where clause
            const whereClause = {};

            if (isPublished !== undefined) {
                whereClause.status = isPublished ? 'published' : 'draft';
            }

            if (category) {
                whereClause.category = category;
            }

            if (tags && tags.length > 0) {
                whereClause.tags = {
                    [Op.overlap]: tags,
                };
            }

            if (search) {
                whereClause[Op.or] = [
                    { title: { [Op.iLike]: `%${search}%` } },
                    { content: { [Op.iLike]: `%${search}%` } },
                    { excerpt: { [Op.iLike]: `%${search}%` } },
                    { '$author.firstName$': { [Op.iLike]: `%${search}%` } },
                    { '$author.lastName$': { [Op.iLike]: `%${search}%` } },
                ];
            }

            const { count, rows } = await Blog.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: User,
                        as: 'author',
                        attributes: [
                            'id',
                            'firstName',
                            'lastName',
                            'email',
                            'profileImage',
                        ],
                    },
                ],
                order: [[sortBy, sortOrder]],
                limit: parseInt(limit),
                offset: parseInt(offset),
                distinct: true,
            });

            return {
                blogs: rows,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(count / limit),
                    totalItems: count,
                    itemsPerPage: parseInt(limit),
                },
            };
        } catch (error) {
            throw error;
        }
    }

    // Get blog by ID
    async getBlogById(blogId) {
        try {
            const blog = await Blog.findByPk(blogId, {
                include: [
                    {
                        model: User,
                        as: 'author',
                        attributes: [
                            'id',
                            'firstName',
                            'lastName',
                            'email',
                            'profileImage',
                            'bio',
                        ],
                    },
                ],
            });

            if (!blog) {
                throw new Error('Blog post not found');
            }

            // Increment views
            await blog.increment('views');

            return blog;
        } catch (error) {
            throw error;
        }
    }

    // Get blog by slug
    async getBlogBySlug(slug) {
        try {
            const blog = await Blog.findOne({
                where: { slug },
                include: [
                    {
                        model: User,
                        as: 'author',
                        attributes: [
                            'id',
                            'firstName',
                            'lastName',
                            'email',
                            'profileImage',
                            'bio',
                        ],
                    },
                ],
            });

            if (!blog) {
                throw new Error('Blog post not found');
            }

            // Increment views
            await blog.increment('views');

            return blog;
        } catch (error) {
            throw error;
        }
    }

    // Update blog
    async updateBlog(blogId, updateData, userId) {
        try {
            const blog = await Blog.findByPk(blogId);

            if (!blog) {
                throw new Error('Blog post not found');
            }

            // Check if user is author or admin
            if (blog.authorId !== userId) {
                throw new Error('Unauthorized to update this blog post');
            }

            await blog.update(updateData);

            // Return updated blog with author details
            const updatedBlog = await Blog.findByPk(blogId, {
                include: [
                    {
                        model: User,
                        as: 'author',
                        attributes: [
                            'id',
                            'firstName',
                            'lastName',
                            'email',
                            'profileImage',
                        ],
                    },
                ],
            });

            return updatedBlog;
        } catch (error) {
            throw error;
        }
    }

    // Delete blog
    async deleteBlog(blogId, userId) {
        try {
            const blog = await Blog.findByPk(blogId);

            if (!blog) {
                throw new Error('Blog post not found');
            }

            // Check if user is author or admin
            if (blog.authorId !== userId) {
                throw new Error('Unauthorized to delete this blog post');
            }

            await blog.destroy();
            return { message: 'Blog post deleted successfully' };
        } catch (error) {
            throw error;
        }
    }

    // Get blogs by author
    async getBlogsByAuthor(authorId, options = {}) {
        try {
            const {
                page = 1,
                limit = 10,
                status,
                sortBy = 'createdAt',
                sortOrder = 'DESC',
            } = options;

            const offset = (page - 1) * limit;

            const whereClause = { authorId };
            if (status) {
                whereClause.status = status;
            }

            const { count, rows } = await Blog.findAndCountAll({
                where: whereClause,
                include: [
                    {
                        model: User,
                        as: 'author',
                        attributes: [
                            'id',
                            'firstName',
                            'lastName',
                            'email',
                            'profileImage',
                        ],
                    },
                ],
                order: [[sortBy, sortOrder]],
                limit: parseInt(limit),
                offset: parseInt(offset),
            });

            return {
                blogs: rows,
                pagination: {
                    currentPage: parseInt(page),
                    totalPages: Math.ceil(count / limit),
                    totalItems: count,
                    itemsPerPage: parseInt(limit),
                },
            };
        } catch (error) {
            throw error;
        }
    }

    // Like/Unlike blog
    async toggleLike(blogId) {
        try {
            const blog = await Blog.findByPk(blogId);

            if (!blog) {
                throw new Error('Blog post not found');
            }

            await blog.increment('likes');
            return {
                message: 'Blog post liked successfully',
                likes: blog.likes + 1,
            };
        } catch (error) {
            throw error;
        }
    }

    // Get blog statistics
    async getBlogStats(authorId = null) {
        try {
            const whereClause = authorId ? { authorId } : {};

            const totalBlogs = await Blog.count({ where: whereClause });
            const publishedBlogs = await Blog.count({
                where: { ...whereClause, status: 'published' },
            });
            const draftBlogs = await Blog.count({
                where: { ...whereClause, status: 'draft' },
            });
            const totalViews =
                (await Blog.sum('views', { where: whereClause })) || 0;
            const totalLikes =
                (await Blog.sum('likes', { where: whereClause })) || 0;

            return {
                totalBlogs,
                publishedBlogs,
                draftBlogs,
                totalViews,
                totalLikes,
            };
        } catch (error) {
            throw error;
        }
    }
}

export default new BlogService();
