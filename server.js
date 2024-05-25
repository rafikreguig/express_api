import "dotenv/config";
import cors from "cors";
import errorHandler from "./middleware/errorHandler.js";
import router from "./routes/doctorsRouter.js";
import userRouter from "./routes/userRoutes.js";
import connectDB from "./config/db.js";
import corsOptions from "./config/corsOptions.js";
const port = process.env.PORT || 3500;

// creating express app
import express from "express";
const app = express();

// connecting to the MongoDB atlas
connectDB();

// middlewares
app.use(express.json());

// cors options
app.use(cors(corsOptions));

// using routes
app.use("/api/v1/", router);
app.use("/api/v1/auth", userRouter);

// error handling middleware
app.use(errorHandler);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
