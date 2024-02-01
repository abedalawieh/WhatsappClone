import app from "./app.js";
import dotenv from "dotenv";

//DOTENV config
dotenv.config();

//env variables
const PORT = process.env.PORT;

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
