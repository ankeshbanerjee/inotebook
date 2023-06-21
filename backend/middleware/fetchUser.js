const jwt = require("jsonwebtoken");

const JWT_SECRET = "i@m@anke$h";

// middleware to verify the authToken
const fetchUser = (req, res, next) => {
  // we will get the authtoken from req.header
  const token = req.header("auth-token");
  if (!token) {
    return res
      .status(401)
      .json({ error: "Please authenticate with a valid token!" });
  }
  try {
    const decoded_data = jwt.verify(token, JWT_SECRET); // decoded_data will be the object that was tied up with the authToken i.e., const data = {user: {id: user.id,},}; - while signing the jwt token
    // adding the user with the req
    req.user = decoded_data.user;
    next();
  } catch (error) {
    return res
      .status(401)
      .json({ error: "Please authenticate with a valid token!" });
  }
};

module.exports = fetchUser;
