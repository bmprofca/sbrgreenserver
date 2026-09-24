const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const env = require("./config/env");
const { initDatabase } = require("./config/initDb");
const routes = require("./routes");

const app = express();

app.use(
  cors({
    origin: true,
    credentials: true,
  })
);
app.use(express.json({ limit: "2mb" }));
app.use(express.urlencoded({ extended: true }));
app.use(morgan("dev"));

app.use("/api", routes);

app.use((err, _req, res, _next) => {
  console.error(err);
  res.status(500).json({
    success: false,
    message: err.message || "Internal server error",
  });
});

async function start() {
  try {
    await initDatabase();
    app.listen(env.port, "0.0.0.0", () => {
      console.log(
        `SBRGREEN API (${env.nodeEnv}) listening on http://localhost:${env.port}`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exit(1);
  }
}

start();
