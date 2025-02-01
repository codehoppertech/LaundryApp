const Session = require("../models/Session");

exports.createSession = async (userId, authToken) => {
  try {
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 1); // 1-hour expiry
    await Session.create({ userId, authToken, expiresAt });
  } catch (error) {
    console.error("Error creating session:", error);
  }
};

exports.invalidateSession = async (req, res) => {
  try {
    const { authToken } = req.headers;
    await Session.deleteOne({ authToken });
    res.json({ message: "Session invalidated successfully." });
  } catch (error) {
    res.status(500).json({ message: "Error invalidating session." });
  }
};
