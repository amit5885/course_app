import { Router } from "express";
const adminRouter = Router();

adminRouter.post("/signup", (req, res) => {
  res.json({
    message: "Admin created",
  });
});

adminRouter.post("/signin", (req, res) => {
  res.json({
    message: "Admin signed in",
  });
});

adminRouter.post("/course", (req, res) => {
  res.json({
    message: "Course created",
  });
});

adminRouter.put("/course", (req, res) => {
  res.json({
    message: "Course updated",
  });
});

adminRouter.get("/course/bulk", (req, res) => {
  res.json({
    message: "Bulk course created",
  });
});

export default adminRouter;
