const db = require("../config/db");
const Student = require("../models/Student");
const Block = require("../models/Block");
const Dorm = require("../models/Dorm");
const Placement = require("../models/Placement");
const AcademicYear = require("../models/AcademicYear");

class PlacementService {
  // Main method: Execute the automatic placement (Rule 15)
  static async generatePlacements({ academicYearId, adminUserId }) {
    const connection = await db.getConnection();

    try {
      await connection.beginTransaction();

      // --- Pre-requisite Checks ---
      // 1. Validate Academic Year
      let yearId = academicYearId;
      if (!yearId) {
        const activeYear = await AcademicYear.getActive();
        if (!activeYear) {
          throw new Error("No active academic year found. Please set one.");
        }
        yearId = activeYear.id;
      }

      // --- STEP 1: Fetch Eligible Students (Rule 2) ---
      // Fetch all students with status = 'Active', ordered by department (Rule 4)
      const [students] = await connection.execute(
        `SELECT * FROM students WHERE status = 'Active' ORDER BY department ASC, gender ASC`,
      );

      if (students.length === 0) {
        throw new Error("No active students found to place.");
      }

      // --- STEP 2: Check Already Placed Students (Rule 3 & 11) ---
      const [placedStudents] = await connection.execute(
        "SELECT student_id FROM placements WHERE academic_year_id = ?",
        [yearId],
      );
      const placedStudentIds = new Set(placedStudents.map((p) => p.student_id));

      // Filter out students already placed this year
      const eligibleStudents = students.filter(
        (s) => !placedStudentIds.has(s.id),
      );

      if (eligibleStudents.length === 0) {
        throw new Error(
          "All active students are already placed for this academic year.",
        );
      }

      // --- STEP 3: Group Students by Gender (Rule 1) ---
      const maleStudents = eligibleStudents.filter((s) => s.gender === "Male");
      const femaleStudents = eligibleStudents.filter(
        (s) => s.gender === "Female",
      );

      // --- STEP 4: Get Current Occupancy for all Dorms (Rule 12) ---
      const occupancyMap = await Placement.getOccupancyByAcademicYear(yearId);

      // --- STEP 5: Fetch All Blocks and Dorms (Grouped by Gender) ---
      const [blocks] = await connection.execute(
        "SELECT * FROM blocks ORDER BY gender, block_name",
      );

      // Fetch all dorms and add occupancy
      const [dorms] = await connection.execute(
        "SELECT * FROM dorms ORDER BY block_id, dorm_number",
      );

      // Build a map: block_id -> list of dorms with current occupancy
      const blockMap = {};
      blocks.forEach((block) => {
        blockMap[block.id] = {
          ...block,
          dorms: dorms
            .filter((d) => d.block_id === block.id)
            .map((d) => ({
              ...d,
              current_occupancy: occupancyMap[d.id] || 0,
            })),
        };
      });

      // --- STEP 6: The Assignment Logic (Rules 4, 5, 6, 8, 10) ---
      const placementsToInsert = [];
      const results = {
        total_eligible: eligibleStudents.length,
        placed: 0,
        skipped: 0,
        unplaced: [],
        details: [],
      };

      // Helper: Assign a group of students to available dorms
      const assignStudents = (studentGroup, blockGender) => {
        // Find blocks that match this gender (Rule 7)
        const availableBlocks = Object.values(blockMap).filter(
          (b) => b.gender === blockGender && b.dorms.length > 0,
        );

        // Sort students by department to keep them together (Rule 4)
        // Actually, we already sorted globally by department, so just iterate.

        let remainingStudents = [...studentGroup];

        // Loop through each block
        for (const block of availableBlocks) {
          if (remainingStudents.length === 0) break;

          // Get dorms for this block, SORT by current_occupancy ASC (Rule 8: Empty dorms first)
          let sortedDorms = [...block.dorms].sort(
            (a, b) => a.current_occupancy - b.current_occupancy,
          );

          // Loop through each dorm in this block
          for (const dorm of sortedDorms) {
            if (remainingStudents.length === 0) break;

            // Calculate available spots (Rule 12)
            const availableSpots = dorm.capacity - dorm.current_occupancy;
            if (availableSpots <= 0) continue; // Dorm is full (Rule 6)

            // Determine how many students to put in this dorm (Rule 5: Fill current dorm first)
            const studentsToAssign = remainingStudents.splice(
              0,
              availableSpots,
            );

            // Assign them
            studentsToAssign.forEach((student) => {
              placementsToInsert.push({
                academic_year_id: yearId,
                student_id: student.id,
                block_id: block.id,
                dorm_id: dorm.id,
                created_by: adminUserId,
              });
              // Update the occupancy for this dorm in memory (so subsequent students see it fill up)
              dorm.current_occupancy += 1;
              results.placed += 1;
              results.details.push({
                student: `${student.first_name} ${student.last_name} (${student.student_id})`,
                department: student.department,
                block: block.block_name,
                dorm: dorm.dorm_number,
              });
            });

            // Re-sort dorms in this block if needed (though the outer loop will recalc)
            sortedDorms.sort(
              (a, b) => a.current_occupancy - b.current_occupancy,
            );
          }
        }

        // If there are remaining students, log them as unplaced (Rule 10 overflow edge case)
        if (remainingStudents.length > 0) {
          remainingStudents.forEach((student) => {
            results.unplaced.push({
              id: student.id,
              name: `${student.first_name} ${student.last_name}`,
              department: student.department,
              reason: "No available dorms with capacity",
            });
            results.skipped += 1;
          });
        }
      };

      // Assign Male Students (Rule 1)
      if (maleStudents.length > 0) {
        assignStudents(maleStudents, "Male");
      }

      // Assign Female Students (Rule 1)
      if (femaleStudents.length > 0) {
        assignStudents(femaleStudents, "Female");
      }

      // --- STEP 7: Bulk Insert Placements (Optimization) ---
      if (placementsToInsert.length > 0) {
        await Placement.bulkAssign(placementsToInsert);
      }

      // --- STEP 8: Commit Transaction ---
      await connection.commit();

      return {
        success: true,
        message: `Placement generation complete. ${results.placed} students assigned.`,
        data: {
          academic_year_id: yearId,
          total_eligible: results.total_eligible,
          placed: results.placed,
          unplaced_count: results.unplaced.length,
          unplaced_students: results.unplaced,
          details: results.details.slice(0, 20), // Return first 20 for preview
        },
      };
    } catch (error) {
      await connection.rollback();
      console.error("Placement Error:", error);
      throw error;
    } finally {
      connection.release();
    }
  }

  // --- Rule 14: Reset Placements ---
  static async resetPlacements({ academicYearId, adminUserId }) {
    let yearId = academicYearId;
    if (!yearId) {
      const activeYear = await AcademicYear.getActive();
      if (activeYear) yearId = activeYear.id;
    }

    if (!yearId) {
      throw new Error("Academic year ID is required or no active year found.");
    }

    const deletedCount = await Placement.resetByAcademicYear(yearId);

    return {
      success: true,
      message: `Placements reset successfully. ${deletedCount} records removed.`,
      data: {
        academic_year_id: yearId,
        deleted_count: deletedCount,
      },
    };
  }

  // Fetch placements for a given year (for reports)
  static async getPlacements({ academicYearId }) {
    let yearId = academicYearId;
    if (!yearId) {
      const activeYear = await AcademicYear.getActive();
      if (activeYear) yearId = activeYear.id;
    }

    if (!yearId) {
      throw new Error("Academic year not found.");
    }

    const placements = await Placement.getByAcademicYear(yearId);
    return placements;
  }
}

module.exports = PlacementService;
