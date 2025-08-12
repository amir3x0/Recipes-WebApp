const jwt = require('jsonwebtoken');

// Middleware to verify token
const verifyToken = (req, res, next) => {
    // Get the token from the Authorization header
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1]; // Format: "Bearer TOKEN"

    if (token == null) {
        // If no token is provided, return an unauthorized status
        return res.sendStatus(401);
    }

    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if (err) {
            // If the token is not valid, return a forbidden status
            return res.sendStatus(403);
        }

        // If the token is verified, attach the user payload to the request object
        req.user = user;

        // Proceed to the next middleware function or route handler
        next();
    });
};

module.exports = verifyToken;
