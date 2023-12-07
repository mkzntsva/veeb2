const mysql = require('mysql2');
const dbConfig = require('../../../vp23config');
const dataBase = 'if23_marina_kusnetsova';

const pool = mysql.createPool({
	host: dbConfig.configData.host,
	user: dbConfig.configData.user,
	password: dbConfig.configData.password,
	dataBase: dataBase,
	connectionLimit: 5
});

exports.pool = pool;