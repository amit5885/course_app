import { adminModel, courseModel } from "../db.js";
import bycrypt from "bcryptjs";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { JWT_ADMIN_SECRET } from "../config.js";
import { Router } from "express";
import dotenv from "dotenv";
import adminMiddleware from "../middleware/admin.js";

dotenv.config();

const adminRouter = Router();

//Zod schema for User signup validation
const signupSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
  firstName: z.string(),
  lastName: z.string(),
});

//Zod schema for User signin validation
const signinSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8),
});

const courseSchema = z.object({
  title: z.string(),
  description: z.string(),
  price: z.number(),
  imageUrl: z.string(),
});

adminRouter.post("/signup", async (req, res) => {
  try {
    const { email, password, firstName, lastName } = signupSchema.parse(
      req.body,
    );

    const hashedPassword = await bycrypt.hash(password, 10);

    await adminModel.create({
      email,
      password: hashedPassword,
      firstName,
      lastName,
    });

    res.json(
      {
        message: "Signup success",
      },
      {
        status: 201,
      },
    );
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.json(
        {
          message: "Validation failed",
          error: error.errors,
        },
        {
          status: 400,
        },
      );
    } else {
      console.log(error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
});

adminRouter.post("/signin", async (req, res) => {
  try {
    const { email, password } = signinSchema.parse(req.body);

    const admin = await adminModel.findOne({ email, password });

    if (!admin) {
      return res.status(403).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bycrypt.compare(password, admin.password);

    if (!isPasswordValid) {
      return res.status(403).json({
        message: "Invalid email or password",
      });
    }

    // generate JWT Token
    const token = jwt.sign(
      {
        id: admin._id,
      },
      JWT_ADMIN_SECRET,
      { expiresIn: "1d" },
    );

    // Set Token as cookie
    res.cookie("token", token, {
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000, // 1 day
    });

    res.json({
      message: "Signin success",
      token,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation failed",
        error: error.errors,
      });
    } else {
      console.log(error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
});

adminRouter.post("/course", adminMiddleware, async (req, res) => {
  try {
    const adminId = req.userId;
    const { title, description, imageUrl, price } = courseSchema.parse(
      req.body,
    );

    const course = await courseModel.create({
      title,
      description,
      imageUrl,
      price,
      creatorId: adminId,
    });

    res.json({
      message: "Course created",
      courseId: course._id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation failed",
        error: error.errors,
      });
    } else {
      console.log(error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
});

adminRouter.put("/course", adminMiddleware, async (req, res) => {
  try {
    const adminId = req.userId;

    const { title, description, imageUrl, price, courseId } =
      courseSchema.parse(req.body);

    // const course = await courseModel.findOne({
    //   _id: courseId,
    //   creatorId: adminId,
    // });

    // if (!course) {
    //   return res.status(403).json({
    //     message: "You are not authorized to update this course",
    //   });
    // }

    const course = await courseModel.updateOne(
      {
        _id: courseId,
        creatorId: adminId,
      },
      {
        $set: {
          title,
          description,
          imageUrl,
          price,
        },
      },
    );

    res.json({
      message: "Course updated",
      courseId: course._id,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation failed",
        error: error.errors,
      });
    } else {
      console.log(error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
});

adminRouter.get("/course/bulk", adminMiddleware, async (req, res) => {
  try {
    const adminId = req.userId;
    const courses = await courseModel.find({
      creatorId: adminId,
    });
    res.json({
      message: "Courses fetched",
      courses,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      res.status(400).json({
        message: "Validation failed",
        error: error.errors,
      });
    } else {
      console.log(error);
      res.status(500).json({
        message: "Internal server error",
      });
    }
  }
});

export default adminRouter;
