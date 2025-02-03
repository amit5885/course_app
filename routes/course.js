import { Router } from "express";
const courseRouter = Router();

courseRouter.get("/courses", (req, res) => {
  res.send("List of courses");
});

courseRouter.get("/courses/purchase", (req, res) => {
  res.send("Purchased");
});

export default courseRouter;
