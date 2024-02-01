import app from "./app.js";
import logger from "./config/logger.config.js";
//env variables
const PORT = process.env.PORT;
app.listen(PORT, () => {
  logger.info(`Server Listening on port ${PORT}`);
});
