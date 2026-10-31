import mysql from 'mysql2/promise';

let pool: mysql.Pool | null = null;

export function getPool() {
  if (!pool) {
    pool = mysql.createPool({
      host: process.env.DB_HOST || 'srv2213.hstgr.io',
      user: process.env.DB_USER || 'u835254770_Smitaportfolio',
      password: process.env.DB_PASSWORD || '',
      database: process.env.DB_NAME || 'u835254770_Smitaportfolio',
      port: Number(process.env.DB_PORT) || 3306,
      waitForConnections: true,
      connectionLimit: 5,
      queueLimit: 0,
      connectTimeout: 10000
    });
  }
  return pool;
}
