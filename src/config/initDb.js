const { query } = require("../config/db");

const TABLE_SQL = [
  `CREATE TABLE IF NOT EXISTS admin (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
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
    whatsapp_number VARCHAR(50) DEFAULT NULL,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
  ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4`,

  `CREATE TABLE IF NOT EXISTS founders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    designation VARCHAR(200) NOT NULL,
    image TEXT NOT NULL,
    bio TEXT NOT NULL,
    quote TEXT,
    sort_order INT NOT NULL DEFAULT 0,
    is_active TINYINT(1) NOT NULL DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
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
  if (tables.length) {
    const adminRows = await query("SELECT COUNT(*) AS count FROM admin");
    if (Number(adminRows[0].count) === 0) {
      const oldColumns = await query("SHOW COLUMNS FROM admins");
      const hasPlain = oldColumns.some((col) => col.Field === "password");
      const passwordCol = hasPlain ? "password" : "password_hash";
      await query(
        `INSERT INTO admin (username, password, created_at)
         SELECT username, ${passwordCol}, created_at FROM admins`
      );
    }
    await query("DROP TABLE admins");
  }

  // Rename legacy password_hash column to password if needed
  const columns = await query("SHOW COLUMNS FROM admin");
  const hasHash = columns.some((col) => col.Field === "password_hash");
  const hasPassword = columns.some((col) => col.Field === "password");

  if (hasHash && !hasPassword) {
    await query("ALTER TABLE admin CHANGE password_hash password VARCHAR(255) NOT NULL");
  } else if (hasHash && hasPassword) {
    await query("UPDATE admin SET password = password_hash WHERE password IS NULL OR password = ''");
    await query("ALTER TABLE admin DROP COLUMN password_hash");
  }
}

async function migrateSiteSettingsColumns() {
  const columns = await query("SHOW COLUMNS FROM site_settings");
  const names = columns.map((col) => col.Field);
  if (!names.includes("whatsapp_number")) {
    await query(
      "ALTER TABLE site_settings ADD COLUMN whatsapp_number VARCHAR(50) DEFAULT NULL AFTER careers_intro"
    );
  }
  await query(
    "UPDATE site_settings SET whatsapp_number = COALESCE(NULLIF(whatsapp_number, ''), '919876543210') WHERE id = 1"
  );
}

async function ensureAdmin() {
  const existing = await query("SELECT id, password FROM admin LIMIT 1");
  if (!existing.length) {
    await query("INSERT INTO admin (username, password) VALUES (?, ?)", [
      "admin",
      "Admin@123",
    ]);
    return;
  }

  // Convert previously hashed passwords to the default plain-text password
  const current = String(existing[0].password || "");
  if (current.startsWith("$2a$") || current.startsWith("$2b$") || current.startsWith("$2y$")) {
    await query("UPDATE admin SET password = ? WHERE id = ?", ["Admin@123", existing[0].id]);
  }
}

async function seedIfEmpty() {
  const settings = await query("SELECT id FROM site_settings WHERE id = 1");
  if (!settings.length) {
    await query(
      `INSERT INTO site_settings (
        id, company_name, short_name, tagline, phone, email, address, hours,
        hero_image, about_image, cta_image, about_story_1, about_story_2, careers_intro, whatsapp_number
      ) VALUES (1, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
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
        "919876543210",
      ]
    );
  } else {
    // Ensure WhatsApp number exists on older seeded rows
    await query(
      "UPDATE site_settings SET whatsapp_number = COALESCE(NULLIF(whatsapp_number, ''), ?) WHERE id = 1",
      ["919876543210"]
    );
  }

  const serviceCount = await query("SELECT COUNT(*) AS count FROM services");
  if (Number(serviceCount[0].count) === 0) {
    const services = [
      ["structural-building", "Structural Building Works", "Complete structural building construction for durable, code-compliant structures.", "We execute structural building works with accurate detailing, quality materials, and strict site supervision from framing to structural completion.", 1],
      ["foundation-work", "Foundation Work", "Strong, engineered foundations that support safe and long-lasting construction.", "Our foundation services cover excavation, footing, raft, and related substructure works with careful soil handling and quality concrete practices.", 2],
      ["site-development", "Site Development", "End-to-end site preparation and development for ready-to-build project grounds.", "From leveling and grading to access roads and utility-ready plots, we prepare sites for smooth and efficient construction progress.", 3],
      ["piling-work", "Piling Work", "Reliable piling solutions for deep foundations and high-load structures.", "We deliver piling work with controlled installation methods, alignment checks, and load-ready foundations for industrial and commercial projects.", 4],
      ["industrial-projects", "Industrial Projects", "Industrial sheds, plants, and utility structures built for performance and scale.", "Our industrial project teams focus on functional layouts, strong structures, and efficient execution for manufacturing and warehouse facilities.", 5],
      ["bridge-structural", "Bridge Structural Works", "Structural construction support for bridges and related civil structures.", "We undertake bridge structural works with disciplined engineering coordination, formwork quality, and durable concrete and steel practices.", 6],
      ["road-design-construction", "Road Design & Construction", "Practical road design and construction for internal and connecting road networks.", "We plan and build roads with proper alignment, drainage consideration, compaction standards, and lasting pavement quality.", 7],
      ["fabrication-works", "Fabrication Works", "Steel and metal fabrication for structural and site construction needs.", "Our fabrication works include cutting, assembly, and installation support for structural steel, frames, and custom site components.", 8],
      ["interior-works", "Interior Works", "Interior fit-outs and finishing that complete functional, presentable spaces.", "We deliver interior works covering partitions, finishes, and related installations with clean workmanship and coordinated site delivery.", 9],
      ["fencing-boundary", "Fencing & Boundary Works", "Secure fencing and boundary solutions for project sites and properties.", "We install fencing and boundary systems that improve site security, define property limits, and withstand outdoor conditions.", 10],
      ["boundary-wall", "Boundary Wall Construction", "Strong boundary walls designed for security, durability, and neat finishing.", "Our boundary wall construction covers layout marking, masonry or RCC options, and finishing suitable for residential and commercial sites.", 11],
      ["rcc-boundary", "RCC Boundary Work", "Reinforced cement concrete boundary structures for long-term strength.", "We execute RCC boundary work with proper reinforcement, formwork, and curing practices for durable perimeter structures.", 12],
      ["rcc-drain", "RCC Drain Work", "RCC drain construction for effective site and roadside water management.", "Our RCC drain works help control stormwater flow with accurate levels, strong concrete sections, and clean finishing.", 13],
      ["commercial-building", "Commercial Building Projects", "Offices, retail, and commercial buildings delivered with professional project control.", "We build commercial projects with attention to structure, schedule, safety, and finishes that support business-ready spaces.", 14],
      ["general-construction", "General Construction Services", "Any construction-related work handled with skilled teams and clear delivery.", "From specialized civil packages to complete project support, SBRGREEN undertakes construction-related works tailored to your site requirements.", 15],
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

  const foundersCount = await query("SELECT COUNT(*) AS count FROM founders");
  if (Number(foundersCount[0].count) === 0) {
    await query(
      `INSERT INTO founders (name, designation, image, bio, quote, sort_order) VALUES (?, ?, ?, ?, ?, ?)`,
      [
        "Rajesh Kumar Sharma",
        "Founder & Managing Director",
        "https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&w=800&q=80",
        "With decades of hands-on experience in civil and structural construction, Rajesh founded SBRGREEN to deliver reliable projects with a stronger focus on quality, safety, and greener building practices.",
        "Every structure we build should stand strong — and leave a lighter footprint for tomorrow.",
        1,
      ]
    );
  }
}

async function initDatabase() {
  for (const sql of TABLE_SQL) {
    await query(sql);
  }
  await migrateAdminsTable();
  await migrateSiteSettingsColumns();
  await ensureAdmin();
  await seedIfEmpty();
}

module.exports = { initDatabase };
