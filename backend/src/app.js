import express from "express";
import cookieParser from "cookie-parser";
import { authRouter } from "./routes/auth.routes.js";
import { bookRouter } from "./routes/book.routes.js";
import { reviewRouter } from "./routes/review.routes.js";
import { orderRouter } from "./routes/orders.routes.js";
import { paymentRouter } from "./routes/payment.routes.js";

const app = express();

app.use(express.json());
app.use(cookieParser());

app.use("/api/v1/auth", authRouter);
app.use("/api/v1/books", bookRouter);
app.use("/api/v1/review", reviewRouter);
app.use("/api/v1/orders", orderRouter);
app.use("/api/v1/payment", paymentRouter);

export default app;
