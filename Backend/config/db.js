const mysql = require("mysql2");
require("dotenv").config();

// Database connection pool setup
const dbConnection = mysql.createPool({
  host: process.env.DB_HOST ,
  user: process.env.DB_USER ,
  password: process.env.DB_PASSWORD ,
  database: process.env.DB_NAME ,
  connectionLimit: 10,
});

// Verify and establish connection
dbConnection.getConnection((err, connection) => {
  if (err) {
    console.log("❌ Database connection failed:", err);
  } else {
    console.log("✅ Connected to MySQL database successfully.");
    initializeDatabase();
    connection.release();
  }
});

// Initialize database schema sequentially
async function initializeDatabase() {
  try {
    // 1. USERS SECURITY TABLE
    const usersTable = `
      CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        username VARCHAR(100) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role ENUM('admin', 'student') NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;

    // 2. STUDENTS ACADEMIC PROFILES (Depends on users)
    const studentsTable = `
      CREATE TABLE IF NOT EXISTS students (
        id INT AUTO_INCREMENT PRIMARY KEY,
        student_id VARCHAR(50) UNIQUE NOT NULL,
        first_name VARCHAR(100) NOT NULL,
        last_name VARCHAR(100) NOT NULL,
        gender ENUM('Male', 'Female') NOT NULL,
        department VARCHAR(100) NOT NULL,
        year_level INT NOT NULL,
        phone VARCHAR(20),
        email VARCHAR(100),
        status ENUM('Active', 'Graduated') DEFAULT 'Active',
        user_id INT UNIQUE, 
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
      );
    `;

    // 3. HOUSING BLOCKS
    const blocksTable = `
      CREATE TABLE IF NOT EXISTS blocks (
        id INT AUTO_INCREMENT PRIMARY KEY,
        block_name VARCHAR(50) UNIQUE NOT NULL, 
        gender ENUM('Male', 'Female') NOT NULL,
        description TEXT
      );
    `;

    // 4. DORM ROOMS CONFIGURATION (Depends on blocks)
    const dormsTable = `
      CREATE TABLE IF NOT EXISTS dorms (
        id INT AUTO_INCREMENT PRIMARY KEY,
        block_id INT NOT NULL,
        dorm_number VARCHAR(50) NOT NULL,
        capacity INT DEFAULT 6,
        FOREIGN KEY (block_id) REFERENCES blocks(id) ON DELETE CASCADE,
        UNIQUE KEY unique_dorm_per_block (block_id, dorm_number) 
      );
    `;

    // 5. ACADEMIC PERIODS / SESSION RECORDS
    const academicYearsTable = `
      CREATE TABLE IF NOT EXISTS academic_years (
        id INT AUTO_INCREMENT PRIMARY KEY,
        label VARCHAR(50) UNIQUE NOT NULL, 
        is_active BOOLEAN DEFAULT TRUE
      );
    `;

    // 6. PLACEMENTS TABLE (Depends on academic_years, students, blocks, and dorms)
    const placementsTable = `
      CREATE TABLE IF NOT EXISTS placements (
        id INT AUTO_INCREMENT PRIMARY KEY,
        academic_year_id INT NOT NULL,
        student_id INT NOT NULL,
        block_id INT NOT NULL,
        dorm_id INT NOT NULL,
        placement_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        
        FOREIGN KEY (academic_year_id) REFERENCES academic_years(id),
        FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
        FOREIGN KEY (block_id) REFERENCES blocks(id),
        FOREIGN KEY (dorm_id) REFERENCES dorms(id),
        
        UNIQUE KEY unique_student_per_semester (academic_year_id, student_id)
      );
    `;

    // **DEFINED TABLE CREATION SEQUENCE**
    const tables = [
      { query: usersTable, name: "users" },
      { query: studentsTable, name: "students" },
      { query: blocksTable, name: "blocks" },
      { query: dormsTable, name: "dorms" },
      { query: academicYearsTable, name: "academic_years" },
      { query: placementsTable, name: "placements" },
    ];

    // Execute table construction sequentially
    for (const table of tables) {
      await new Promise((resolve, reject) => {
        dbConnection.execute(table.query, (err) => {
          if (err) {
            console.log(
              `❌ Error creating ${table.name} table:`,
              err.sqlMessage,
            );
            reject(err);
          } else {
            resolve();
          }
        });
      });
    }

    console.log(
      "🚀 Dormitory Placement Database structural framework created successfully!",
    );

    // Execute core querying optimization indexes
    await createIndexes();
  } catch (error) {
    console.log("❌ Database schema initialization failed:", error);
  }
}

// Optimization Index Execution Matrix
async function createIndexes() {
  const indexes = [
    // Student Search and Matching Lookups
    "CREATE INDEX idx_student_search ON students(last_name, first_name)",

    // Algorithmic Automatic Placement Query Optimizations
    "CREATE INDEX idx_student_placement_criteria ON students(status, department, gender)",
    "CREATE INDEX idx_block_gender ON blocks(gender)",

    // System Lifecycle Status Check Lookups
    "CREATE INDEX idx_active_semester ON academic_years(is_active)",

    // Real-Time Room Aggregation & Reporting Optimizations
    "CREATE INDEX idx_placement_dorm_lookup ON placements(academic_year_id, dorm_id)",
    "CREATE INDEX idx_placement_block_lookup ON placements(academic_year_id, block_id)",
  ];

  for (const indexQuery of indexes) {
    try {
      await new Promise((resolve) => {
        dbConnection.execute(indexQuery, (err) => {
          if (err) {
            // Silently swallow duplicate key warnings if database restarts
            if (!err.sqlMessage.includes("Duplicate key name")) {
              console.log(`⚠️ Index deployment warning:`, err.sqlMessage);
            }
          }
          resolve();
        });
      });
    } catch (error) {
      console.log("Index injection skipped:", error.message);
    }
  }

  console.log("⚡ Performance optimization indexes verified and active!");
}

module.exports = dbConnection.promise();
