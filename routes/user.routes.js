const express = require("express");
const router = express.Router();
const fs = require("fs");
const jwt = require("jsonwebtoken");

const UserModel = require("../models/user.model");

router.post("/user/login", async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await UserModel.findOne({ email, password });
    if (!user) {
      res.status(401).json({
        message: "Login not successful",
        error: "User not found",
      });
    } else {
      const token = jwt.sign({ id: user._id, role: user.role }, "test", {
        expiresIn: "1h",
      });
      return res.status(200).json({ token, user });
    }
  } catch (error) {
    res.status(400).json({
      message: "An error occurred",
      error: error.message,
    });
  }
});

module.exports = router;
