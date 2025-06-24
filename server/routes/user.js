const express = require("express");
const bcrypt = require("bcrypt");
const pool = require("../db"); 

const router = express.Router();


//postuser
router.post("/", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Missing fields" });
    }

    const [dupes] = await pool.execute("SELECT id FROM users WHERE email = ?", [email]);
    if (dupes.length) return res.status(409).json({ error: "Email already exists" });

    const password_hash = await bcrypt.hash(password, 10);
    const [result] = await pool.execute(
      "INSERT INTO users (name, email, password_hash) VALUES (?, ?, ?)",
      [name, email, password_hash]
    );

    res.status(201).json({ id: result.insertId, name, email, created_at: new Date().toISOString() });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


router.get("/", async (_req, res) => {
  try {
    const [rows] = await pool.query("SELECT id, name, email, created_at FROM users ORDER BY id");
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


router.get("/:id", async (req, res) => {
  try {
    const [rows] = await pool.execute("SELECT id, name, email, created_at FROM users WHERE id = ?", [req.params.id]);
    if (!rows.length) return res.status(404).json({ error: "User not found" });
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.put("/:id", async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const updates = [];
    const params = [];

    if (name) { updates.push("name = ?"); params.push(name); }
    if (email) { updates.push("email = ?"); params.push(email); }
    if (password) {
      const hash = await bcrypt.hash(password, 10);
      updates.push("password_hash = ?");
      params.push(hash);
    }

    if (!updates.length) {
      return res.status(400).json({ error: "Nothing to update" });
    }

    params.push(req.params.id); // WHERE id = ?

    const [result] = await pool.execute(`UPDATE users SET ${updates.join(", ")} WHERE id = ?`, params);
    if (!result.affectedRows) return res.status(404).json({ error: "User not found" });

    const [rows] = await pool.execute("SELECT id, name, email, created_at FROM users WHERE id = ?", [req.params.id]);
    res.json(rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});


router.delete("/:id", async (req, res) => {
  try {
    const [result] = await pool.execute("DELETE FROM users WHERE id = ?", [req.params.id]);
    if (!result.affectedRows) return res.status(404).json({ error: "User not found" });
    res.status(204).send();
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: err.message });
  }
});

router.post("/login", async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: "Missing email or password" });

  try {
    const [rows] = await pool.execute("SELECT * FROM users WHERE email = ?", [email]);
    if (!rows.length) return res.status(401).json({ error: "Invalid credentials" });

    const user = rows[0];
    const match = await bcrypt.compare(password, user.password_hash);
    if (!match) return res.status(401).json({ error: "Invalid credentials" });

    res.json({ id: user.id, name: user.name, email: user.email });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
