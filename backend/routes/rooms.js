const express = require("express");
const router = express.Router();
const pool = require("../db/pool");

// GET ROOMS + STATUS
router.get("/", async (req, res) => {
  const r = await pool.query(`
    SELECT 
      r.*,
      CASE 
        WHEN EXISTS (
          SELECT 1 FROM admissions a 
          WHERE a.room_id = r.id AND a.exit_date IS NULL
        ) THEN 'used'
        ELSE 'free'
      END AS status
    FROM rooms r
    ORDER BY r.number ASC
  `);

  res.json(r.rows);
});

module.exports = router;