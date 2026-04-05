const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

// GET
router.get("/", async (req, res) => {
  const r = await pool.query("SELECT * FROM patients ORDER BY id DESC");
  res.json(r.rows);
});

// POST
router.post("/", async (req, res) => {
  const { name, age, gender, phone } = req.body;

  await pool.query(
    "INSERT INTO patients(name, age, gender, phone) VALUES($1,$2,$3,$4)",
    [name, age, gender, phone]
  );

  res.send("OK");
});

// DELETE
router.delete("/:id", async (req, res) => {
  await pool.query("DELETE FROM patients WHERE id=$1", [req.params.id]);
  res.send("Deleted");
});

module.exports = router;