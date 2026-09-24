const { query } = require("../config/db");
const { asyncHandler, ok, fail } = require("../utils/helpers");

function mapSettings(row) {
  if (!row) return null;
  return {
    id: row.id,
    companyName: row.company_name,
    shortName: row.short_name,
    tagline: row.tagline,
    phone: row.phone,
    email: row.email,
    address: row.address,
    hours: row.hours,
    heroImage: row.hero_image,
    aboutImage: row.about_image,
    ctaImage: row.cta_image,
    aboutStory1: row.about_story_1,
    aboutStory2: row.about_story_2,
    careersIntro: row.careers_intro,
    whatsappNumber: row.whatsapp_number || "",
    updatedAt: row.updated_at,
  };
}

const getPublicSiteData = asyncHandler(async (_req, res) => {
  const [
    settingsRows,
    services,
    projects,
    gallery,
    testimonials,
    values,
    milestones,
    timeline,
    processSteps,
    careers,
    founders,
  ] = await Promise.all([
    query("SELECT * FROM site_settings WHERE id = 1 LIMIT 1"),
    query("SELECT * FROM services WHERE is_active = 1 ORDER BY sort_order ASC, id ASC"),
    query("SELECT * FROM projects WHERE is_active = 1 ORDER BY sort_order ASC, id ASC"),
    query("SELECT * FROM gallery WHERE is_active = 1 ORDER BY sort_order ASC, id ASC"),
    query("SELECT * FROM testimonials WHERE is_active = 1 ORDER BY sort_order ASC, id ASC"),
    query("SELECT * FROM company_values WHERE is_active = 1 ORDER BY sort_order ASC, id ASC"),
    query("SELECT * FROM milestones WHERE is_active = 1 ORDER BY sort_order ASC, id ASC"),
    query("SELECT * FROM timeline WHERE is_active = 1 ORDER BY sort_order ASC, id ASC"),
    query("SELECT * FROM process_steps WHERE is_active = 1 ORDER BY sort_order ASC, id ASC"),
    query("SELECT * FROM careers WHERE is_active = 1 ORDER BY sort_order ASC, id ASC"),
    query("SELECT * FROM founders WHERE is_active = 1 ORDER BY sort_order ASC, id ASC"),
  ]);

  return ok(res, {
    settings: mapSettings(settingsRows[0]),
    services: services.map((s) => ({
      id: s.id,
      slug: s.slug,
      title: s.title,
      summary: s.summary,
      details: s.details,
      sortOrder: s.sort_order,
    })),
    projects: projects.map((p) => ({
      id: p.id,
      title: p.title,
      category: p.category,
      location: p.location,
      year: p.year,
      status: p.status,
      image: p.image,
      description: p.description,
      sortOrder: p.sort_order,
    })),
    gallery: gallery.map((g) => ({
      id: g.id,
      src: g.image_url,
      alt: g.alt_text,
      caption: g.caption,
      sortOrder: g.sort_order,
    })),
    testimonials: testimonials.map((t) => ({
      id: t.id,
      quote: t.quote,
      name: t.name,
      role: t.role,
      sortOrder: t.sort_order,
    })),
    values: values.map((v) => ({
      id: v.id,
      title: v.title,
      text: v.text,
      sortOrder: v.sort_order,
    })),
    milestones: milestones.map((m) => ({
      id: m.id,
      value: m.value_text,
      label: m.label,
      sortOrder: m.sort_order,
    })),
    timeline: timeline.map((t) => ({
      id: t.id,
      year: t.year_label,
      title: t.title,
      text: t.text,
      sortOrder: t.sort_order,
    })),
    processSteps: processSteps.map((p) => ({
      id: p.id,
      step: p.step_code,
      title: p.title,
      text: p.text,
      sortOrder: p.sort_order,
    })),
    careers: careers.map((c) => ({
      id: c.id,
      title: c.title,
      type: c.job_type,
      location: c.location,
      summary: c.summary,
      sortOrder: c.sort_order,
    })),
    founders: founders.map((f) => ({
      id: f.id,
      name: f.name,
      designation: f.designation,
      image: f.image,
      bio: f.bio,
      quote: f.quote,
      sortOrder: f.sort_order,
    })),
  });
});

const getSettings = asyncHandler(async (_req, res) => {
  const rows = await query("SELECT * FROM site_settings WHERE id = 1 LIMIT 1");
  return ok(res, mapSettings(rows[0]));
});

const updateSettings = asyncHandler(async (req, res) => {
  const body = req.body || {};
  const existing = await query("SELECT id FROM site_settings WHERE id = 1");
  if (!existing.length) {
    return fail(res, 404, "Settings not found");
  }

  await query(
    `UPDATE site_settings SET
      company_name = ?, short_name = ?, tagline = ?, phone = ?, email = ?, address = ?, hours = ?,
      hero_image = ?, about_image = ?, cta_image = ?, about_story_1 = ?, about_story_2 = ?, careers_intro = ?,
      whatsapp_number = ?
     WHERE id = 1`,
    [
      body.companyName,
      body.shortName,
      body.tagline,
      body.phone,
      body.email,
      body.address,
      body.hours,
      body.heroImage || null,
      body.aboutImage || null,
      body.ctaImage || null,
      body.aboutStory1 || null,
      body.aboutStory2 || null,
      body.careersIntro || null,
      body.whatsappNumber || null,
    ]
  );

  const rows = await query("SELECT * FROM site_settings WHERE id = 1 LIMIT 1");
  return ok(res, mapSettings(rows[0]), "Settings updated");
});

const createContactMessage = asyncHandler(async (req, res) => {
  const { name, email, phone, service, message } = req.body || {};
  if (!name || !email || !message) {
    return fail(res, 400, "Name, email, and message are required");
  }

  const result = await query(
    `INSERT INTO contact_messages (name, email, phone, service, message) VALUES (?, ?, ?, ?, ?)`,
    [name, email, phone || null, service || null, message]
  );

  return ok(res, { id: result.insertId }, "Message sent successfully");
});

module.exports = {
  getPublicSiteData,
  getSettings,
  updateSettings,
  createContactMessage,
  mapSettings,
};
