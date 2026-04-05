const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

router.get("/", async (req, res) => {
  try {
    const patients = await pool.query("SELECT COUNT(*) FROM patients");
    const doctors = await pool.query("SELECT COUNT(*) FROM doctors");
    const appointments = await pool.query("SELECT COUNT(*) FROM appointments");
    const invoices = await pool.query("SELECT COUNT(*) FROM invoices");

    const roomsUsed = await pool.query(`
      SELECT COUNT(*) FROM admissions WHERE exit_date IS NULL
    `);

    const roomsTotal = await pool.query("SELECT COUNT(*) FROM rooms");

    res.json({
      patients: +patients.rows[0].count,
      doctors: +doctors.rows[0].count,
      appointments: +appointments.rows[0].count,
      invoices: +invoices.rows[0].count,
      roomsUsed: +roomsUsed.rows[0].count,
      roomsFree: +roomsTotal.rows[0].count - +roomsUsed.rows[0].count
    });

  } catch (err) {
    res.status(500).send(err.message);
  }
});

module.exports = router;