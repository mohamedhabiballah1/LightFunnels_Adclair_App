const jwt = require('jsonwebtoken'); // Assuming you're using JWT for tokens

function authenticateToken(req, res, next) {
  const token = req.query.token || req.headers.authorization?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: No token provided' });
  }

  jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
    if (err) {
      return res.status(403).json({ error: 'Unauthorized: Invalid token' });
    }
    req.user = user;
    next();
  });
}
module.exports = authenticateToken;