const express = require("express");
const { login, me } = require("../controllers/authController");
const {
  getPublicSiteData,
  getSettings,
  updateSettings,
  createContactMessage,
} = require("../controllers/siteController");
const entities = require("../controllers/entities");
const {
  listMessages,
  markRead,
  removeMessage,
  dashboardStats,
} = require("../controllers/messagesController");
const { authRequired } = require("../middleware/auth");

function mountCrud(router, path, controller) {
  router.get(path, authRequired, controller.list);
  router.get(`${path}/:id`, authRequired, controller.getOne);
  router.post(path, authRequired, controller.create);
  router.put(`${path}/:id`, authRequired, controller.update);
  router.delete(`${path}/:id`, authRequired, controller.remove);
}

const router = express.Router();

router.get("/health", (_req, res) => {
  res.json({ success: true, message: "SBRGREEN API running" });
});

router.post("/auth/login", login);
router.get("/auth/me", authRequired, me);

router.get("/public/site", getPublicSiteData);
router.post("/public/contact", createContactMessage);

router.get("/admin/dashboard", authRequired, dashboardStats);
router.get("/admin/settings", authRequired, getSettings);
router.put("/admin/settings", authRequired, updateSettings);

router.get("/admin/messages", authRequired, listMessages);
router.patch("/admin/messages/:id/read", authRequired, markRead);
router.delete("/admin/messages/:id", authRequired, removeMessage);

mountCrud(router, "/admin/services", entities.services);
mountCrud(router, "/admin/projects", entities.projects);
mountCrud(router, "/admin/gallery", entities.gallery);
mountCrud(router, "/admin/testimonials", entities.testimonials);
mountCrud(router, "/admin/values", entities.values);
mountCrud(router, "/admin/milestones", entities.milestones);
mountCrud(router, "/admin/timeline", entities.timeline);
mountCrud(router, "/admin/process-steps", entities.processSteps);
mountCrud(router, "/admin/careers", entities.careers);

module.exports = router;
