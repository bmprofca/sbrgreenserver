const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { query } = require("../config/db");
const env = require("../config/env");
const { asyncHandler, ok, fail } = require("../utils/helpers");

const login = asyncHandler(async (req, res) => {
  const { username, password } = req.body || {};
  if (!username || !password) {
    return fail(res, 400, "Username and password are required");
  }

  const rows = await query("SELECT * FROM admin WHERE username = ? LIMIT 1", [username]);
  if (!rows.length) {
    return fail(res, 401, "Invalid credentials");
  }

  const admin = rows[0];
  const match = await bcrypt.compare(password, admin.password_hash);
  if (!match) {
    return fail(res, 401, "Invalid credentials");
  }

  const token = jwt.sign(
    { id: admin.id, username: admin.username },
    env.jwt.secret,
    { expiresIn: env.jwt.expiresIn }
  );

  return ok(res, { token, admin: { id: admin.id, username: admin.username } }, "Login successful");
});

const me = asyncHandler(async (req, res) => {
  return ok(res, { admin: req.admin });
});

module.exports = { login, me };
