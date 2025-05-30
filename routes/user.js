import { userModel, purchaseModel, courseModel } from "../db.js";
import bycrypt from "bcryptjs";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { JWT_USER_SECRET } from "../config.js";
import userMiddleware from "../middleware/user.js";
import { Router } from "express";
import dotenv from "dotenv";

dotenv.config();

const userRouter = Router();

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

userRouter.post("/signup", async (req, res) => {
  try {
    const { email, password, firstName, lastName } = signupSchema.parse(
      req.body,
    );

    const hashedPassword = await bycrypt.hash(password, 10);

    await userModel.create({
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

userRouter.post("/signin", async (req, res) => {
  try {
    const { email, password } = signinSchema.parse(req.body);

    const user = await userModel.findOne({ email, password });

    if (!user) {
      return res.status(403).json({
        message: "Invalid email or password",
      });
    }

    const isPasswordValid = await bycrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return res.status(403).json({
        message: "Invalid email or password",
      });
    }

    // generate JWT Token
    const token = jwt.sign(
      {
        id: user._id,
      },
      JWT_USER_SECRET,
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

userRouter.get("/purchase", userMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;

    const purchases = await purchaseModel.find({ userId });

    const purchasedCourseIds = purchases.map((purchase) => purchase.courseId);

    const coursesData = await courseModel.find({
      _id: { $in: purchasedCourseIds },
    });

    res.json({
      purchases,
      coursesData,
    });
  } catch (error) {}
});

export default userRouter;
