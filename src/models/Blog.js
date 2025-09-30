import { DataTypes } from 'sequelize';
import sequelize from '../config/database.js';
import User from './User.js';

const Blog = sequelize.define(
    'Blog',
    {
        id: {
            type: DataTypes.UUID,
            defaultValue: DataTypes.UUIDV4,
            primaryKey: true,
        },
        title: {
            type: DataTypes.STRING,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [3, 200],
            },
        },
        content: {
            type: DataTypes.TEXT,
            allowNull: false,
            validate: {
                notEmpty: true,
                len: [10, 10000],
            },
        },
        excerpt: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        slug: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        featuredImage: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        status: {
            type: DataTypes.ENUM('draft', 'published', 'archived'),
            defaultValue: 'draft',
        },
        tags: {
            type: DataTypes.JSON,
            allowNull: true,
            defaultValue: [],
        },
        category: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        readTime: {
            type: DataTypes.INTEGER,
            allowNull: true,
            comment: 'Estimated reading time in minutes',
        },
        views: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        likes: {
            type: DataTypes.INTEGER,
            defaultValue: 0,
        },
        publishedAt: {
            type: DataTypes.DATE,
            allowNull: true,
        },
        metaTitle: {
            type: DataTypes.STRING,
            allowNull: true,
        },
        metaDescription: {
            type: DataTypes.STRING(500),
            allowNull: true,
        },
        // Virtual field for frontend compatibility
        isPublished: {
            type: DataTypes.VIRTUAL,
            get() {
                return this.status === 'published';
            },
            set(value) {
                this.setDataValue('status', value ? 'published' : 'draft');
            },
        },
    },
    {
        tableName: 'Blogs',
        timestamps: true,
        hooks: {
            beforeCreate: (blog) => {
                // Generate slug from title if not provided
                if (!blog.slug && blog.title) {
                    blog.slug =
                        blog.title
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/(^-|-$)/g, '') +
                        '-' +
                        Date.now();
                }

                // Generate excerpt from content if not provided
                if (!blog.excerpt && blog.content) {
                    blog.excerpt = blog.content.substring(0, 150) + '...';
                }

                // Calculate reading time (average 200 words per minute)
                if (blog.content) {
                    const wordCount = blog.content.split(/\s+/).length;
                    blog.readTime = Math.ceil(wordCount / 200);
                }

                // Set published date if status is published
                if (blog.status === 'published' && !blog.publishedAt) {
                    blog.publishedAt = new Date();
                }

                // Handle isPublished virtual field
                if (blog.dataValues.isPublished !== undefined) {
                    blog.status = blog.dataValues.isPublished
                        ? 'published'
                        : 'draft';
                    if (blog.status === 'published' && !blog.publishedAt) {
                        blog.publishedAt = new Date();
                    }
                }
            },
            beforeUpdate: (blog) => {
                // Update slug if title changed
                if (blog.changed('title') && blog.title) {
                    blog.slug =
                        blog.title
                            .toLowerCase()
                            .replace(/[^a-z0-9]+/g, '-')
                            .replace(/(^-|-$)/g, '') +
                        '-' +
                        Date.now();
                }

                // Update excerpt if content changed
                if (
                    blog.changed('content') &&
                    blog.content &&
                    !blog.changed('excerpt')
                ) {
                    blog.excerpt = blog.content.substring(0, 150) + '...';
                }

                // Recalculate reading time if content changed
                if (blog.changed('content') && blog.content) {
                    const wordCount = blog.content.split(/\s+/).length;
                    blog.readTime = Math.ceil(wordCount / 200);
                }

                // Set published date when status changes to published
                if (
                    blog.changed('status') &&
                    blog.status === 'published' &&
                    !blog.publishedAt
                ) {
                    blog.publishedAt = new Date();
                }

                // Handle isPublished virtual field
                if (blog.dataValues.isPublished !== undefined) {
                    blog.status = blog.dataValues.isPublished
                        ? 'published'
                        : 'draft';
                    if (blog.status === 'published' && !blog.publishedAt) {
                        blog.publishedAt = new Date();
                    }
                }
            },
        },
    },
);

// Define associations
Blog.belongsTo(User, {
    foreignKey: 'authorId',
    as: 'author',
});

User.hasMany(Blog, {
    foreignKey: 'authorId',
    as: 'blogs',
});

export default Blog;
