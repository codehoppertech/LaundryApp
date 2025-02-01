const jwt = require("jsonwebtoken");

module.exports = (req, res, next) => {
  const token = req.headers["auth-token"];
  if (!token) return res.status(401).json({ message: "Access Denied" });

  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    res.status(401).json({ message: "Invalid Token" });
  }
};
