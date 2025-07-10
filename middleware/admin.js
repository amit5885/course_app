import jwt from "jsonwebtoken";
import { JWT_ADMIN_SECRET } from "../config.js";

function adminMiddleware(req, res, next) {
  const token = req.headers.token;

  try {
    const decoded = jwt.verify(token, JWT_ADMIN_SECRET);
    req.userId = decoded.id;
    next();
  } catch (err) {
    res.status(403).json({
      message: "You are not signed in",
    });
  }
}

export default adminMiddleware;
