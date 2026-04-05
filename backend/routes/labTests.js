const express = require("express");
const router = express.Router();
const pool = require("../db/pool");


// =========================
// 🧪 LAB TESTS (CRUD)
// =========================

// 📥 GET ALL LAB TESTS
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM lab_tests ORDER BY id DESC"
    );
    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Error fetching lab tests");
  }
});


// ➕ ADD LAB TEST
router.post("/", async (req, res) => {
  try {
    const { name, price } = req.body;

    await pool.query(
      "INSERT INTO lab_tests(name, price) VALUES($1,$2)",
      [name, price]
    );

    res.send("Lab test added");
  } catch (err) {
    res.status(500).send("Error adding lab test");
  }
});


// ❌ DELETE LAB TEST
router.delete("/:id", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM lab_tests WHERE id=$1",
      [req.params.id]
    );

    res.send("Lab test deleted");
  } catch (err) {
    res.status(500).send("Error deleting lab test");
  }
});


// =========================
// 📊 TEST RESULTS
// =========================


// 📥 GET ALL RESULTS (with joins)
router.get("/results", async (req, res) => {
  try {
    const result = await pool.query(`
      SELECT 
        tr.id,
        p.name AS patient_name,
        lt.name AS test_name,
        tr.date,
        tr.result
      FROM test_results tr
      JOIN patients p ON p.id = tr.patient_id
      JOIN lab_tests lt ON lt.id = tr.test_id
      ORDER BY tr.id DESC
    `);

    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Error fetching results");
  }
});


// ➕ ADD RESULT
router.post("/results", async (req, res) => {
  try {
    const { patient_id, test_id, result } = req.body;

    await pool.query(
      `INSERT INTO test_results(patient_id, test_id, result)
       VALUES($1,$2,$3)`,
      [patient_id, test_id, result]
    );

    res.send("Result added");
  } catch (err) {
    res.status(500).send("Error adding result");
  }
});


// ❌ DELETE RESULT
router.delete("/results/:id", async (req, res) => {
  try {
    await pool.query(
      "DELETE FROM test_results WHERE id=$1",
      [req.params.id]
    );

    res.send("Result deleted");
  } catch (err) {
    res.status(500).send("Error deleting result");
  }
});

module.exports = router;