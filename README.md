# SQLInjection-Lab

Este proyecto nace de un error real que cometí cuando empecé a construir mi primera app: (https://github.com/pedroecheverria/iot-web-app), que fue parte de mi proyecto de grado.  

A mis inicios no sabía mucho sobre seguridad en el backend, y escribí código que hoy sé que era vulnerable a ataques como SQL Injection (¡por suerte después lo mejoré antes de entregarlo!).

Tiempo después, al volver a revisar el proyecto con una mirada más enfocada en la seguridad, me encontré con varias cosas que estaban mal y decidí crear este laboratorio para entenderlas, mostrarlas y corregirlas paso a paso.

Este lab está hecho para mostrar, paso a paso y desde lo básico, cómo esos errores se ven en acción. Y más adelante, cómo podemos corregirlos.

⚠️ Ojo: no crean que ahora soy un experto en desarrollo ni en seguridad. Soy solo alguien apasionado, como muchos de ustedes, que sigue aprendiendo algo nuevo cada día.


---

## 🚀 ¿Qué hace este lab?

En este primer commit, vas a encontrar:
- Un servidor Express muy simple.
- Registro de usuarios que guarda directamente en MySQL.
- Un login vulnerable a SQL Injection.
- Nada de validación, ni hashing, ni variables de entorno.
- Todo como lo hice la primera vez, sin saber que eso era riesgoso.

Anécdota: Me acuerdo que cuando logré que el registro y el login funcionaran por primera vez, como si hubiera logrado algo grande… Estaba re orgulloso sin tener idea de todo lo que estaba mal detrás del código. Supongo que es cierto eso de que a veces la ignorancia nos hace felices... y bueno, yo estaba feliz. 😄

---

## 🧪 Cómo levantar el lab

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

2. Cloná el proyecto y corré:

```bash
git clone https://github.com/pedroecheverria/SQLInjection-Lab.git
cd SQLInjection-Lab
npm install
node index.js
```

> Verificá que tu MySQL corra en `localhost` con usuario `root` sin contraseña, o cambiá eso en `index.js`.

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

### Login vulnerable

```
POST http://localhost:3001/users/login
```

Body con SQL Injection:

```json
{
  "email": "",
  "password": "' OR ''='"
}
```

Esto genera un query como:

```sql
SELECT * FROM users WHERE email = '' AND password = '' OR ''=''
```

Y permite entrar sin tener la contraseña real.

---

## 🛠 ¿Qué haremos en el segundo commit?

Vamos a implementar varias mejoras de seguridad que aprendí luego de hacer las cosas mal:

* Usar un archivo `.env` para dejar de hardcodear credenciales en `index.js`.
* Validar que el email tenga formato correcto en el registro.
* Validar que la contraseña cumpla mínimos de seguridad.
* Buscar al usuario solo por el email y luego comparar la contraseña usando `bcrypt`.
* Generar un token JWT solo si las credenciales son correctas.
* Mover la clave del token JWT a una variable de entorno.
* Evitar construir consultas SQL con inputs del usuario directamente.
* Manejar errores sin exponer mensajes internos del sistema.

¡Y sí, varias de estas no las tuve en cuenta cuando hice la app, y todavía están ahí, guardadas en mi repo como prueba de todo lo que no sabía jaja!

---

Este proyecto es simplemente eso: una forma de compartir lo que aprendí haciendo, equivocándome, y luego mejorando.  
Si te sirve para no repetir los mismos errores, ya valió la pena. 🙂