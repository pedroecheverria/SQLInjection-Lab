const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mysql = require('mysql');
const usersRouter = require('./routes/users');

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

// Conexión MySQL (❌ hardcodeada para este commit vulnerable)
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 's3rv3r_t3s1s', 
  database: 'sqlinjection'
});

db.connect((err) => {
  if (err) throw err;
  console.log('✅ Conectado a MySQL');
});

// Hacer que la conexión esté disponible globalmente
app.set('db', db);

// Rutas
app.use('/users', usersRouter);

// Listener
app.listen(3001, () => {
  console.log('Server corriendo en puerto 3001');
});
