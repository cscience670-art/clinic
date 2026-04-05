const express = require("express");
const router = express.Router();
const pool = require("../db/pool");


// =========================
// 📥 GET ALL DOCTORS
// =========================
router.get("/", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM doctors ORDER BY id DESC"
    );

    res.json(result.rows);
  } catch (err) {
    res.status(500).send("Error fetching doctors");
  }
});


// =========================
// 🔍 GET SINGLE DOCTOR
// =========================
router.get("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM doctors WHERE id=$1",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Doctor not found");
    }

    res.json(result.rows[0]);
  } catch (err) {
    res.status(500).send("Error fetching doctor");
  }
});


// =========================
// ➕ ADD DOCTOR
// =========================
router.post("/", async (req, res) => {
  const { name, specialization } = req.body;

  if (!name || !specialization) {
    return res.status(400).send("Missing fields");
  }

  try {
    await pool.query(
      "INSERT INTO doctors(name, specialization) VALUES($1,$2)",
      [name, specialization]
    );

    res.send("Doctor added successfully");

  } catch (err) {
    res.status(500).send("Error adding doctor");
  }
});


// =========================
// ✏️ UPDATE DOCTOR
// =========================
router.put("/:id", async (req, res) => {
  const { name, specialty } = req.body;

  try {
    const result = await pool.query(
      "UPDATE doctors SET name=$1, specialty=$2 WHERE id=$3 RETURNING *",
      [name, specialty, req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Doctor not found");
    }

    res.json(result.rows[0]);

  } catch (err) {
    res.status(500).send("Error updating doctor");
  }
});


// =========================
// ❌ DELETE DOCTOR
// =========================
router.delete("/:id", async (req, res) => {
  try {
    const result = await pool.query(
      "DELETE FROM doctors WHERE id=$1 RETURNING *",
      [req.params.id]
    );

    if (result.rows.length === 0) {
      return res.status(404).send("Doctor not found");
    }

    res.send("Doctor deleted successfully");

  } catch (err) {
    res.status(500).send("Error deleting doctor");
  }
});


// =========================
// 🔎 SEARCH DOCTORS
// =========================
router.get("/search/:name", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT * FROM doctors WHERE name ILIKE $1",
      [`%${req.params.name}%`]
    );

    res.json(result.rows);

  } catch (err) {
    res.status(500).send("Error searching doctors");
  }
});


module.exports = router;