const jwt = require("jsonwebtoken");

const jwtManager = (user) => {
  const jwbToken = jwt.sign(
    {
      id: user.id,
      name: user.name,
      email: user.email,
    },
    process.env.jwbTokenSalt
  );
  return jwbToken;
};
module.exports = jwtManager;
