const jwt = require("jsonwebtoken");

const logon = (req, res) => {
  const { name, password } = req.body;

  if (!name || !password) {
    return res.status(400).json({ message: "name and password required" });
  }

  const token = jwt.sign({ name }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_LIFETIME || "24h",
  });

  res.status(200).json({ token });
};

const hello = (req, res) => {
  res.status(200).json({
    message: `Hello, ${req.user.name}!`,
  });
};

module.exports = { logon, hello };
