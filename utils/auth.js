const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (authHeader) {
    const token = authHeader.split(" ")[1];
    if (token) {
      jwt.verify(token, "test", (err, user) => {
        if (err) return res.status(403).json("Invalid/Expired Token");
        req.user = user;
        next();
      });
    } else {
      return res.status(403).json("Authorization must be provide");
    }
  }
};

const verifyTokenUser = (req, res, next) => {
  verifyToken(req, res, () => {
    if (req.user.id === req.params.id) {
      next();
    } else {
      return res.status(403).json("You are not allowed");
    }
  });
};

module.exports = { verifyToken, verifyTokenUser };
