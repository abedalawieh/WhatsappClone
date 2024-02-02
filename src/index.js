import app from "./app.js";
import mongoose from "mongoose";
import logger from "./config/logger.config.js";
//env variables
const { DATABASE_URL } = process.env;
const PORT = process.env.PORT;

//exit on mongodb error
mongoose.connection.on("error", (err) => {
  logger.error(`MongoDb connection error :${err} `);
  process.exit(1);
});
//mongodb debug mode
if (process.env.NODE_ENV !== "production") {
  mongoose.set("debug", true);
}
//mongodb connection
mongoose
  .connect(DATABASE_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    logger.info("MongoDb Connected");
  })
  .catch((e) => {
    logger.error("Connected To MongoDb", e.message);
  });
let server = app.listen(PORT, () => {
  logger.info(`Server Listening on port ${PORT}`);
});

//handle server error
const exitHandler = () => {
  if (server) {
    logger.info("server closed.");
    process.exit(1);
  } else {
    process.exit(1);
  }
};
const unexpectedErrorHnadler = (error) => {
  logger.error(error);
  exitHandler();
};
process.on("uncaughtException", unexpectedErrorHnadler);
process.on("unhandledRejection", unexpectedErrorHnadler);

//SIGTERM
process.on("SIGTERM", () => {
  if (server) {
    logger.info("server closed.");
    process.exit(1);
  }
});
