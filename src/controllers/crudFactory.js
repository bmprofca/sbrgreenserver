const { query } = require("../config/db");
const { asyncHandler, ok, fail } = require("../utils/helpers");

function createCrudController(config) {
  const {
    table,
    mapRow,
    validateCreate,
    toInsert,
    toUpdate,
    orderBy = "sort_order ASC, id ASC",
  } = config;

  const list = asyncHandler(async (req, res) => {
    const includeInactive = req.query.all === "1" || req.admin;
    const sql = includeInactive
      ? `SELECT * FROM ${table} ORDER BY ${orderBy}`
      : `SELECT * FROM ${table} WHERE is_active = 1 ORDER BY ${orderBy}`;
    const rows = await query(sql);
    return ok(res, rows.map(mapRow));
  });

  const getOne = asyncHandler(async (req, res) => {
    const rows = await query(`SELECT * FROM ${table} WHERE id = ? LIMIT 1`, [req.params.id]);
    if (!rows.length) return fail(res, 404, "Record not found");
    return ok(res, mapRow(rows[0]));
  });

  const create = asyncHandler(async (req, res) => {
    const error = validateCreate(req.body || {});
    if (error) return fail(res, 400, error);

    const { columns, values } = toInsert(req.body || {});
    const placeholders = columns.map(() => "?").join(", ");
    const result = await query(
      `INSERT INTO ${table} (${columns.join(", ")}) VALUES (${placeholders})`,
      values
    );
    const rows = await query(`SELECT * FROM ${table} WHERE id = ? LIMIT 1`, [result.insertId]);
    return ok(res, mapRow(rows[0]), "Created successfully");
  });

  const update = asyncHandler(async (req, res) => {
    const existing = await query(`SELECT * FROM ${table} WHERE id = ? LIMIT 1`, [req.params.id]);
    if (!existing.length) return fail(res, 404, "Record not found");

    const error = validateCreate(req.body || {}, true);
    if (error) return fail(res, 400, error);

    const { assignments, values } = toUpdate(req.body || {});
    if (!assignments.length) return fail(res, 400, "No fields to update");

    await query(
      `UPDATE ${table} SET ${assignments.join(", ")} WHERE id = ?`,
      [...values, req.params.id]
    );
    const rows = await query(`SELECT * FROM ${table} WHERE id = ? LIMIT 1`, [req.params.id]);
    return ok(res, mapRow(rows[0]), "Updated successfully");
  });

  const remove = asyncHandler(async (req, res) => {
    const existing = await query(`SELECT id FROM ${table} WHERE id = ? LIMIT 1`, [req.params.id]);
    if (!existing.length) return fail(res, 404, "Record not found");
    await query(`DELETE FROM ${table} WHERE id = ?`, [req.params.id]);
    return ok(res, null, "Deleted successfully");
  });

  return { list, getOne, create, update, remove };
}

module.exports = { createCrudController };
