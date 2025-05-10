// modules/user.js

module.exports.createUser = (db, userData, callback) => {
  const query = `
    INSERT INTO users (name, email, password)
    VALUES ('${userData.name}', '${userData.email}', '${userData.password}')
  `;
  console.log("QUERY EJECUTADA:", query); // Para mostrar cómo se forma la inyección
  db.query(query, callback);
};
