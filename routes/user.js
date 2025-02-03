import { Router } from "express";
const userRouter = Router();

userRouter.post("/user/login", (req, res) => {
  const token = jwt.sign({ name: "Amit" }, "secret");
  res.send(token);
});

userRouter.post("/user/signup", (req, res) => {
  res.send("User created");
});

userRouter.get("/user/purchase", (req, res) => {
  res.send("Purchased");
});

export default userRouter;
