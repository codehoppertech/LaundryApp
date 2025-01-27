const mongoose = require('mongoose');

const accountSchema = new mongoose.Schema(
  {
    name: { type: String, required: true, trim: true },
    email: { 
      type: String, 
      required: true, 
      unique: true, 
      lowercase: true, // Ensures the email is stored in lowercase
      trim: true,  // Ensures no leading/trailing spaces
      match: [/^\S+@\S+\.\S+$/, 'Please enter a valid email address'], // Simple email validation regex
    },
    password: { type: String, required: true },
    role: { 
      type: String, 
      enum: ['admin', 'staff', 'technician'], 
      required: true 
    },
    business_id: { 
      type: mongoose.Schema.Types.ObjectId, 
      ref: 'Business', 
      required: true 
    },
  },
  {
    timestamps: true,  // Automatically adds createdAt and updatedAt
    collection: 'users',  // Collection name remains the same as 'users'
  }
);

// Index to enforce unique email field
accountSchema.index({ email: 1 }, { unique: true, sparse: true });

// Account Model
const Account = mongoose.model('Account', accountSchema);

module.exports = Account;
