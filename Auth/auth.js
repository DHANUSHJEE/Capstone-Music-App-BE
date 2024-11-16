import jwt from 'jsonwebtoken';
import dotenv from 'dotenv';

dotenv.config();

const verifyToken = async (req, res, next) => {
    try {
        // Get the token from the Authorization header (Bearer token)
        const token = req.header('Authorization')?.replace('Bearer ', '');

        // If token is not present, return an error
        if (!token) {
            return res.status(401).json({ message: "Token is missing" });
        }

        // If token is present, verify it
        try {
            const decodedToken = jwt.verify(token, process.env.JWT_SECRET);

            // Attach the decoded token information (userId) to the request object
            req.userId = decodedToken.userId;

            next();
        } catch (error) {
            return res.status(401).json({ message: "Token is not valid" });
        }
    } catch (error) {
        return res.status(500).json({ message: "Internal Server Error in verifying token" });
    }
};

export default verifyToken;
