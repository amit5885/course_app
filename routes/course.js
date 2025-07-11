import { Router } from "express";
import userMiddleware from "../middleware/user.js";
import { courseModel, purchaseModel } from "../db.js";
import { z } from "zod";
const courseRouter = Router();

const purchaseSchema = z.object({
  userId: z.string(),
  courseId: z.string(),
});

courseRouter.post("/purchase", userMiddleware, async (req, res) => {
  try {
    const parsedData = purchaseSchema.parse({
      userId: req.userId,
      courseId: req.body.courseId,
    });

    await purchaseModel.create({
      userId: parsedData.userId,
      courseId: parsedData.courseId,
    });

    res.status(201).send("You have successfully purchased the course");
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

courseRouter.get("/preview", async (req, res) => {
  try {
    const courses = await courseModel.find({});
    res.status(200).json({
      message: "Courses fetched",
      courses,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      message: "Internal server error",
    });
  }
});

export default courseRouter;
