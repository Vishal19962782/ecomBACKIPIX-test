const express = require("express");
const router = express.Router();
const User = require("../Model/UserModel");
const jwt = require("jsonwebtoken");
const {verify}=require("../JWT middleware/JWTauth");
router.post("/signUp", async (req, res) => {
  const { username, password, confirmPassword } = req.body;
  console.log(req.body);
  try {
    if (password !== confirmPassword)
      throw new Error("Password and Confirm Password does not match");
    //add user to db
    const user = new User({
      username,
      password,
      cart: [],
    });
    await user.save();
  } catch (err) {
    console.log(err);
    res.status(400).json({ message: err.message });
  }
});
router.post("/login", async (req, res) => {
  const { username, password, confirmPassword } = req.body;
  try {
    const user = await User.findOne({ username: username });
    if (!user) throw new Error("User not found");
    if (password !== user.password) throw new Error("Password is incorrect");
    const token = jwt.sign({ id: user._id }, "secretkey");
    res.json({ message: "Login Successful", token: token });
  } catch (err) {
    res.status(400).send(err);
  }
});

module.exports = router;
