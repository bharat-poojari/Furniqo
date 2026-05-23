const { getDb } = require('../config/database');
const { v4: uuidv4 } = require('uuid');

// Helper functions for common database operations

const findAll = async (table, conditions = {}, orderBy = null, limit = null, offset = null) => {
  const db = getDb();
  let query = `SELECT * FROM ${table}`;
  const params = [];

  if (Object.keys(conditions).length > 0) {
    const whereClause = Object.keys(conditions)
      .map(key => `${key} = ?`)
      .join(' AND ');
    query += ` WHERE ${whereClause}`;
    params.push(...Object.values(conditions));
  }

  if (orderBy) {
    query += ` ORDER BY ${orderBy}`;
  }

  if (limit) {
    query += ` LIMIT ${limit}`;
  }

  if (offset) {
    query += ` OFFSET ${offset}`;
  }

  return await db.all(query, params);
};

const findById = async (table, id, idField = '_id') => {
  const db = getDb();
  return await db.get(`SELECT * FROM ${table} WHERE ${idField} = ?`, id);
};

const create = async (table, data) => {
  const db = getDb();
  const id = data._id || uuidv4();
  const fields = Object.keys({ ...data, _id: id });
  const placeholders = fields.map(() => '?').join(',');
  const values = fields.map(field => data[field] !== undefined ? data[field] : null);
  
  const query = `INSERT INTO ${table} (${fields.join(',')}) VALUES (${placeholders})`;
  await db.run(query, values);
  
  return await findById(table, id);
};

const update = async (table, id, data, idField = '_id') => {
  const db = getDb();
  const fields = Object.keys(data);
  const setClause = fields.map(field => `${field} = ?`).join(',');
  const values = [...fields.map(field => data[field]), id];
  
  const query = `UPDATE ${table} SET ${setClause} WHERE ${idField} = ?`;
  await db.run(query, values);
  
  return await findById(table, id, idField);
};

const remove = async (table, id, idField = '_id') => {
  const db = getDb();
  const result = await db.run(`DELETE FROM ${table} WHERE ${idField} = ?`, id);
  return result.changes > 0;
};

const count = async (table, conditions = {}) => {
  const db = getDb();
  let query = `SELECT COUNT(*) as count FROM ${table}`;
  const params = [];

  if (Object.keys(conditions).length > 0) {
    const whereClause = Object.keys(conditions)
      .map(key => `${key} = ?`)
      .join(' AND ');
    query += ` WHERE ${whereClause}`;
    params.push(...Object.values(conditions));
  }

  const result = await db.get(query, params);
  return result.count;
};

module.exports = {
  findAll,
  findById,
  create,
  update,
  remove,
  count
};