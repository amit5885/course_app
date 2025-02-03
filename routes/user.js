import { Router } from "express";
const userRouter = Router();

userRouter.post("/login", (req, res) => {
  const token = jwt.sign({ name: "Amit" }, "secret");
  res.send(token);
});

userRouter.post("/signup", (req, res) => {
  res.send("User created");
});

userRouter.get("/purchase", (req, res) => {
  res.send("Purchased");
});

export default userRouter;
