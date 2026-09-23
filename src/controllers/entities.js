const { createCrudController } = require("./crudFactory");

const services = createCrudController({
  table: "services",
  mapRow: (row) => ({
    id: row.id,
    slug: row.slug,
    title: row.title,
    summary: row.summary,
    details: row.details,
    sortOrder: row.sort_order,
    isActive: Boolean(row.is_active),
  }),
  validateCreate: (body) => {
    if (!body.slug || !body.title || !body.summary || !body.details) {
      return "slug, title, summary, and details are required";
    }
    return null;
  },
  toInsert: (body) => ({
    columns: ["slug", "title", "summary", "details", "sort_order", "is_active"],
    values: [
      body.slug,
      body.title,
      body.summary,
      body.details,
      Number(body.sortOrder || 0),
      body.isActive === false ? 0 : 1,
    ],
  }),
  toUpdate: (body) => ({
    assignments: ["slug = ?", "title = ?", "summary = ?", "details = ?", "sort_order = ?", "is_active = ?"],
    values: [
      body.slug,
      body.title,
      body.summary,
      body.details,
      Number(body.sortOrder || 0),
      body.isActive === false ? 0 : 1,
    ],
  }),
});

const projects = createCrudController({
  table: "projects",
  mapRow: (row) => ({
    id: row.id,
    title: row.title,
    category: row.category,
    location: row.location,
    year: row.year,
    status: row.status,
    image: row.image,
    description: row.description,
    sortOrder: row.sort_order,
    isActive: Boolean(row.is_active),
  }),
  validateCreate: (body) => {
    if (!body.title || !body.category || !body.location || !body.year || !body.status || !body.image || !body.description) {
      return "title, category, location, year, status, image, and description are required";
    }
    return null;
  },
  toInsert: (body) => ({
    columns: ["title", "category", "location", "year", "status", "image", "description", "sort_order", "is_active"],
    values: [
      body.title,
      body.category,
      body.location,
      body.year,
      body.status,
      body.image,
      body.description,
      Number(body.sortOrder || 0),
      body.isActive === false ? 0 : 1,
    ],
  }),
  toUpdate: (body) => ({
    assignments: [
      "title = ?", "category = ?", "location = ?", "year = ?", "status = ?",
      "image = ?", "description = ?", "sort_order = ?", "is_active = ?",
    ],
    values: [
      body.title,
      body.category,
      body.location,
      body.year,
      body.status,
      body.image,
      body.description,
      Number(body.sortOrder || 0),
      body.isActive === false ? 0 : 1,
    ],
  }),
});

const gallery = createCrudController({
  table: "gallery",
  mapRow: (row) => ({
    id: row.id,
    imageUrl: row.image_url,
    src: row.image_url,
    altText: row.alt_text,
    alt: row.alt_text,
    caption: row.caption,
    sortOrder: row.sort_order,
    isActive: Boolean(row.is_active),
  }),
  validateCreate: (body) => {
    const imageUrl = body.imageUrl || body.src;
    const altText = body.altText || body.alt;
    if (!imageUrl || !altText || !body.caption) {
      return "imageUrl, altText, and caption are required";
    }
    return null;
  },
  toInsert: (body) => ({
    columns: ["image_url", "alt_text", "caption", "sort_order", "is_active"],
    values: [
      body.imageUrl || body.src,
      body.altText || body.alt,
      body.caption,
      Number(body.sortOrder || 0),
      body.isActive === false ? 0 : 1,
    ],
  }),
  toUpdate: (body) => ({
    assignments: ["image_url = ?", "alt_text = ?", "caption = ?", "sort_order = ?", "is_active = ?"],
    values: [
      body.imageUrl || body.src,
      body.altText || body.alt,
      body.caption,
      Number(body.sortOrder || 0),
      body.isActive === false ? 0 : 1,
    ],
  }),
});

const testimonials = createCrudController({
  table: "testimonials",
  mapRow: (row) => ({
    id: row.id,
    quote: row.quote,
    name: row.name,
    role: row.role,
    sortOrder: row.sort_order,
    isActive: Boolean(row.is_active),
  }),
  validateCreate: (body) => {
    if (!body.quote || !body.name || !body.role) return "quote, name, and role are required";
    return null;
  },
  toInsert: (body) => ({
    columns: ["quote", "name", "role", "sort_order", "is_active"],
    values: [body.quote, body.name, body.role, Number(body.sortOrder || 0), body.isActive === false ? 0 : 1],
  }),
  toUpdate: (body) => ({
    assignments: ["quote = ?", "name = ?", "role = ?", "sort_order = ?", "is_active = ?"],
    values: [body.quote, body.name, body.role, Number(body.sortOrder || 0), body.isActive === false ? 0 : 1],
  }),
});

const values = createCrudController({
  table: "company_values",
  mapRow: (row) => ({
    id: row.id,
    title: row.title,
    text: row.text,
    sortOrder: row.sort_order,
    isActive: Boolean(row.is_active),
  }),
  validateCreate: (body) => {
    if (!body.title || !body.text) return "title and text are required";
    return null;
  },
  toInsert: (body) => ({
    columns: ["title", "text", "sort_order", "is_active"],
    values: [body.title, body.text, Number(body.sortOrder || 0), body.isActive === false ? 0 : 1],
  }),
  toUpdate: (body) => ({
    assignments: ["title = ?", "text = ?", "sort_order = ?", "is_active = ?"],
    values: [body.title, body.text, Number(body.sortOrder || 0), body.isActive === false ? 0 : 1],
  }),
});

const milestones = createCrudController({
  table: "milestones",
  mapRow: (row) => ({
    id: row.id,
    value: row.value_text,
    label: row.label,
    sortOrder: row.sort_order,
    isActive: Boolean(row.is_active),
  }),
  validateCreate: (body) => {
    if (!(body.value || body.valueText) || !body.label) return "value and label are required";
    return null;
  },
  toInsert: (body) => ({
    columns: ["value_text", "label", "sort_order", "is_active"],
    values: [body.value || body.valueText, body.label, Number(body.sortOrder || 0), body.isActive === false ? 0 : 1],
  }),
  toUpdate: (body) => ({
    assignments: ["value_text = ?", "label = ?", "sort_order = ?", "is_active = ?"],
    values: [body.value || body.valueText, body.label, Number(body.sortOrder || 0), body.isActive === false ? 0 : 1],
  }),
});

const timeline = createCrudController({
  table: "timeline",
  mapRow: (row) => ({
    id: row.id,
    year: row.year_label,
    title: row.title,
    text: row.text,
    sortOrder: row.sort_order,
    isActive: Boolean(row.is_active),
  }),
  validateCreate: (body) => {
    if (!(body.year || body.yearLabel) || !body.title || !body.text) {
      return "year, title, and text are required";
    }
    return null;
  },
  toInsert: (body) => ({
    columns: ["year_label", "title", "text", "sort_order", "is_active"],
    values: [body.year || body.yearLabel, body.title, body.text, Number(body.sortOrder || 0), body.isActive === false ? 0 : 1],
  }),
  toUpdate: (body) => ({
    assignments: ["year_label = ?", "title = ?", "text = ?", "sort_order = ?", "is_active = ?"],
    values: [body.year || body.yearLabel, body.title, body.text, Number(body.sortOrder || 0), body.isActive === false ? 0 : 1],
  }),
});

const processSteps = createCrudController({
  table: "process_steps",
  mapRow: (row) => ({
    id: row.id,
    step: row.step_code,
    title: row.title,
    text: row.text,
    sortOrder: row.sort_order,
    isActive: Boolean(row.is_active),
  }),
  validateCreate: (body) => {
    if (!(body.step || body.stepCode) || !body.title || !body.text) {
      return "step, title, and text are required";
    }
    return null;
  },
  toInsert: (body) => ({
    columns: ["step_code", "title", "text", "sort_order", "is_active"],
    values: [body.step || body.stepCode, body.title, body.text, Number(body.sortOrder || 0), body.isActive === false ? 0 : 1],
  }),
  toUpdate: (body) => ({
    assignments: ["step_code = ?", "title = ?", "text = ?", "sort_order = ?", "is_active = ?"],
    values: [body.step || body.stepCode, body.title, body.text, Number(body.sortOrder || 0), body.isActive === false ? 0 : 1],
  }),
});

const careers = createCrudController({
  table: "careers",
  mapRow: (row) => ({
    id: row.id,
    title: row.title,
    type: row.job_type,
    location: row.location,
    summary: row.summary,
    sortOrder: row.sort_order,
    isActive: Boolean(row.is_active),
  }),
  validateCreate: (body) => {
    if (!body.title || !(body.type || body.jobType) || !body.location || !body.summary) {
      return "title, type, location, and summary are required";
    }
    return null;
  },
  toInsert: (body) => ({
    columns: ["title", "job_type", "location", "summary", "sort_order", "is_active"],
    values: [
      body.title,
      body.type || body.jobType,
      body.location,
      body.summary,
      Number(body.sortOrder || 0),
      body.isActive === false ? 0 : 1,
    ],
  }),
  toUpdate: (body) => ({
    assignments: ["title = ?", "job_type = ?", "location = ?", "summary = ?", "sort_order = ?", "is_active = ?"],
    values: [
      body.title,
      body.type || body.jobType,
      body.location,
      body.summary,
      Number(body.sortOrder || 0),
      body.isActive === false ? 0 : 1,
    ],
  }),
});

module.exports = {
  services,
  projects,
  gallery,
  testimonials,
  values,
  milestones,
  timeline,
  processSteps,
  careers,
};
