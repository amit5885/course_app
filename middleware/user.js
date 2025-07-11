import jwt from "jsonwebtoken";
import { JWT_USER_SECRET } from "../config.js";

function userMiddleware(req, res, next) {
  try {
    const authHeader =
      req.headers["authorization"] || req.headers["Authorization"];

    if (!authHeader) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const token = authHeader.split(" ")[1];

    if (!token) {
      return res.status(401).json({ message: "Unauthorized" });
    }

    const decoded = jwt.verify(token, JWT_USER_SECRET);

    req.userId = decoded.id;
    next();
  } catch (error) {
    console.error(error);
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
}

export default userMiddleware;
