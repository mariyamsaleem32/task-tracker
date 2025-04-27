import express from "express";
import helmet from "helmet";
import {ENV} from './constant/index.js'
import connectToDB from "./db/index.js";
import user_routes from "./routes/user.js";
import task_routes from "./routes/task.js";
import cors from "cors";


//Connecting MongoDB
connectToDB();

const app = express();
app.use(cors());
app.use(helmet());
app.use(express.json());

app.use("/api",user_routes);
app.use("/api",task_routes);

app.listen(ENV.PORT, () => {
  console.log(`server is running on port ${ENV.PORT}`);
});

