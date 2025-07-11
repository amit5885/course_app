import jwt from "jsonwebtoken";
import { JWT_ADMIN_SECRET } from "../config.js";

function adminMiddleware(req, res, next) {
  const authHeader =
    req.headers["authorization"] || req.headers["Authorization"];

  if (!authHeader) {
    return res.status(403).json({
      message: "Authorization header missing",
    });
  }

  const token = authHeader.split(" ")[1];

  if (!token) {
    return res.status(403).json({
      message: "Token missing",
    });
  }

  try {
    const decoded = jwt.verify(token, JWT_ADMIN_SECRET); // Verify the token
    req.userId = decoded.id;
    next();
  } catch (err) {
    return res.status(403).json({
      message: "You are not signed in",
    });
  }
}

export default adminMiddleware;
