/**
 * Crea las tablas en MySQL ejecutando database/schema.sql (generado desde schema.dbml).
 *
 * Requiere autorizacion explicita: sin el flag --confirm no hace nada.
 * Se niega a correr si la base ya tiene tablas, para no pisar datos.
 *
 * Uso: npm run db:sql && npm run db:create -- --confirm
 */
require('dotenv/config');
const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');

async function main() {
  if (!process.argv.includes('--confirm')) {
    console.error('Bloqueado: crear la base de datos requiere autorizacion. Repite con: npm run db:create -- --confirm');
    process.exit(1);
  }
  const sqlPath = path.resolve(__dirname, '../database/schema.sql');
  if (!fs.existsSync(sqlPath)) {
    console.error('No existe database/schema.sql. Corre primero: npm run db:sql');
    process.exit(1);
  }

  const { DB_HOST, DB_PORT = '3306', DB_USERNAME, DB_PASSWORD = '', DB_DATABASE } = process.env;
  const conn = await mysql.createConnection({
    host: DB_HOST,
    port: Number(DB_PORT),
    user: DB_USERNAME,
    password: DB_PASSWORD,
    multipleStatements: true,
  });

  await conn.query(`CREATE DATABASE IF NOT EXISTS \`${DB_DATABASE}\` CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci`);
  await conn.query(`USE \`${DB_DATABASE}\``);

  const [rows] = await conn.query('SHOW TABLES');
  if (rows.length > 0) {
    console.error(`La base "${DB_DATABASE}" ya tiene ${rows.length} tablas. No se ejecuta nada para no perder datos.`);
    await conn.end();
    process.exit(1);
  }

  await conn.query(fs.readFileSync(sqlPath, 'utf8'));
  const [created] = await conn.query('SHOW TABLES');
  console.log(`OK: ${created.length} tablas creadas en "${DB_DATABASE}". Siguiente paso: npm run seed`);
  await conn.end();
}

main().catch((err) => {
  console.error('db:create fallo:', err.message);
  process.exit(1);
});
