// middleware/auth.js
const jwt = require ("jsonwebtoken");
const { prisma } = require("../config");

const createAuthMiddleware = (role = null) => {
    return async (req, res, next) => {
        const authHeader = req.headers["authorization"];
        if (!authHeader) {
            return res.status(401).json({ error: "Authorization header missing" });
        }

        const token = authHeader.split(" ")[1];
        if (!token) {
            return res.status(401).json({ error: "Token missing" });
        }

        try {
            const jwtSecret = process.env.JWT_SECRET || "change_me_in_env";
            const decoded = jwt.verify(token, jwtSecret);

            const user = await prisma.user.findUnique({
                where: { id: decoded.userId },
            });

            if (!user) {
                return res.status(401).json({ error: "User not authorized" });
            }

            // If a role is required, check it
            if (role && user.role !== role) {
                return res.status(403).json({ error: "Forbidden: insufficient role" });
            }

            req.user = user;
            next();
        } catch (err) {
            console.error("JWT Error:", err.message);
            return res.status(403).json({ error: "Invalid or expired token" });
        }
    };
};

// Export middlewares
const userAuthMiddleware = createAuthMiddleware("USER");  // USER only
const adminAuthMiddleware = createAuthMiddleware("ADMIN"); // ADMIN only
const manufacturerAuthMiddleware = createAuthMiddleware("MANUFACTURER"); // MANUFACTURER only

module.exports = {
  userAuthMiddleware,
  adminAuthMiddleware,
  manufacturerAuthMiddleware,
};