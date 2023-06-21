const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require('bcrypt');
const User = require("../models/User");
const router = express.Router();

// sending post request for the end point - '/api/auth/createuser
router.post(
  "/createuser",
  [
    check("name", "Name length should be 5 to 20 characters").isLength({
      min: 5,
      max: 20,
    }),
    check("email", "Enter valid email id").isEmail(),
    check("password", "Password length should be minimum 5").isLength({
      min: 5,
    }),
  ],
  async (req, res) => {
    // if there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    try {
      // check if any user with same email id already exists
      let user = await User.findOne({ email: req.body.email });
      if (user) {
        return res
          .status(400)
          .json({ error: "User with this email id already exists!" });
      }
      
      // securing the password using hashing technique by bcrypt package
      let secPass = req.body.password;
      const saltRounds = 10;
      const salt = await bcrypt.genSalt(saltRounds)
      const hash = await bcrypt.hash(secPass, salt);
      secPass = hash
      // creating a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      console.log("user added successfully!");
      res.json(user);
    } catch (error) {
      // handling errors (if any)
      console.log(error);
      res.status(500).send("Some error occurred");
    }
  }
);

module.exports = router;
