import express from "express";
import mongoose from "mongoose";
import "dotenv/config";

import { connectDB } from "./db.js";
import userRouter from "./routes/user.js";
import courseRouter from "./routes/course.js";
import adminRouter from "./routes/admin.js";

const app = express();
app.use(express.json());

app.use("/api/v1/user", userRouter);
app.use("/api/v1/admin", adminRouter);
app.use("/api/v1/course", courseRouter);

// Start Server
async function startServer() {
  await connectDB(); // Ensure DB connection before starting the server

  const server = app.listen(3000, () => {
    console.log("Server is running on port 3000");
  });

  // Graceful shutdown
  process.on("SIGINT", async () => {
    console.log("\nGracefully shutting down...");
    await mongoose.connection.close();
    server.close(() => {
      console.log("Server closed");
      process.exit(0);
    });
  });
}

startServer();
