# SQLInjection-Lab

Este proyecto nace de un error real que cometí cuando empecé a construir mi primera app: [iot-web-app](https://github.com/pedroecheverria/iot-web-app), que fue parte de mi proyecto de grado.  
En ese momento no sabía mucho sobre seguridad en el backend, y escribí código que hoy sé que era vulnerable a ataques como SQL Injection (¡por suerte después lo mejoré antes de entregarlo!).

Tiempo después, al volver a revisar el proyecto con una mirada más enfocada en la seguridad, me encontré con varias cosas que estaban mal y decidí crear este laboratorio para entenderlas, mostrarlas y corregirlas paso a paso.

Este lab está hecho para mostrar, paso a paso y desde lo básico, cómo esos errores se ven en acción. Y cómo se pueden corregir.

OBS: Esto hoy lo hice usando MySQL. En mi proyecto de grado use MongoDB. 
---

## ✅ Mejoras implementadas en este segundo commit

* Uso de un archivo `.env` para dejar de hardcodear credenciales en `index.js`.
* Clave secreta del token JWT protegida por variable de entorno.
* Validación del email con formato correcto en el registro.
* Validación de contraseña con longitud mínima de seguridad.
* Hashing de contraseñas con `bcrypt` antes de almacenarlas.
* Consulta del usuario solo por el email y comparación con `bcrypt.compareSync()`.
* Generación de tokens JWT de forma segura.
* Manejo de errores sin exponer mensajes internos del sistema.

---

## 🚀 Cómo levantar el proyecto

1. Crear la base de datos:

```sql
CREATE DATABASE SQLInjection;

USE SQLInjection;

CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL
);
```

2. Crear el archivo `.env` con tu configuración:

```
DB_HOST=localhost
DB_USER=root
DB_PASSWORD=
DB_NAME=SQLInjection
JWT_SECRET=tu_clave_secreta
PORT=3001
```

3. Instalar dependencias y correr:

```bash
npm install
node index.js
```

---

## 📬 Endpoints disponibles

### Registro

```
POST http://localhost:3001/users/register
```

Body:

```json
{
  "name": "Pedro",
  "email": "pedro@example.com",
  "password": "123456"
}
```

### Login

```
POST http://localhost:3001/users/login
```

Body:

```json
{
  "email": "pedro@example.com",
  "password": "123456"
}
```

---

## 🧠 Notas finales

⚠️ Ojo: no crean que ahora soy un experto en desarrollo ni en seguridad.  
Soy solo alguien apasionado, como muchos de ustedes, que sigue aprendiendo algo nuevo cada día.

¡Y sí, varias de estas no las tuve en cuenta cuando hice la app, y todavía viven en mi repo con esos errores jaja!