import dotenv from "dotenv";
import app from "./app.js";

// Load environment variables
dotenv.config();

const PORT = process.env.PORT || 5000;
const NODE_ENV = process.env.NODE_ENV || "development";

app.listen(PORT, () => {
  console.log(`=========================================`);
  console.log(` Eyara Essence Backend Server Running`);
  console.log(`-----------------------------------------`);
  console.log(` Port:    ${PORT}`);
  console.log(` Env:     ${NODE_ENV}`);
  console.log(` URL:     http://localhost:${PORT}/api`);
  console.log(`=========================================`);
});
