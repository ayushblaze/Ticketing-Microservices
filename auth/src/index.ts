import express from "express";
import 'express-async-errors';
import { currentUserRouter } from "./routes/current-user";
import { signinRouter } from "./routes/signin";
import { signoutRouter } from "./routes/signout";
import { signupRouter } from "./routes/signup";
import { errorHandler } from "./middlewares/error-handler";
import { NotFoundError } from "./errors/not-found-error";

const app = express();
app.use(express.json());

app.use(currentUserRouter);
app.use(signinRouter);
app.use(signoutRouter);
app.use(signupRouter);

app.get('*', async (req, res) => {
  // next(new NotFoundError());
  throw new NotFoundError();
});

app.use(errorHandler);

app.listen(3000, () => {
  console.log("Auth Service Listening on Port: 3000 ✅");
});