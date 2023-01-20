const mysql = require('mysql');

module.exports = {
  getCon: () => mysql.createConnection({
    host: "localhost",
    user: "airbnb",
    password: "comp206pw",
    database: "comp206_airbnb"
  }),
  functions: mysql
};