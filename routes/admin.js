import { adminModel, purchaseModel, courseModel } from "../db.js";
import bycrypt from "bcryptjs";
import { z } from "zod";
import jwt from "jsonwebtoken";
import { Router } from "express";
import dotenv from "dotenv";

dotenv.config();

const JWT_SECRET = process.env.JWT_ADMIN_SECRET;
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
      JWT_SECRET,
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
