require("dotenv").config();

const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const env = require("./config/env");
const { initDatabase } = require("./config/initDb");
const routes = require("./routes");

const app = express();

app.use(
  cors({
    origin(origin, callback) {
      if (!origin || env.corsOrigins.includes(origin)) {
        return callback(null, true);
      }
      return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api", routes);

app.use((err, _req, res, _next) => {
  console.error(err);
  const status = err.message === "Not allowed by CORS" ? 403 : 500;
  res.status(status).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

async function start() {
  try {
    await initDatabase();
    app.listen(env.port, "0.0.0.0", () => {
      console.log(`SBRGREEN API listening on http://localhost:${env.port}`);
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

start();
