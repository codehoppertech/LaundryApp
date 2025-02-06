const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");

console.log('Bcrypt version:', bcrypt.version);

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [
        /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/,
        "Please enter a valid email",
      ],
    },
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
      minlength: [2, "Name must be at least 2 characters long"],
      maxlength: [50, "Name cannot exceed 50 characters"],
    },
    phone: {
      type: String,
      trim: true,
      match: [/^\+?[\d\s-]{10,}$/, "Please enter a valid phone number"],
    },
    city: {
      type: String,
      trim: true,
    },
    state: {
      type: String,
      trim: true,
    },
    password: {
      type: String,
      required: false,
      minlength: [6, "Password must be at least 6 characters long"],
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verificationCode: {
      code: String,
      expiresAt: Date,
    },
    passwordResetCode: {
      code: String,
      expiresAt: Date,
    },
    status: {
      type: String,
      enum: ['Guest', 'Active','Verified','Registered','guest'], // Status of the user: 'guest' for invited, 'approved' for fully registered
      default: 'Guest', // Default to guest if user is invited
    },
    role: {
      type: Map,
      of: String, // Stores the locationId as key and role as value
    },
  },
  {
    timestamps: true,
  }
);

// Hash password before saving
userSchema.pre("save", async function (next) {
  if (this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});

// Compare password method
userSchema.methods.comparePassword = async function (candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

// Create indexes
userSchema.index({ email: 1 });
userSchema.index({ "verificationCode.expiresAt": 1 }, { expireAfterSeconds: 0 });
userSchema.index({ "passwordResetCode.expiresAt": 1 }, { expireAfterSeconds: 0 });

module.exports = mongoose.model("User", userSchema);
