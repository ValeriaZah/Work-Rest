const jwt = require('jsonwebtoken');
const { users } = require('./DataStore');

exports.protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = users.find(user => user.id === decoded.userId);
      if (!req.user) throw new Error();
      next();
    } catch (error) {
      return res.status(401).send("Not authorized");
    }
  } else {
    return res.status(401).send("No token provided");
  }
};
