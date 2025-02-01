const User = require("../models/User");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

exports.createUser = async (req, res) => {
  try {
    const { email, name, phone, city, state, password } = req.body;
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(409).json({ message: "Email already registered." });

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = new User({ email, name, phone, city, state, passwordHash: hashedPassword });
    await user.save();

    res.status(201).json({ message: "Account created successfully. Verification code sent to email." });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(401).json({ message: "Incorrect email or password." });

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) return res.status(401).json({ message: "Incorrect email or password." });

    const authToken = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });

    res.json({ authToken });
  } catch (error) {
    res.status(500).json({ message: "Internal Server Error" });
  }
};

exports.logoutUser = (req, res) => {
  res.json({ message: "Logout successful." });
};
