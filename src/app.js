import express from "express";
import dotenv from "dotenv";

//DOTENV config
dotenv.config();
//Create Express App

const app = express();
app.get("/", (req, res) => {
  res.send("Hello");
});
export default app;
