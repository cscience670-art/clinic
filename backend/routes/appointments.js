const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

// =========================
// 📅 GET APPOINTMENTS
// =========================
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        a.id,
        p.name AS patient_name,
        d.name AS doctor_name,
        a.date,
        a.time,
        a.status
      FROM appointments a
      JOIN patients p ON a.patient_id = p.id
      JOIN doctors d ON a.doctor_id = d.id
      ORDER BY a.id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).send("Error fetching appointments");
  }
});


// =========================
// ➕ CREATE APPOINTMENT
// =========================
router.post("/", async (req, res) => {
  try {
    const { patient_id, doctor_id, date, time, status } = req.body;

    await pool.query(
      `INSERT INTO appointments(patient_id, doctor_id, date, time, status)
       VALUES($1,$2,$3,$4,$5)`,
      [patient_id, doctor_id, date, time, status]
    );

    res.send("Appointment added");
  } catch (err) {
    console.error(err);
    res.status(500).send("Error adding appointment");
  }
});

module.exports = router;
