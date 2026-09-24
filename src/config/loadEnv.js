const fs = require("fs");
const path = require("path");

function loadEnv() {
  const mode = process.env.NODE_ENV === "production" ? "production" : "development";
  const preferred = path.resolve(process.cwd(), `.env.${mode}`);
  const fallback = path.resolve(process.cwd(), ".env");
  const envPath = fs.existsSync(preferred) ? preferred : fallback;

  require("dotenv").config({ path: envPath });
  return { mode, envPath };
}

module.exports = { loadEnv };
