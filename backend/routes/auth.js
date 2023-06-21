const express = require("express");
const { check, validationResult } = require("express-validator");
const bcrypt = require("bcrypt");
var jwt = require("jsonwebtoken");
const User = require("../models/User");
const fetchUser = require("../middleware/fetchUser")
const router = express.Router();

const JWT_SECRET = "i@m@anke$h";

// ROUTE 1 : create a user using POST:'/api/auth/createuser - no login required
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
      const salt = await bcrypt.genSalt(saltRounds);
      const hash = await bcrypt.hash(secPass, salt);
      secPass = hash;
      // creating a new user
      user = await User.create({
        name: req.body.name,
        email: req.body.email,
        password: secPass,
      });

      console.log("user added successfully!");
      // providing the user an auth token as an acknowledgement
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ authToken });
      // res.json(user)
    } catch (error) {
      // handling errors (if any)
      console.log(error);
      res.status(500).send("Internal server error occurred");
    }
  }
);

// ROUTE 2 : Authenticate a user using POST:'/api/auth/login' - no login required
router.post(
  "/login",
  [
    check("email", "Enter valid email id").isEmail(),
    check("password", "Password can not be blank!").exists(),
  ],
  async (req, res) => {
    // if there are errors, return bad request and the errors
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { email, password } = req.body;
    try {
      // check if user with this email exists
      const user = await User.findOne({ email: email });
      if (!user) {
        return res
          .status(400)
          .json({ error: "please login with valid credentials!" });
      }

      // if user exists, match the password
      const passwordCompare = await bcrypt.compare(password, user.password);
      if (!passwordCompare) {
        return res
          .status(400)
          .json({ error: "please login with valid credentials!" });
      }

      // now if both email and password are correct, return authtoken as response
      console.log("login successful!")
      const data = {
        user: {
          id: user.id,
        },
      };
      const authToken = jwt.sign(data, JWT_SECRET);
      res.json({ authToken });
    } catch (error) {
      // handling errors (if any)
      console.log(error);
      res.status(500).send("Internal server error occurred");
    }
  }
);

// ROUTE 3 : Get user data using POST : api/auth/getuser - login required
router.post("/getuser", fetchUser, async (req, res) => {
  try {
    // req.user is fetched by the fetchUser middleware
    const userId = req.user.id;
    const user = await User.findById(userId).select("-password");
    res.json(user);

  } catch (error) {
    console.log(error);
    res.status(500).send("Internal server error occurred");
  }
});

module.exports = router;
