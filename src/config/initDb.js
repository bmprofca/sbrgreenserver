const bcrypt = require("bcryptjs");
const { query } = require("../config/db");

const TABLE_SQL = [
  `CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password_hash VARCHAR(255) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS site_settings (
    id INT PRIMARY KEY DEFAULT 1,
    company_name VARCHAR(255) NOT NULL,
    short_name VARCHAR(100) NOT NULL,
    tagline VARCHAR(500) NOT NULL,
    phone VARCHAR(50) NOT NULL,
    email VARCHAR(150) NOT NULL,
    address TEXT NOT NULL,
    hours VARCHAR(150) NOT NULL,
    hero_image TEXT,
    about_image TEXT,
    cta_image TEXT,
    about_story_1 TEXT,
    about_story_2 TEXT,
    careers_intro TEXT,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS services (
    id INT AUTO_INCREMENT PRIMARY KEY,
    slug VARCHAR(120) NOT NULL UNIQUE,
    title VARCHAR(200) NOT NULL,
    summary TEXT NOT NULL,
    details TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS projects (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    category VARCHAR(100) NOT NULL,
    location VARCHAR(150) NOT NULL,
    year VARCHAR(20) NOT NULL,
    status VARCHAR(50) NOT NULL,
    image TEXT NOT NULL,
    description TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS gallery (
    id INT AUTO_INCREMENT PRIMARY KEY,
    image_url TEXT NOT NULL,
    alt_text VARCHAR(255) NOT NULL,
    caption VARCHAR(255) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS testimonials (
    id INT AUTO_INCREMENT PRIMARY KEY,
    quote TEXT NOT NULL,
    name VARCHAR(150) NOT NULL,
    role VARCHAR(200) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS company_values (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(150) NOT NULL,
    text TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS milestones (
    id INT AUTO_INCREMENT PRIMARY KEY,
    value_text VARCHAR(50) NOT NULL,
    label VARCHAR(150) NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS timeline (
    id INT AUTO_INCREMENT PRIMARY KEY,
    year_label VARCHAR(50) NOT NULL,
    title VARCHAR(200) NOT NULL,
    text TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS process_steps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    step_code VARCHAR(20) NOT NULL,
    title VARCHAR(150) NOT NULL,
    text TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS careers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(200) NOT NULL,
    job_type VARCHAR(100) NOT NULL,
    location VARCHAR(150) NOT NULL,
    summary TEXT NOT NULL,
    sort_order INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS contact_messages (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    email VARCHAR(150) NOT NULL,
    phone VARCHAR(50) DEFAULT NULL,
    service VARCHAR(150) DEFAULT NULL,
    message TEXT NOT NULL,
    is_read TINYINT(1) NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,
];

async function migrateAdminsTable() {
  const tables = await query("SHOW TABLES LIKE 'admins'");
  if (!tables.length) return;

  const adminRows = await query("SELECT COUNT(*) AS count FROM admin");
  if (Number(adminRows[0].count) === 0) {
    await query(
      `INSERT INTO admin (username, password_hash, created_at)
       SELECT username, password_hash, created_at FROM admins`
    );
  }
  await query("DROP TABLE admins");
}

async function ensureAdmin() {
  const existing = await query("SELECT id FROM admin LIMIT 1");
  if (existing.length) return;

  // Default login is stored only in the database (hashed), not in .env
  const passwordHash = await bcrypt.hash("Admin@123", 10);
  await query("INSERT INTO admin (username, password_hash) VALUES (?, ?)", [
    "admin",
    passwordHash,
  ]);
}

async function seedIfEmpty() {
  const settings = await query("SELECT id FROM site_settings WHERE id = 1");
  if (!settings.length) {
    await query(
      `INSERT INTO site_settings (
        id, company_name, short_name, tagline, phone, email, address, hours,
        hero_image, about_image, cta_image, about_story_1, about_story_2, careers_intro
      ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        "SBRGREEN CONSTRUCTION PRIVATE LIMITED",
        "SBRGREEN",
        "Building lasting structures. Growing greener futures.",
        "+91 98765 43210",
        "info@sbrgreen.com",
        "Plot 42, Green Tech Park, Sector 18, Gurugram, Haryana 122001",
        "Mon – Sat: 9:00 AM – 6:00 PM",
        "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1800&q=80",
        "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1000&q=80",
        "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80",
        "SBRGREEN CONSTRUCTION PRIVATE LIMITED is a full-service construction company serving residential, commercial, industrial, and civic clients. We combine practical engineering, skilled site teams, and clear project communication to turn plans into finished structures.",
        "Our name reflects our ambition: to build well, and to build with greater care for the environments our projects inhabit. From scheduling and procurement to finishing and handover, we treat every assignment as a long-term commitment to quality.",
        "You will work on meaningful projects with clear leadership, fair processes, and a genuine focus on safety. We invest in people who take ownership — on drawings, on site, and with clients.",
      ]
    );
  }

  const serviceCount = await query("SELECT COUNT(*) AS count FROM services");
  if (Number(serviceCount[0].count) === 0) {
    const services = [
      ["residential", "Residential Construction", "Custom homes, apartments, and gated communities built with precision and lasting quality.", "From foundation to finishing, we deliver residential projects that balance comfort, durability, and modern living standards.", 1],
      ["commercial", "Commercial Buildings", "Offices, retail spaces, and mixed-use developments designed for performance and presence.", "We manage commercial builds with clear timelines, safety compliance, and finishes that reflect your brand.", 2],
      ["infrastructure", "Infrastructure Works", "Roads, drainage, utility corridors, and civic structures that serve communities for decades.", "Our infrastructure teams bring engineering rigor and site discipline to public and private civil works.", 3],
      ["renovation", "Renovation & Retrofitting", "Structural upgrades, modernizations, and adaptive reuse of existing properties.", "We revitalize aging structures with careful planning, minimal disruption, and updated building systems.", 4],
      ["green", "Green & Sustainable Builds", "Energy-efficient design, eco materials, and practices that reduce environmental impact.", "As SBRGREEN, we prioritize responsible construction — from waste control to efficient envelopes and landscaping.", 5],
      ["pmc", "Project Management", "End-to-end planning, scheduling, quality control, and stakeholder coordination.", "Transparent reporting, milestone tracking, and on-site leadership keep your project on course.", 6],
    ];
    for (const row of services) {
      await query(
        `INSERT INTO services (slug, title, summary, details, sort_order) VALUES (?, ?, ?, ?, ?)`,
        row
      );
    }
  }

  const projectCount = await query("SELECT COUNT(*) AS count FROM projects");
  if (Number(projectCount[0].count) === 0) {
    const projects = [
      ["Verdant Heights Residences", "Residential", "Gurugram", "2025", "Completed", "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80", "A mid-rise residential complex with landscaped courtyards and energy-efficient façades.", 1],
      ["Northline Business Hub", "Commercial", "Noida", "2024", "Completed", "https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1200&q=80", "Multi-tenant office campus with flexible floor plates and structured parking.", 2],
      ["Riverbend Civic Corridor", "Infrastructure", "Faridabad", "2025", "Ongoing", "https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1200&q=80", "Road widening, stormwater drainage, and pedestrian pathway upgrades along a key corridor.", 3],
      ["Cedar Grove Villas", "Residential", "Greater Noida", "2023", "Completed", "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80", "Premium villa community emphasizing natural light, open plans, and durable finishes.", 4],
      ["Apex Industrial Sheds", "Industrial", "Bhiwadi", "2024", "Completed", "https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1200&q=80", "Pre-engineered industrial units with high clear heights and efficient logistics access.", 5],
      ["Greenleaf School Campus", "Institutional", "Gurugram", "2026", "Ongoing", "https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1200&q=80", "Educational campus featuring classrooms, sports courts, and landscape-led site planning.", 6],
    ];
    for (const row of projects) {
      await query(
        `INSERT INTO projects (title, category, location, year, status, image, description, sort_order) VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
        row
      );
    }
  }

  const galleryCount = await query("SELECT COUNT(*) AS count FROM gallery");
  if (Number(galleryCount[0].count) === 0) {
    const gallery = [
      ["https://images.unsplash.com/photo-1503387762-592deb58ef4e?auto=format&fit=crop&w=1000&q=80", "Steel frame rising on a commercial site", "Structural frame — Northline Hub", 1],
      ["https://images.unsplash.com/photo-1541888946425-d81bb19240f5?auto=format&fit=crop&w=1000&q=80", "Workers on an active construction site", "On-site coordination", 2],
      ["https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=1000&q=80", "Crane and building under construction", "Vertical construction progress", 3],
      ["https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1000&q=80", "Modern completed glass building", "Completed commercial façade", 4],
      ["https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1000&q=80", "Modern residential home exterior", "Residential finishing", 5],
      ["https://images.unsplash.com/photo-1581094794329-c8112a89af12?auto=format&fit=crop&w=1000&q=80", "Industrial construction interior", "Industrial shell works", 6],
      ["https://images.unsplash.com/photo-1590644365607-1c5a08109165?auto=format&fit=crop&w=1000&q=80", "Concrete pouring at foundation", "Foundation & concrete works", 7],
      ["https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1000&q=80", "Blueprint and hard hat on site table", "Planning & quality checks", 8],
    ];
    for (const row of gallery) {
      await query(
        `INSERT INTO gallery (image_url, alt_text, caption, sort_order) VALUES (?, ?, ?, ?)`,
        row
      );
    }
  }

  const testimonialCount = await query("SELECT COUNT(*) AS count FROM testimonials");
  if (Number(testimonialCount[0].count) === 0) {
    const rows = [
      ["SBRGREEN delivered our campus on schedule with exceptional site discipline. Communication was clear at every milestone.", "Ananya Mehta", "Director, Greenleaf Education Trust", 1],
      ["Their green-building approach reduced long-term operating costs without compromising design quality.", "Rohan Kapoor", "CEO, Northline Realty", 2],
      ["From excavation to handover, the team was professional, safety-focused, and easy to work with.", "Priya Sharma", "Homeowner, Cedar Grove", 3],
    ];
    for (const row of rows) {
      await query(
        `INSERT INTO testimonials (quote, name, role, sort_order) VALUES (?, ?, ?, ?)`,
        row
      );
    }
  }

  const valuesCount = await query("SELECT COUNT(*) AS count FROM company_values");
  if (Number(valuesCount[0].count) === 0) {
    const rows = [
      ["Safety First", "Every site follows strict safety protocols — protecting people, schedules, and outcomes.", 1],
      ["Craft & Quality", "We build with care: accurate detailing, durable materials, and thorough inspections.", 2],
      ["Green Responsibility", "Sustainable choices are part of how we plan, source, and deliver every project.", 3],
      ["Transparent Delivery", "Clear timelines, honest reporting, and accountable project leadership.", 4],
    ];
    for (const row of rows) {
      await query(
        `INSERT INTO company_values (title, text, sort_order) VALUES (?, ?, ?)`,
        row
      );
    }
  }

  const milestoneCount = await query("SELECT COUNT(*) AS count FROM milestones");
  if (Number(milestoneCount[0].count) === 0) {
    const rows = [
      ["15+", "Years of experience", 1],
      ["120+", "Projects delivered", 2],
      ["80+", "Skilled professionals", 3],
      ["98%", "Client satisfaction", 4],
    ];
    for (const row of rows) {
      await query(
        `INSERT INTO milestones (value_text, label, sort_order) VALUES (?, ?, ?)`,
        row
      );
    }
  }

  const timelineCount = await query("SELECT COUNT(*) AS count FROM timeline");
  if (Number(timelineCount[0].count) === 0) {
    const rows = [
      ["2010", "Founded with purpose", "SBRGREEN began as a focused construction practice committed to reliable delivery and responsible building.", 1],
      ["2016", "Expanded capabilities", "Grew into commercial and infrastructure workstreams with dedicated engineering and site leadership teams.", 2],
      ["2021", "Green construction focus", "Formalized sustainable methods — material efficiency, waste reduction, and energy-conscious design collaboration.", 3],
      ["Today", "Building across NCR", "Delivering complex projects with the same principles: safety, craft, transparency, and lasting quality.", 4],
    ];
    for (const row of rows) {
      await query(
        `INSERT INTO timeline (year_label, title, text, sort_order) VALUES (?, ?, ?, ?)`,
        row
      );
    }
  }

  const processCount = await query("SELECT COUNT(*) AS count FROM process_steps");
  if (Number(processCount[0].count) === 0) {
    const rows = [
      ["01", "Consult", "Understand scope, site conditions, budget, and success criteria.", 1],
      ["02", "Plan", "Define schedule, resources, procurement, and quality checkpoints.", 2],
      ["03", "Build", "Execute with skilled teams, safety oversight, and progress reporting.", 3],
      ["04", "Handover", "Complete snagging, documentation, and a clean project close-out.", 4],
    ];
    for (const row of rows) {
      await query(
        `INSERT INTO process_steps (step_code, title, text, sort_order) VALUES (?, ?, ?, ?)`,
        row
      );
    }
  }

  const careersCount = await query("SELECT COUNT(*) AS count FROM careers");
  if (Number(careersCount[0].count) === 0) {
    const rows = [
      ["Project Engineer", "Full-time", "Gurugram", "Coordinate site execution, track progress against drawings, and support quality control.", 1],
      ["Site Supervisor", "Full-time", "NCR Sites", "Lead daily workforce activities, enforce safety standards, and maintain site documentation.", 2],
      ["Quantity Surveyor", "Full-time", "Gurugram HQ", "Prepare BOQs, monitor material usage, and support cost control across active projects.", 3],
      ["Safety Officer", "Full-time", "Multiple Sites", "Implement HSE policies, conduct toolbox talks, and ensure regulatory compliance on site.", 4],
    ];
    for (const row of rows) {
      await query(
        `INSERT INTO careers (title, job_type, location, summary, sort_order) VALUES (?, ?, ?, ?, ?)`,
        row
      );
    }
  }
}

async function initDatabase() {
  for (const sql of TABLE_SQL) {
    await query(sql);
  }
  await migrateAdminsTable();
  await ensureAdmin();
  await seedIfEmpty();
}

module.exports = { initDatabase };
