import db from './db.js';

export default async function handler(req, res) {
  const [rows] = await db.execute('SELECT * FROM users');
  res.json(rows);
}
