const User = require('../models/user.model');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const config = require('../config/config');
const { sendEmail, generateVerificationEmail, generatePasswordResetEmail } = require('../utils/email');
const { successResponse, errorResponse } = require('../utils/response');

// Generate random code for verification/reset
const generateCode = () => {
    return crypto.randomBytes(3).toString('hex').toUpperCase();
};

// Generate JWT token
const generateToken = (userId) => {
    return jwt.sign({ userId }, config.jwtSecret, { expiresIn: '24h' });
};

// Create Account
const createAccount = async (req, res) => {
    try {
        const { email, name, phone, city, state } = req.body;

        // Check if user already exists
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return errorResponse(res, 409, 'Email already registered');
        }

        // Generate verification code
        const verificationCode = generateCode();
        
        // Create new user
        const user = new User({
            email,
            name,
            phone,
            city,
            state,
            verificationCode: {
                code: verificationCode,
                expiresAt: new Date(Date.now() + 30 * 60000) // 30 minutes
            }
        });

        await user.save();

        // Send verification email
        await sendEmail(
            email,
            'Verify Your Email',
            generateVerificationEmail(verificationCode)
        );

        return successResponse(res, 201, 'Account created successfully. Verification code sent to email.', {
            code_sent: true
        });
    } catch (error) {
        console.error('Create account error:', error);
        return errorResponse(res, 500, 'Error creating account');
    }
};

// Validate Account
const validateAccount = async (req, res) => {
    try {
        const { email, code } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return errorResponse(res, 404, 'Email not found');
        }

        if (!user.verificationCode || 
            user.verificationCode.code !== code || 
            user.verificationCode.expiresAt < new Date()) {
            return errorResponse(res, 401, 'Invalid or expired verification code');
        }

        user.isVerified = true;
        user.verificationCode = undefined;
        await user.save();

        const token = generateToken(user._id);

        return successResponse(res, 200, 'Email verified successfully', {
            auth_token: token
        });
    } catch (error) {
        console.error('Validate account error:', error);
        return errorResponse(res, 500, 'Error validating account');
    }
};

// Update Password
const updatePassword = async (req, res) => {
    try {
        const { password } = req.body;
        const userId = req.user.userId;

        const user = await User.findById(userId);
        if (!user) {
            return errorResponse(res, 404, 'User not found');
        }

        user.password = password;
        await user.save();

        return successResponse(res, 200, 'Password updated successfully');
    } catch (error) {
        console.error('Update password error:', error);
        return errorResponse(res, 500, 'Error updating password');
    }
};

// Login
const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return errorResponse(res, 401, 'Invalid email or password');
        }

        if (!user.isVerified) {
            return errorResponse(res, 403, 'Account not verified');
        }

        if (!user.password) {
            return errorResponse(res, 400, 'Password not set');
        }

        const isValidPassword = await user.comparePassword(password);
        if (!isValidPassword) {
            return errorResponse(res, 401, 'Invalid email or password');
        }

        const token = generateToken(user._id);

        return successResponse(res, 200, 'Login successful', {
            auth_token: token
        });
    } catch (error) {
        console.error('Login error:', error);
        return errorResponse(res, 500, 'Error during login');
    }
};

// Forgot Password
const forgotPassword = async (req, res) => {
    try {
        const { email } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return errorResponse(res, 404, 'Email not found');
        }

        const resetCode = generateCode();
        user.passwordResetCode = {
            code: resetCode,
            expiresAt: new Date(Date.now() + 30 * 60000) // 30 minutes
        };
        await user.save();

        await sendEmail(
            email,
            'Password Reset Code',
            generatePasswordResetEmail(resetCode)
        );

        return successResponse(res, 200, 'Password reset code sent to email', {
            code_sent: true
        });
    } catch (error) {
        console.error('Forgot password error:', error);
        return errorResponse(res, 500, 'Error processing password reset');
    }
};

// Validate Reset Code
const validateResetCode = async (req, res) => {
    try {
        const { email, code } = req.body;

        const user = await User.findOne({ email });
        if (!user) {
            return errorResponse(res, 404, 'Email not found');
        }

        if (!user.passwordResetCode || 
            user.passwordResetCode.code !== code || 
            user.passwordResetCode.expiresAt < new Date()) {
            return errorResponse(res, 401, 'Invalid or expired reset code');
        }

        const token = generateToken(user._id);

        return successResponse(res, 200, 'Code verified successfully', {
            auth_token: token
        });
    } catch (error) {
        console.error('Validate reset code error:', error);
        return errorResponse(res, 500, 'Error validating reset code');
    }
};

// Logout
const logout = async (req, res) => {
    try {
        // In a production environment, you might want to blacklist the token
        return successResponse(res, 200, 'Logout successful');
    } catch (error) {
        console.error('Logout error:', error);
        return errorResponse(res, 500, 'Error during logout');
    }
};

// Remove User
const removeUser = async (req, res) => {
    try {
        const { email } = req.body;
        
        const user = await User.findOneAndDelete({ email });
        if (!user) {
            return errorResponse(res, 404, 'User not found');
        }

        return successResponse(res, 200, 'User account removed successfully');
    } catch (error) {
        console.error('Remove user error:', error);
        return errorResponse(res, 500, 'Error removing user');
    }
};

module.exports = {
    createAccount,
    validateAccount,
    updatePassword,
    login,
    forgotPassword,
    validateResetCode,
    logout,
    removeUser
};