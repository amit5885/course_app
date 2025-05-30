import jwt from "jsonwebtoken";
import { JWT_USER_SECRET } from "../config.js";

function userMiddleware(req, res, next) {
  const token = req.header.token;
  const decoded = jwt.verify(token, JWT_USER_SECRET);

  if (decoded) {
    req.userId = decoded.id;
    next();
  } else {
    return res.status(401).json({
      message: "Unauthorized",
    });
  }
}

export default userMiddleware;
