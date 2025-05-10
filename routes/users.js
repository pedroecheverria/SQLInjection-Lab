const express = require('express');
const router = express.Router();
const userModule = require('../models/user');

router.post('/register', (req, res) => {
  const db = req.app.get('db');
  const { name, email, password } = req.body;

  const user = { name, email, password }; // ❌ sin validación, sin sanitización

  userModule.createUser(db, user, (err, result) => {
    if (err) {
      console.log("ERROR:", err);
      return res.status(500).json({ status: 'failed', error: err });
    }
    return res.status(200).json({ status: 'success', result });
  });
});

router.post('/login', (req, res) => {
  const db = req.app.get('db');
  const { email, password } = req.body;

  const query = `SELECT * FROM users WHERE email = '${email}' AND password = '${password}'`;

  console.log("QUERY:", query);

  db.query(query, (err, results) => {
    if (err) return res.status(500).json({ error: err });

    if (results.length > 0) {
      return res.status(200).json({ status: 'success', user: results[0] });
    } else {
      return res.status(401).json({ status: 'failed', error: 'Credenciales inválidas' });
    }
  });
});


module.exports = router;

