require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');
const mysql = require('mysql');
const usersRouter = require('./routes/users');

const app = express();
app.use(express.json());
app.use(cors());
app.use(morgan('tiny'));

// Conexión MySQL usando .env. Usamos el objeto db para guardar la conexión a la base de datos. En este caso, usamos mysql.createConnection() para crear una conexión a la base de datos MySQL. Esta conexión se usará en las rutas para interactuar con la base de datos.
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME
});

// Conexión a la base de datos. Usamos db.connect() para conectar a la base de datos MySQL. Si hay un error, lanzamos una excepción. Si la conexión es exitosa, mostramos un mensaje en la consola.
db.connect((err) => {
  if (err) throw err;
  console.log('✅ Conectado a MySQL');
});

app.set('db', db); // Guardamos la conexión en el objeto app para usarla en las rutas. Posteriormene, en las rutas, podemos acceder a la conexión usando req.app.get('db').
app.use('/users', usersRouter); // Usamos el router de usuarios. En este caso, usamos app.use() para usar el router de usuarios en la ruta /users. Esto significa que todas las rutas definidas en el router de usuarios estarán disponibles en la ruta /users.

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server corriendo en puerto ${PORT}`);
});
