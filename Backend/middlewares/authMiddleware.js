const jwt = require('jsonwebtoken');
const ROLES = { ADMIN: "Admin", USER: "User " };

function verifyToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    console.log('Received token:', token);
    if (!token) {
        return res.status(403).json({ error: "Token required" });
    }

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        console.log("✅ Decoded token:", decoded);
        req.user = decoded;
        next();
    } catch (err) {
        console.error("Token error:", err.message);
        return res.status(401).json({ error: "Invalid token" });
    }
}

const verifyAdmin = (req, res, next) => {
    console.log("👤 User in verifyAdmin:", req.user);
    if (!req.user) {
        return res.status(403).json({ error: "Authentication required" });
    }
    if (req.user.role !== ROLES.ADMIN) {
        return res.status(403).json({ error: "Admin access required" });
    }
    next();
};

module.exports = { verifyToken, verifyAdmin };
