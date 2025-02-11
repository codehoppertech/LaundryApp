const User = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const config = require("../config/config");
const { sendEmail, generateVerificationEmail, generatePasswordResetEmail,getInviteUserDetails } = require("../utils/email");
const { successResponse, errorResponse } = require("../utils/response");

// Generate random code for verification/reset
const generateCode = () => 123456;

// Generate JWT token
const generateToken = (user) => jwt.sign({ userId: user._id, role: user.role }, config.jwtSecret, { expiresIn: "24h" });

// Create a User Account

exports.createAccount = async (req, res) => {
  try {
      const { email, name, phone, city, state } = req.body;
      const verificationCode = generateCode();
      // Check if user already exists
      const existingUser = await User.findOne({ email });
      if (existingUser) {
        if (existingUser.status === 'Guest') {
          existingUser.name = name || existingUser.name;
          existingUser.phone = phone || existingUser.phone;
          existingUser.city = city || existingUser.city;
          existingUser.state = state || existingUser.state;
          existingUser.verificationCode.code = verificationCode;
          existingUser.verificationCode.expiresAt = new Date(Date.now() + 30 * 60000);
          existingUser.status = 'Registered';
          await existingUser.save();
          return successResponse(res, 200, "User updated and registration complete. Status set to approved.");
        } else {
          // If user is already registered and not invited, return an error
          return errorResponse(res, 409, "User already registered. Please log in.");
        }
      }
      // Generate verification code
    
      if (!existingUser) {
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
    }
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
exports.profile = async (req, res) => {
  try {
    const {userId ,name, phone, city, state } = req.body;
    const existingUser = await User.findById(userId);
    if (existingUser) {
        existingUser.name = name || existingUser.name;
        existingUser.phone = phone || existingUser.phone;
        existingUser.city = city || existingUser.city;
        existingUser.state = state || existingUser.state;
        existingUser.status = 'Active';
        await existingUser.save();
        return successResponse(res, 200, "User profile updated.");
      } 
  } catch (error) {
    console.error("Create user error:", error);
    return errorResponse(res, 500, "Error creating user");
  }
};

exports.inviteUser = async (req, res) => {
  try {
    const { email, name, roles } = req.body; 
    const existingUser = await User.findOne({ email });

    if (existingUser) {
      existingUser.name = name || existingUser.name; 
      existingUser.role = roles || existingUser.role; 
      existingUser.status= 'Active';
      await existingUser.save();
      return successResponse(res, 200, "User status is 'Active' ,Updated the Role.");
    }
    const newUser = new User({
      email,
      name,
      role: roles, 
      status: 'Guest', 
    });
    await sendEmail(
      email,
      "Password Reset Code",
      getInviteUserDetails(roles)
    );
    await newUser.save();

    return successResponse(res, 201, "User invited successfully. Please complete registration.");
  } catch (error) {
    console.error("Invite user error:", error);
    return errorResponse(res, 500, "Error inviting user");
  }
};

// Validate Account
exports.validateAccount = async (req, res) => {
  try {
    const { email, code } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 404, "Email not found");
    }

    if (
      !user.verificationCode ||
      user.verificationCode.code !== code ||
      user.verificationCode.expiresAt < new Date()
    ) {
      return errorResponse(res, 401, "Invalid or expired verification code");
    }

    user.isVerified = true;
    user.status = 'verified';
    user.status='Verified';
    user.verificationCode = undefined;
    await user.save();

    const token = generateToken(user);

    return successResponse(res, 200, "Email verified successfully", { auth_token: token });
  } catch (error) {
    console.error("Validate account error:", error);
    return errorResponse(res, 500, "Error validating account");
  }
};

 exports.updatePassword = async (req, res) => {
  try {
    const token =  req.headers["auth-token"];
      const verified = jwt.verify(token, process.env.JWT_SECRET);
      req.user = verified;
      // Check if the user's role matches the required role
      console.log("req.user.role",req.user.role);
      console.log("req.user.userid",req.user.userId);
      const userId = req.user.userId;
      const { password } = req.body;
  

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
 exports.validateResetCode = async (req, res) => {
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

      const token = generateToken(user);

      return successResponse(res, 200, 'Code verified successfully', {
          auth_token: token
      });
  } catch (error) {
      console.error('Validate reset code error:', error);
      return errorResponse(res, 500, 'Error validating reset code');
  }
};
// Login User
exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 401, "Invalid email or password");
    }

    if (!user.isVerified) {
      return errorResponse(res, 403, "Account not verified");
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return errorResponse(res, 401, "Invalid email or password");
    }

    const token = generateToken(user);

    return successResponse(res, 200, "Login successful", { auth_token: token });
  } catch (error) {
    console.error("Login error:", error);
    return errorResponse(res, 500, "Error during login");
  }
};

// Forgot Password
exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return errorResponse(res, 404, "Email not found");
    }

    const resetCode = generateCode();
    user.passwordResetCode = {
      code: resetCode,
      expiresAt: new Date(Date.now() + 30 * 60000), // 30 minutes
    };
    await user.save();

    await sendEmail(
      email,
      "Password Reset Code",
      generatePasswordResetEmail(resetCode)
    );

    return successResponse(res, 200, "Password reset code sent to email");
  } catch (error) {
    console.error("Forgot password error:", error);
    return errorResponse(res, 500, "Error processing password reset");
  }
};


exports.getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    return successResponse(res, 200, "Users retrieved successfully", users);
  } catch (error) {
    console.error("Get all users error:", error);
    return errorResponse(res, 500, "Error fetching users");
  }
};


exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return errorResponse(res, 404, "User not found");
    }
    return successResponse(res, 200, "User retrieved successfully", user);
  } catch (error) {
    console.error("Get user by ID error:", error);
    return errorResponse(res, 500, "Error fetching user");
  }
};


exports.updateUser = async (req, res) => {
  try {
    const updates = req.body;

    const updatedUser = await User.findByIdAndUpdate(req.params.id, updates, {
      new: true,
    });

    if (!updatedUser) {
      return errorResponse(res, 404, "User not found");
    }

    return successResponse(res, 200, "User updated successfully", updatedUser);
  } catch (error) {
    console.error("Update user error:", error);
    return errorResponse(res, 500, "Error updating user");
  }
};

exports.deleteUser = async (req, res) => {
  try {
    const deletedUser = await User.findByIdAndDelete(req.params.userId);

    if (!deletedUser) {
      return errorResponse(res, 404, "User not found");
    }

    return successResponse(res, 200, "User deleted successfully");
  } catch (error) {
    console.error("Delete user error:", error);
    return errorResponse(res, 500, "Error deleting user");
  }
};
// Logout
exports.logout = async (req, res) => {
  try {
      // In a production environment, you might want to blacklist the token
      return successResponse(res, 200, 'Logout successful');
  } catch (error) {
      console.error('Logout error:', error);
      return errorResponse(res, 500, 'Error during logout');
  }
};

// Remove User
 exports.removeUser = async (req, res) => {
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
// Fetch User Profile Details
exports.fetchUserProfileDetails = async (req, res) => {
    try {
      const authToken =  req.headers["auth-token"];
      const verified = jwt.verify(authToken, process.env.JWT_SECRET);
      req.user = verified;
      const userid = req.user.userId;
      console.log("userid",userid);
      if (!authToken) {
        return res.status(401).json({
          status: 'error',
          code: 401,
          message: 'Invalid or expired auth-token.',
          errors: null,
        });
      }
  
      const user = await User.findById( userid );
  
      if (!user) {
        return res.status(404).json({
          status: 'error',
          code: 404,
          message: 'User not found.',
          errors: null,
        });
      }
  
      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Profile details fetched successfully.',
        data: {
          name: user.name,
          email: user.email,
          phone: user.phone,
          city: user.city,
          state: user.state,
          password_change_link: '/api/user/change-password',
        },
        errors: null,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        code: 500,
        message: 'Server error.',
        errors: error.message,
      });
    }
  };
  
  // Edit User Profile Details
  exports.editUserProfileDetails = async (req, res) => {
    try {
      const authToken =  req.headers["auth-token"];
      const verified = jwt.verify(authToken, process.env.JWT_SECRET);
      req.user = verified;
      const _id = req.user.userId;
      const { name, phone, city, state } = req.body;
  
      if (!authToken) {
        return res.status(401).json({
          status: 'error',
          code: 401,
          message: 'Invalid or expired auth-token.',
          errors: null,
        });
      }
  
      if (!name || !phone || !city || !state || !/^\+1-[0-9]{3}-[0-9]{3}-[0-9]{4}$/.test(phone)) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Missing or invalid parameters.',
          errors: null,
        });
      }
  
      const user = await User.findByIdAndUpdate(
        { _id },
        { name, phone, city, state },
        { new: true }
      );
  
      if (!user) {
        return res.status(403).json({
          status: 'error',
          code: 403,
          message: 'Unauthorized to update profile.',
          errors: null,
        });
      }
  
      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Profile details updated successfully.',
        data: {
          name: user.name,
          phone: user.phone,
          city: user.city,
          state: user.state,
        },
        errors: null,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        code: 500,
        message: 'Server error.',
        errors: error.message,
      });
    }
  };
  
  // Change Password
  exports.changePassword = async (req, res) => {
    try {
      const { current_password, new_password } = req.body;
      const authToken =  req.headers["auth-token"];
      const verified = jwt.verify(authToken, process.env.JWT_SECRET);
      req.user = verified;
      const _id = req.user.userId;
      if (!authToken) {
        return res.status(401).json({
          status: 'error',
          code: 401,
          message: 'Invalid or expired auth-token.',
          errors: null,
        });
      }
  
      if (!current_password || !new_password ) {
        return res.status(400).json({
          status: 'error',
          code: 400,
          message: 'Invalid password format.',
          errors: null,
        });
      }
  
      const user = await User.findById(_id);
       const isValidPassword = await bcrypt.compare(current_password, user.password);
  
      if (!user || !isValidPassword) {
        return res.status(401).json({
          status: 'error',
          code: 401,
          message: 'Incorrect current password.',
          errors: null,
        });
      }
  
      user.password = new_password;
      await user.save();
  
      res.status(200).json({
        status: 'success',
        code: 200,
        message: 'Password changed successfully.',
        data: null,
        errors: null,
      });
    } catch (error) {
      res.status(500).json({
        status: 'error',
        code: 500,
        message: 'Server error.',
        errors: error.message,
      });
    }
  };
  