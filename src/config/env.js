const { loadEnv } = require("./loadEnv");

loadEnv();

module.exports = {
  port: process.env.PORT || 5000,
  nodeEnv: process.env.NODE_ENV || "development",
  db: {
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0,
    enableKeepAlive: true,
  },
  jwt: {
    secret: process.env.JWT_SECRET || "sbrgreen_dev_secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "7d",
  },
};
