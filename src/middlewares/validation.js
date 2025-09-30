import { body, param, query } from 'express-validator';

// User validation
export const validateUserRegistration = [
    body('firstName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters'),

    body('lastName')
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters'),

    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),

    body('password')
        .isLength({ min: 6 })
        .withMessage('Password must be at least 6 characters long')
        .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
        .withMessage(
            'Password must contain at least one lowercase letter, one uppercase letter, and one number',
        ),
];

export const validateUserLogin = [
    body('email')
        .isEmail()
        .normalizeEmail()
        .withMessage('Please provide a valid email address'),

    body('password').notEmpty().withMessage('Password is required'),
];

export const validateUserUpdate = [
    body('firstName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('First name must be between 2 and 50 characters'),

    body('lastName')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Last name must be between 2 and 50 characters'),

    body('bio')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Bio must not exceed 500 characters'),

    body('profileImage')
        .optional()
        .isURL()
        .withMessage('Profile image must be a valid URL'),
];

// Blog validation
export const validateBlogCreation = [
    body('title')
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage('Title must be between 3 and 200 characters'),

    body('content')
        .trim()
        .isLength({ min: 10, max: 10000 })
        .withMessage('Content must be between 10 and 10000 characters'),

    body('excerpt')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Excerpt must not exceed 500 characters'),

    body('status')
        .optional()
        .isIn(['draft', 'published', 'archived'])
        .withMessage('Status must be either draft, published, or archived'),

    body('category')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Category must be between 2 and 50 characters'),

    body('tags').optional().isArray().withMessage('Tags must be an array'),

    body('tags.*')
        .optional()
        .trim()
        .isLength({ min: 1, max: 30 })
        .withMessage('Each tag must be between 1 and 30 characters'),

    body('featuredImage')
        .optional()
        .isURL()
        .withMessage('Featured image must be a valid URL'),

    body('metaTitle')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Meta title must not exceed 200 characters'),

    body('metaDescription')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Meta description must not exceed 500 characters'),
];

export const validateBlogUpdate = [
    body('title')
        .optional()
        .trim()
        .isLength({ min: 3, max: 200 })
        .withMessage('Title must be between 3 and 200 characters'),

    body('content')
        .optional()
        .trim()
        .isLength({ min: 10, max: 10000 })
        .withMessage('Content must be between 10 and 10000 characters'),

    body('excerpt')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Excerpt must not exceed 500 characters'),

    body('status')
        .optional()
        .isIn(['draft', 'published', 'archived'])
        .withMessage('Status must be either draft, published, or archived'),

    body('category')
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage('Category must be between 2 and 50 characters'),

    body('tags').optional().isArray().withMessage('Tags must be an array'),

    body('tags.*')
        .optional()
        .trim()
        .isLength({ min: 1, max: 30 })
        .withMessage('Each tag must be between 1 and 30 characters'),

    body('featuredImage')
        .optional()
        .isURL()
        .withMessage('Featured image must be a valid URL'),

    body('metaTitle')
        .optional()
        .trim()
        .isLength({ max: 200 })
        .withMessage('Meta title must not exceed 200 characters'),

    body('metaDescription')
        .optional()
        .trim()
        .isLength({ max: 500 })
        .withMessage('Meta description must not exceed 500 characters'),
];

// Param validation
export const validateUUID = [
    param('id').isUUID().withMessage('Invalid ID format'),
];

export const validateSlug = [
    param('slug')
        .matches(/^[a-z0-9]+(?:-[a-z0-9]+)*$/)
        .withMessage('Invalid slug format'),
];

// Query validation
export const validatePagination = [
    query('page')
        .optional()
        .isInt({ min: 1 })
        .withMessage('Page must be a positive integer'),

    query('limit')
        .optional()
        .isInt({ min: 1, max: 100 })
        .withMessage('Limit must be between 1 and 100'),

    query('sortBy')
        .optional()
        .isIn([
            'createdAt',
            'updatedAt',
            'title',
            'views',
            'likes',
            'publishedAt',
        ])
        .withMessage('Invalid sort field'),

    query('sortOrder')
        .optional()
        .isIn(['ASC', 'DESC'])
        .withMessage('Sort order must be ASC or DESC'),

    query('status')
        .optional()
        .isIn(['draft', 'published', 'archived'])
        .withMessage('Status must be either draft, published, or archived'),
];
