import { validationResult } from 'express-validator';
import authService from '../services/authService.js';

class AuthController {
    // Register new user
    async register(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation errors',
                    errors: errors.array(),
                });
            }

            const { user, token } = await authService.register(req.body);

            res.status(201).json({
                success: true,
                message: 'User registered successfully',
                data: {
                    user,
                    token,
                },
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Login user
    async login(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation errors',
                    errors: errors.array(),
                });
            }

            const { user, token } = await authService.login(req.body);

            res.status(200).json({
                success: true,
                message: 'Login successful',
                data: {
                    user,
                    token,
                },
            });
        } catch (error) {
            res.status(401).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Get user profile
    async getProfile(req, res) {
        try {
            const user = await authService.getProfile(req.user.id);

            res.status(200).json({
                success: true,
                message: 'Profile retrieved successfully',
                data: user,
            });
        } catch (error) {
            res.status(404).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Update user profile
    async updateProfile(req, res) {
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return res.status(400).json({
                    success: false,
                    message: 'Validation errors',
                    errors: errors.array(),
                });
            }

            const user = await authService.updateProfile(req.user.id, req.body);

            res.status(200).json({
                success: true,
                message: 'Profile updated successfully',
                data: user,
            });
        } catch (error) {
            res.status(400).json({
                success: false,
                message: error.message,
            });
        }
    }

    // Logout (client-side token removal)
    async logout(req, res) {
        res.status(200).json({
            success: true,
            message: 'Logout successful',
        });
    }
}

export default new AuthController();
