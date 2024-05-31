const jwt = require('jsonwebtoken');
require('dotenv').config();

function auth(req, res, next) {
  // Get token from Authorization header
  const token = req.header('x-auth-token');

  // Check if not token
  if (!token) {
    return res.status(401).json({ msg: 'No token, authorization denied' });
  }

  // Check if token is in "Bearer <token>" format
  if (!token.startsWith('Bearer ')) {
    return res.status(401).json({ msg: 'Invalid token format' });
  }

  try {
    // Extract the token string (remove "Bearer ")
    const tokenString = token.split(' ')[1];

    // Verify token
    const decoded = jwt.verify(tokenString, process.env.JWT_SECRET);

    // If token is valid, add user information to the request
    req.user = decoded.user;
    next(); // Move to the next middleware or route handler
  } catch (err) {
    console.error(err);
    res.status(401).json({ msg: 'Token is not valid' });
  }
}

module.exports = auth;

// const jwt = require('jsonwebtoken');
// const mongoose = require('mongoose'); // Import mongoose
// require('dotenv').config();

// function auth(req, res, next) {
//     // 1. Get token from Authorization header
//     const token = req.header('x-auth-token');

//     // 2. Check if token is present
//     if (!token) {
//         return res.status(401).json({ msg: 'No token, authorization denied' });
//     }

//     // 3. Check if token is in "Bearer <token>" format
//     if (!token.startsWith('Bearer ')) {
//         return res.status(401).json({ msg: 'Invalid token format' });
//     }

//     try {
//         // 4. Extract the token string (remove "Bearer ")
//         const tokenString = token.split(' ')[1];

//         // 5. Verify token
//         const decoded = jwt.verify(tokenString, process.env.JWT_SECRET);

//         // 6. Check if the decoded user ID is a valid ObjectId, and convert it if not
//         if (!mongoose.Types.ObjectId.isValid(decoded.user.id)) {
//             return res.status(401).json({ msg: 'Invalid token - user ID not found' });
//         }

//         // 7. Set the user ID as an ObjectId in the request
//         req.user = { ...decoded.user, id: mongoose.Types.ObjectId(decoded.user.id) };
//         next();

//     } catch (err) {
//         // 8. Error Handling
//         console.error(err);

//         // Handle token expiration
//         if (err.name === 'TokenExpiredError') {
//             return res.status(401).json({ msg: 'Token has expired' });
//         }

//         // Handle other JWT errors
//         if (err.name === 'JsonWebTokenError') {
//             return res.status(401).json({ msg: 'Token is not valid' });
//         }
//         // Handle other unexpected errors
//         res.status(500).send('Server Error');
//     }
// }

// module.exports = auth;

