const express = require("express");
const router = express.Router();
const pool = require("../db/pool");


// =========================
// 📥 GET ALL ADMISSIONS (FIXED)
// =========================
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.id,
        p.name AS patient_name,
        d.name AS doctor_name,
        r.number AS room_number,
        a.entry_date,
        a.exit_date
      FROM admissions a
      JOIN patients p ON p.id = a.patient_id
      LEFT JOIN doctors d ON d.id = a.doctor_id
      JOIN rooms r ON r.id = a.room_id
      ORDER BY a.id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).send(err.message);
  }
});


// =========================
// ➕ ADMIT PATIENT
// =========================
router.post("/", async (req, res) => {
  const { patient_id, doctor_id, room_id, entry_date } = req.body;

  try {
    await pool.query("BEGIN");

    await pool.query(
      `INSERT INTO admissions(patient_id, doctor_id, room_id, entry_date)
       VALUES($1,$2,$3,$4)`,
      [patient_id, doctor_id, room_id, entry_date]
    );

    await pool.query(
      "UPDATE rooms SET status='used' WHERE id=$1",
      [room_id]
    );

    await pool.query("COMMIT");

    res.send("Admitted successfully");

  } catch (err) {
    await pool.query("ROLLBACK");
    res.status(500).send(err.message);
  }
});


// =========================
// 🚪 EXIT (DISCHARGE) - FIXED
// =========================
router.put("/:id/exit", async (req, res) => {
  const id = req.params.id;

  try {
    await pool.query("BEGIN");

    const admission = await pool.query(
      "SELECT room_id, exit_date FROM admissions WHERE id=$1",
      [id]
    );

    if (admission.rows.length === 0) {
      await pool.query("ROLLBACK");
      return res.status(404).send("Admission not found");
    }

    if (admission.rows[0].exit_date) {
      await pool.query("ROLLBACK");
      return res.status(400).send("Already discharged");
    }

    const room_id = admission.rows[0].room_id;

    await pool.query(
      "UPDATE admissions SET exit_date = CURRENT_DATE WHERE id=$1",
      [id]
    );

    await pool.query(
      "UPDATE rooms SET status='free' WHERE id=$1",
      [room_id]
    );

    await pool.query("COMMIT");

    res.send("Patient discharged successfully");

  } catch (err) {
    await pool.query("ROLLBACK");
    res.status(500).send("Error during discharge");
  }
});


// =========================
// 📄 PDF (placeholder)
// =========================
router.get("/:id/pdf", async (req, res) => {
  res.send("PDF feature not implemented yet");
});


// =========================
// 📥 CSV EXPORT (FIXED ROUTE USED IN FRONTEND)
// =========================
router.get("/export/csv", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT * FROM admissions
    `);

    let csv = "id,patient_id,room_id,entry_date,exit_date\n";

    result.rows.forEach(r => {
      csv += `${r.id},${r.patient_id},${r.room_id},${r.entry_date},${r.exit_date || ""}\n`;
    });

    res.header("Content-Type", "text/csv");
    res.attachment("admissions.csv");
    res.send(csv);

  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;