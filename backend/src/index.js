import dotenv from "dotenv";
import connectDB from "./db/index.js";
import app from "./app.js";

dotenv.config({
  path: "./.env",
});

const port = process.env.PORTS || 8000;

connectDB()
  .then(() => {
    app.listen(port, () => {
      console.log(`✅ app listening on port http://localhost:${port}`);
    });
  })
  .catch((err) => {
    console.error("❌ MongoDB connection error", err);
    process.exit(1);
  });
