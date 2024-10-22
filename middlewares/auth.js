const jwt = require("jsonwebtoken");

const auth = (req, res, next) => {
  try {
    jwbToken = req.headers.authorization.replace("Bearer ", "");

    const verifiedToken = jwt.verify(jwbToken, process.env.jwbTokenSalt);
    req.user = verifiedToken;
  } catch (e) {
    res.status(401).json({
      status: "failed",
      message: "Unauthorized!",
    });
    return;
  }
  next();
};

module.exports = auth;
