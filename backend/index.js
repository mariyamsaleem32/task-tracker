import express from "express";
import connectToDB from "./db/db.js";
import userRoutes from "./routes/userRoutes.js"
import taskRoutes from "./routes/taskRoutes.js"
import cors from "cors";

const app = express();
app.use(express.json());

// call db
connectToDB();

app.use(
  cors({
    origin: [
      "http://localhost:5173",
      "http://localhost:5174",
    ],
    methods: ["GET", "PUT", "POST", "DELETE"],
    credentials: true,
    allowedHeaders: ["Content-Type", "Authorization", "userid"],
  })
);

app.use("/", (req, res, next) => {
  console.log("Request URL:", req.url, "method: ", req.method);
  next();
});

app.use("/auth", userRoutes)
app.use("/task", taskRoutes)

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server is Running on ${port}`);
});
