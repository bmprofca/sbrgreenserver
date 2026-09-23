const { query } = require("../config/db");
const { asyncHandler, ok, fail } = require("../utils/helpers");

const listMessages = asyncHandler(async (_req, res) => {
  const rows = await query(
    "SELECT * FROM contact_messages ORDER BY created_at DESC, id DESC"
  );
  return ok(
    res,
    rows.map((row) => ({
      id: row.id,
      name: row.name,
      email: row.email,
      phone: row.phone,
      service: row.service,
      message: row.message,
      isRead: Boolean(row.is_read),
      createdAt: row.created_at,
    }))
  );
});

const markRead = asyncHandler(async (req, res) => {
  const existing = await query("SELECT id FROM contact_messages WHERE id = ? LIMIT 1", [
    req.params.id,
  ]);
  if (!existing.length) return fail(res, 404, "Message not found");

  await query("UPDATE contact_messages SET is_read = 1 WHERE id = ?", [req.params.id]);
  return ok(res, null, "Marked as read");
});

const removeMessage = asyncHandler(async (req, res) => {
  const existing = await query("SELECT id FROM contact_messages WHERE id = ? LIMIT 1", [
    req.params.id,
  ]);
  if (!existing.length) return fail(res, 404, "Message not found");
  await query("DELETE FROM contact_messages WHERE id = ?", [req.params.id]);
  return ok(res, null, "Message deleted");
});

const dashboardStats = asyncHandler(async (_req, res) => {
  const [projects, services, gallery, careers, unread, messages] = await Promise.all([
    query("SELECT COUNT(*) AS count FROM projects"),
    query("SELECT COUNT(*) AS count FROM services"),
    query("SELECT COUNT(*) AS count FROM gallery"),
    query("SELECT COUNT(*) AS count FROM careers WHERE is_active = 1"),
    query("SELECT COUNT(*) AS count FROM contact_messages WHERE is_read = 0"),
    query("SELECT COUNT(*) AS count FROM contact_messages"),
  ]);

  return ok(res, {
    projects: Number(projects[0].count),
    services: Number(services[0].count),
    gallery: Number(gallery[0].count),
    activeCareers: Number(careers[0].count),
    unreadMessages: Number(unread[0].count),
    totalMessages: Number(messages[0].count),
  });
});

module.exports = { listMessages, markRead, removeMessage, dashboardStats };
