/**
 * Genera database/schema.sql (MySQL) a partir de ../schema.dbml.
 * NO toca ninguna base de datos: solo escribe el archivo SQL para revisarlo.
 * Uso: npm run db:sql
 */
const fs = require('fs');
const path = require('path');
const { exporter } = require('@dbml/core');

const dbmlPath = path.resolve(__dirname, '../../schema.dbml');
const outPath = path.resolve(__dirname, '../database/schema.sql');

const dbml = fs.readFileSync(dbmlPath, 'utf8');
let sql;
try {
  sql = exporter.export(dbml, 'mysql');
} catch (err) {
  const diags = err.diags ? err.diags.map((d) => `  linea ${d.location?.start?.line}: ${d.message}`).join('\n') : err.message;
  console.error(`schema.dbml tiene errores, no se genero SQL:\n${diags}`);
  process.exit(1);
}

const header = `-- Generado automaticamente desde schema.dbml el ${new Date().toISOString()}\n-- NO editar a mano: modificar schema.dbml y correr "npm run db:sql".\n\n`;
fs.mkdirSync(path.dirname(outPath), { recursive: true });
fs.writeFileSync(outPath, header + sql);
const tables = (sql.match(/CREATE TABLE/g) || []).length;
console.log(`OK: ${tables} tablas -> ${path.relative(process.cwd(), outPath)}`);
