const express = require("express");
const router = express.Router();
const pool = require("../db/pool");


// =========================
// 📥 GET ALL INVOICES
// =========================
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        i.id,
        p.name AS patient_name,
        i.total,
        i.date
      FROM invoices i
      JOIN patients p ON p.id = i.patient_id
      ORDER BY i.id DESC
    `);

    res.json(result.rows);

  } catch (err) {
    res.status(500).send("Error fetching invoices");
  }
});


// =========================
// ➕ ADD INVOICE
// =========================
router.post("/", async (req, res) => {
  const { patient_id, total } = req.body;

  try {
    await pool.query(
      "INSERT INTO invoices(patient_id, total) VALUES($1,$2)",
      [patient_id, total]
    );

    res.send("Invoice added successfully");

  } catch (err) {
    res.status(500).send("Error adding invoice");
  }
});


// =========================
// ❌ DELETE INVOICE
// =========================
router.delete("/:id", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM invoices WHERE id=$1",
      [req.params.id]
    );

    res.send("Invoice deleted");

  } catch (err) {
    res.status(500).send("Error deleting invoice");
  }
});


// =========================
// 📊 TOTAL REVENUE (OPTIONAL API)
// =========================
router.get("/total", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT COALESCE(SUM(total),0) AS total_revenue FROM invoices
    `);

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).send("Error calculating total");
  }
});


module.exports = router;