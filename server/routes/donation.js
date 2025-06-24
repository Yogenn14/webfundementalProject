const express = require("express");
const router = express.Router();
const pool = require("../db"); 
const { v4: uuidv4 } = require("uuid");
const Stripe = require('stripe');
const stripe = Stripe(process.env.STRIPE_SECRET_KEY); 


router.post("/", async (req, res) => {
  let { user_id, amount, email, type, paymentMethod } = req.body;
  
  if (!amount) return res.status(400).json({ error: "Amount is required" });

  user_id = user_id || null;

  try {
    const [result] = await pool.execute(
      `INSERT INTO donations (id, user_id, amount, donated_at, email, paymentMethod, type)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        uuidv4(),
        user_id,
        amount,
        new Date(),
        email || null,
        paymentMethod || null,
        type || null
      ]
    );

    res.status(201).json({ success: true, insertedId: result.insertId });
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Failed to insert donation" });
  }
});

router.get("/success", async (req, res) => {
  const { amount, email, type, paymentMethod, user_id } = req.query;
  const io = req.app.get('io');

  try {
    await pool.execute(
      `INSERT INTO donations (id, user_id, amount, donated_at, email, paymentMethod, type)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [
        uuidv4(),
        user_id || null,
        amount,
        new Date(),
        email || null,
        paymentMethod || null,
        type || null
      ]
    );
      io.emit('donationAdded', { message: 'donationAdded' });

    res.redirect("/thankyou.html");
  } catch (err) {
    console.error("Insert failed:", err);
    res.status(500).send("Failed to record donation");
  }
});





//creditcard stripe
router.post('/creditCard', async (req, res) => {
  const { amount, email, type, paymentMethod, user_id } = req.body;

  console.log("stripe amount", amount);

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: [{
      price_data: {
        currency: 'usd',
        product_data: {
          name: 'Donation',
        },
        unit_amount: parseInt(amount) * 100,
      },
      quantity: 1,
    }],
    success_url: `http://localhost:3000/donations/success?amount=${amount}&email=${email}&type=${type}&paymentMethod=${paymentMethod}&user_id=${user_id || ''}`,
    cancel_url: 'http://localhost:5500/cancel.html', 
  });

  res.json({ url: session.url });
});

router.get("/user/:user_id", async (req, res) => {
  const { user_id } = req.params;

  try {
    const [rows] = await pool.execute(
      "SELECT * FROM donations WHERE user_id = ?",
      [user_id]
    );

    res.json(rows);
  } catch (err) {
    console.error("Failed to fetch donations by user_id:", err);
    res.status(500).json({ error: "Failed to fetch donations" });
  }
});


router.get("/stat/progress", async (req, res) => {
  const goal = 10000;

  try {
    const [rows] = await pool.execute(`
      SELECT SUM(amount) AS total2025 
      FROM donations 
      WHERE YEAR(donated_at) = 2025
    `);

    const total = rows[0].total2025 || 0;
    const percentage = ((total / goal) * 100).toFixed(2);

    res.json({
      total: parseFloat(total),
      goal,
      percentage: parseFloat(percentage),
    });
  } catch (err) {
    console.error("Failed to fetch donation progress:", err);
    res.status(500).json({ error: "Failed to fetch progress" });
  }
});


router.get("/latest/:limit", async (req, res) => {
  const limit = parseInt(req.params.limit) || 10;

 
  try {
    const [rowsLatest] = await pool.execute(
      `SELECT * FROM donations 
       WHERE email IS NOT NULL 
       ORDER BY donated_at DESC 
       LIMIT ?`,
      [limit]
    );

    res.json(rowsLatest);
  } catch (err) {
    console.error("Failed to fetch latest donors:", err);
    res.status(500).json({ error: "Failed to fetch donors" });
  }
});


module.exports = router;
