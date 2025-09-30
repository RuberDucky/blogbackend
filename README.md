# Blog Backend API

A professional RESTful API for a blog application built with Node.js, Express, and PostgreSQL using Sequelize ORM.

## Features

-   🔐 **Authentication & Authorization**: JWT-based authentication with role-based access control
-   📝 **Blog Management**: Full CRUD operations for blog posts
-   👤 **User Management**: User registration, login, profile management
-   🔍 **Advanced Search**: Search blogs by title, content, tags, and categories
-   📊 **Analytics**: Blog statistics and metrics
-   🚀 **Performance**: Rate limiting, pagination, and optimized queries
-   🛡️ **Security**: Helmet, CORS, input validation, and sanitization
-   📱 **RESTful Design**: Clean and consistent API endpoints

## Tech Stack

-   **Runtime**: Node.js
-   **Framework**: Express.js
-   **Database**: PostgreSQL
-   **ORM**: Sequelize
-   **Authentication**: JWT (JSON Web Tokens)
-   **Validation**: Express Validator
-   **Security**: Helmet, CORS, Rate Limiting
-   **Password Hashing**: bcryptjs

## Project Structure

```
src/
├── config/           # Configuration files
│   ├── config.js     # App configuration
│   └── database.js   # Database connection
├── controllers/      # Route controllers
│   ├── authController.js
│   └── blogController.js
├── middlewares/      # Custom middlewares
│   ├── auth.js       # Authentication middleware
│   ├── errorHandler.js
│   ├── rateLimiter.js
│   └── validation.js
├── models/           # Sequelize models
│   ├── index.js
│   ├── User.js
│   └── Blog.js
├── routes/           # API routes
│   ├── index.js
│   ├── authRoutes.js
│   └── blogRoutes.js
├── services/         # Business logic
│   ├── authService.js
│   └── blogService.js
├── utils/            # Utility functions
│   └── database.js
└── index.js          # Main server file
```

## Setup Instructions

1. **Install Dependencies**

    ```bash
    npm install
    ```

2. **Environment Configuration**
   Create a `.env` file with the following variables:

    ```env
    PORT=5000
    NODE_ENV=development
    DB_NAME=blog
    DB_USER=postgres
    DB_PASSWORD=root
    DB_HOST=localhost
    DB_PORT=5432
    DB_DIALECT=postgres
    JWT_SECRET=your_super_secret_jwt_key_here
    JWT_EXPIRES_IN=7d
    FRONTEND_URL=http://localhost:3000
    ```

3. **Database Setup**

    - Install PostgreSQL
    - Create a database named `blog`
    - Update database credentials in `.env`

4. **Run the Application**

    ```bash
    # Development
    npm run dev

    # Production
    npm start
    ```

## API Endpoints

### Authentication

| Method | Endpoint             | Description         | Auth Required |
| ------ | -------------------- | ------------------- | ------------- |
| POST   | `/api/auth/register` | Register new user   | No            |
| POST   | `/api/auth/login`    | User login          | No            |
| GET    | `/api/auth/profile`  | Get user profile    | Yes           |
| PUT    | `/api/auth/profile`  | Update user profile | Yes           |
| POST   | `/api/auth/logout`   | User logout         | Yes           |

### Blog Posts

| Method | Endpoint                      | Description              | Auth Required |
| ------ | ----------------------------- | ------------------------ | ------------- |
| GET    | `/api/blogs`                  | Get all published blogs  | No            |
| GET    | `/api/blogs/:id`              | Get blog by ID           | No            |
| GET    | `/api/blogs/slug/:slug`       | Get blog by slug         | No            |
| GET    | `/api/blogs/author/:authorId` | Get blogs by author      | No            |
| GET    | `/api/blogs/my`               | Get current user's blogs | Yes           |
| POST   | `/api/blogs`                  | Create new blog          | Yes           |
| PUT    | `/api/blogs/:id`              | Update blog              | Yes (Owner)   |
| DELETE | `/api/blogs/:id`              | Delete blog              | Yes (Owner)   |
| POST   | `/api/blogs/:id/like`         | Like/Unlike blog         | No            |
| GET    | `/api/blogs/stats`            | Get general blog stats   | No            |
| GET    | `/api/blogs/my/stats`         | Get user's blog stats    | Yes           |

### Query Parameters

**Pagination & Filtering:**

-   `page`: Page number (default: 1)
-   `limit`: Items per page (default: 10, max: 100)
-   `sortBy`: Sort field (createdAt, updatedAt, title, views, likes, publishedAt)
-   `sortOrder`: Sort direction (ASC, DESC)
-   `status`: Filter by status (draft, published, archived)
-   `category`: Filter by category
-   `tags`: Filter by tags (comma-separated)
-   `search`: Search in title, content, excerpt

**Example:**

```
GET /api/blogs?page=1&limit=10&status=published&category=technology&sortBy=createdAt&sortOrder=DESC
```

## Request/Response Examples

### User Registration

```javascript
POST /api/auth/register
{
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "password": "SecurePass123"
}
```

### Create Blog Post

```javascript
POST / api / blogs;
Authorization: Bearer <
    token >
    {
        title: 'My First Blog Post',
        content: 'This is the content of my blog post...',
        excerpt: 'A brief summary',
        status: 'published',
        category: 'Technology',
        tags: ['nodejs', 'javascript', 'backend'],
        featuredImage: 'https://example.com/image.jpg',
    };
```

### Response Format

```javascript
{
  "success": true,
  "message": "Blog post created successfully",
  "data": {
    // Response data
  },
  "pagination": { // For paginated responses
    "currentPage": 1,
    "totalPages": 5,
    "totalItems": 50,
    "itemsPerPage": 10
  }
}
```

## Error Handling

All errors follow a consistent format:

```javascript
{
  "success": false,
  "message": "Error description",
  "errors": [ // For validation errors
    {
      "field": "email",
      "message": "Please provide a valid email address"
    }
  ]
}
```

## Security Features

-   **Rate Limiting**: Prevents abuse and DDoS attacks
-   **Input Validation**: Comprehensive validation using express-validator
-   **Password Hashing**: Secure password storage using bcrypt
-   **JWT Authentication**: Stateless authentication
-   **CORS Configuration**: Controlled cross-origin requests
-   **Helmet**: Security headers for protection against common vulnerabilities

## Development

```bash
# Install dependencies
npm install

# Run in development mode with nodemon
npm run dev

# Run in production mode
npm start
```

## Environment Variables

| Variable       | Description           | Default               |
| -------------- | --------------------- | --------------------- |
| PORT           | Server port           | 5000                  |
| NODE_ENV       | Environment mode      | development           |
| DB_NAME        | Database name         | 1234                  |
| DB_USER        | Database user         | adb                   |
| DB_PASSWORD    | Database password     | 1234                  |
| DB_HOST        | Database host         | localhost             |
| DB_PORT        | Database port         | 5432                  |
| JWT_SECRET     | JWT secret key        | -                     |
| JWT_EXPIRES_IN | JWT expiration        | 7d                    |
| FRONTEND_URL   | Frontend URL for CORS | http://localhost:3000 |

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the ISC License.
