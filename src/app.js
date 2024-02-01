import express, { json } from "express";
import dotenv from "dotenv";
import morgan from "morgan";
import helmet from "helmet";
import mongoSanitize from "express-mongo-sanitize";
import cookieParser from "cookie-parser";
import compression from "compression";
import cors from "cors";

import fileUpload from "express-fileupload";

//DOTENV config
dotenv.config();

//Create Express App

const app = express();
//morgan
if (process.env.NODE_ENV !== "production") {
  app.use(morgan("dev"));
}
//helmet
app.use(helmet());
//parse json body
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
//sanitize request data
app.use(mongoSanitize());
//enable cookie parser
app.use(cookieParser());
//gzip compression
app.use(compression());
//file upload
app.use(fileUpload({ useTempFiles: true }));
//cors
app.use(cors({ origin: "http://localhost:3000" }));
app.post("/test", (req, res) => {
  res.send(req.body);
});
export default app;
