const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
require("dotenv").config();
const { SECRET_KEY } = process.env;
const User = require("../models/User");

router.post("/register", async (req, res) => {
  try {
    const { fullname, username, email, password } = req.body;
    let userFound = await User.findOne({ email, username });

    if (userFound) {
      return res.json({ msg: "User already exists!", status: 400 });
    }

    if (fullname.length < 3) {
      return res.json({
        msg: "Fullname must be at least 3 characters!",
        status: 400,
      });
    }

    if (username.length < 8 || password.length < 8) {
      let error = username.length < 8 ? "Username" : "Password";
      return res.json({
        msg: `${error} must be at least 8 characters!`,
        status: 400,
      });
    }

    let salt = bcrypt.genSaltSync(10);
    let hash = bcrypt.hashSync(password, salt);
    let user = new User({
      ...req.body,
      password: hash,
    });
    user.save();
    return res.json({ user, msg: "Registered Successfully" });
  } catch (e) {
    return res
      .status(400)
      .json({ error: e.message, msg: "Something Went Wrong...", status: 400 });
  }
});

router.post("/login", async (req, res) => {
  try {
    const { username, password } = req.body;
    let userFound = await User.findOne({ username });

    if (!userFound) {
      return res.json({ msg: "User does not exist!", status: 400 });
    }

    let isMatch = bcrypt.compareSync(password, userFound.password);
    if (!isMatch) {
      return res.json({ msg: "Invalid credentials!", status: 400 });
    }

    userFound = userFound.toObject();
    delete userFound.password;
    let token = jwt.sign({ data: userFound }, SECRET_KEY, { expiresIn: "24h" });
    return res.json({ msg: "Logged in successfully!", token, user: userFound });
  } catch (e) {
    return res
      .status(400)
      .json({ error: e.message, msg: "Something Went Wrong...", status: 400 });
  }
});

module.exports = router;
