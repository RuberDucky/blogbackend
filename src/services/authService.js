import jwt from 'jsonwebtoken';
import config from '../config/config.js';
import User from '../models/User.js';

class AuthService {
    // Generate JWT token
    generateToken(payload) {
        return jwt.sign(payload, config.JWT_SECRET, {
            expiresIn: config.JWT_EXPIRES_IN,
        });
    }

    // Verify JWT token
    verifyToken(token) {
        return jwt.verify(token, config.JWT_SECRET);
    }

    // Register new user
    async register(userData) {
        try {
            const { firstName, lastName, email, password } = userData;

            // Check if user already exists
            const existingUser = await User.findOne({ where: { email } });
            if (existingUser) {
                throw new Error('User with this email already exists');
            }

            // Create new user
            const user = await User.create({
                firstName,
                lastName,
                email,
                password,
            });

            // Generate token
            const token = this.generateToken({
                id: user.id,
                email: user.email,
                role: user.role,
            });

            return {
                user,
                token,
            };
        } catch (error) {
            throw error;
        }
    }

    // Login user
    async login(credentials) {
        try {
            const { email, password } = credentials;

            // Find user by email
            const user = await User.findOne({
                where: { email, isActive: true },
            });

            if (!user) {
                throw new Error('Invalid email or password');
            }

            // Check password
            const isPasswordValid = await user.comparePassword(password);
            if (!isPasswordValid) {
                throw new Error('Invalid email or password');
            }

            // Generate token
            const token = this.generateToken({
                id: user.id,
                email: user.email,
                role: user.role,
            });

            return {
                user,
                token,
            };
        } catch (error) {
            throw error;
        }
    }

    // Get user profile
    async getProfile(userId) {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error('User not found');
            }
            return user;
        } catch (error) {
            throw error;
        }
    }

    // Update user profile
    async updateProfile(userId, updateData) {
        try {
            const user = await User.findByPk(userId);
            if (!user) {
                throw new Error('User not found');
            }

            await user.update(updateData);
            return user;
        } catch (error) {
            throw error;
        }
    }
}

export default new AuthService();
