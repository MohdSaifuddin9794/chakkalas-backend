import dotenv from "dotenv";
import express from "express";
import helmet from "helmet";
import cors from "cors";
import { createRequire } from "module";
const require = createRequire(import.meta.url);
const socket = require("socket.io");
import { mongoConnect } from "./config/db.js";
import http from "http";
import { SocketConnection } from "./socket/index.js";
import usersRouter from "./routes/users.js";
import GlobalErrorHandler from "./controller/errorController.js";
import AppError from "./util/appError.js";

dotenv.config();
const app = express();
const server = http.createServer(app);
const io = socket(server);
SocketConnection(io);
mongoConnect();
app.use(helmet());
app.use(
  cors({
    origin: ["http://localhost:3000"],
    credentials: true,
  })
);

app.use(express.urlencoded({ extended: false }));
app.use(express.json());
// app.use((req, res, next) => {
//   req.requetsTime = new Date().toISOString();
//   console.log(req.headers);
//   next();
// });
app.use("/api/users", usersRouter);

// Below all routes
app.all("*", (req, res, next) => {
  next(new AppError(`Can't find ${req.originalUrl} on this server!`, 404));
});
app.use(GlobalErrorHandler);
server.listen(process.env.PORT, () => {
  console.log(
    `server running in ${process.env.NODE_ENV} mode & listening on port ${process.env.PORT}`
  );
});
