const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const validator = require('validator');
const jwt = require('jsonwebtoken');
const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;

router.post('/register', (req, res) => {
  const db = req.app.get('db'); // Accedemos a la conexión MySQL que guardamos en index.js
  const { name, email, password } = req.body; // Extraemos los datos del cuerpo del request

  // 🚧 Validaciones básicas para evitar datos vacíos
  if (!name || !email || !password) {
    return res.status(400).json({ error: 'Todos los campos son obligatorios.' });
  }

  // ✉️ Validamos que el email tenga formato válido
  if (!validator.isEmail(email)) {
    return res.status(400).json({ error: 'Email inválido.' });
  }

  // Validación de contraseña fuerte: mínimo 6 caracteres, una mayúscula, una minúscula, un número y un símbolo
  if (!passwordRegex.test(password)) {
    return res.status(400).json({
      error: 'La contraseña debe tener al menos una mayúscula, una minúscula, un número y un carácter especial.'
    });
  }

  // 🔒 Encriptamos la contraseña con bcrypt antes de guardarla en la base de datos
  const hashedPassword = bcrypt.hashSync(password, 10);

  // 🕵️‍♂️ Verificamos si ya existe un usuario con ese email
  const checkQuery = 'SELECT * FROM users WHERE email = ?';
  db.query(checkQuery, [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error interno del servidor' });

    // 🚫 Si ya hay un usuario registrado con ese email, devolvemos error 409 (conflict)
    if (results.length > 0) {
      return res.status(409).json({ error: 'El email ya está registrado.' });
    }

    // ✅ Si todo está bien, insertamos el nuevo usuario en la base de datos
    const insertQuery = 'INSERT INTO users (name, email, password) VALUES (?, ?, ?)';
    db.query(insertQuery, [name, email, hashedPassword], (err, result) => {
      if (err) return res.status(500).json({ error: 'Error al registrar el usuario' });

      // 📬 Respondemos con éxito y devolvemos el ID del nuevo usuario
      return res.status(201).json({ status: 'success', userId: result.insertId });
    });
  });
});


router.post('/login', (req, res) => {
  // ingresamos a req.app.get('db') para acceder a la conexión MySQL que guardamos en index.js
  const db = req.app.get('db');
  // Extraemos los datos del cuerpo del request. Capturamos el email y la contraseña del cuerpo de la solicitud.
  const { email, password } = req.body;

  // 🚧 Validaciones básicas para evitar datos vacíos
  if (!email || !password) {
    return res.status(400).json({ error: 'Email y contraseña son requeridos.' });
  }

  const query = 'SELECT * FROM users WHERE email = ?';
  db.query(query, [email], (err, results) => {
    if (err) return res.status(500).json({ error: 'Error interno del servidor' });

    if (results.length === 0) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

  
    const user = results[0];

    // Comparamos la contraseña ingresada con la contraseña encriptada en la base de datos
    const passwordIsValid = bcrypt.compareSync(password, user.password);
    if (!passwordIsValid) {
      return res.status(401).json({ error: 'Credenciales inválidas' });
    }

    // No incluimos la contraseña en el token
    const payload = {
      id: user.id,
      name: user.name,
      email: user.email
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '24h' });

    return res.status(200).json({
      status: 'success',
      token,
      user: payload
    });
  });
});


module.exports = router;


