const db = require('../database/config');

/**
 * Execute a transaction with the given queries
 * @param {Array<{text: string, values: Array<any>}>} queries - Array of query objects
 * @returns {Promise<Array<any>>} - Results of the queries
 */
async function executeTransaction(queries) {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');
    const results = [];
    
    for (const query of queries) {
      const result = await client.query(query.text, query.values);
      results.push(result);
    }
    
    await client.query('COMMIT');
    return results;
  } catch (e) {
    await client.query('ROLLBACK');
    throw e;
  } finally {
    client.release();
  }
}

/**
 * Insert a record into the specified table
 * @param {string} table - Table name
 * @param {Object} data - Data to insert
 * @returns {Promise<any>} - Inserted record
 */
async function insertRecord(table, data) {
  const columns = Object.keys(data);
  const values = Object.values(data);
  const placeholders = values.map((_, i) => `$${i + 1}`);
  
  const query = {
    text: `
      INSERT INTO ${table} (${columns.join(', ')})
      VALUES (${placeholders.join(', ')})
      RETURNING *
    `,
    values
  };
  
  const result = await db.query(query.text, query.values);
  return result.rows[0];
}

/**
 * Update a record in the specified table
 * @param {string} table - Table name
 * @param {string} id - Record ID
 * @param {Object} data - Data to update
 * @returns {Promise<any>} - Updated record
 */
async function updateRecord(table, id, data) {
  const columns = Object.keys(data);
  const values = Object.values(data);
  const setClause = columns.map((col, i) => `${col} = $${i + 1}`).join(', ');
  
  const query = {
    text: `
      UPDATE ${table}
      SET ${setClause}
      WHERE id = $${values.length + 1}
      RETURNING *
    `,
    values: [...values, id]
  };
  
  const result = await db.query(query.text, query.values);
  return result.rows[0];
}

/**
 * Delete a record from the specified table
 * @param {string} table - Table name
 * @param {string} id - Record ID
 * @returns {Promise<boolean>} - Success status
 */
async function deleteRecord(table, id) {
  const query = {
    text: `DELETE FROM ${table} WHERE id = $1`,
    values: [id]
  };
  
  const result = await db.query(query.text, query.values);
  return result.rowCount > 0;
}

/**
 * Get a record by ID from the specified table
 * @param {string} table - Table name
 * @param {string} id - Record ID
 * @returns {Promise<any>} - Retrieved record
 */
async function getRecordById(table, id) {
  const query = {
    text: `SELECT * FROM ${table} WHERE id = $1`,
    values: [id]
  };
  
  const result = await db.query(query.text, query.values);
  return result.rows[0];
}

/**
 * Get records with pagination from the specified table
 * @param {string} table - Table name
 * @param {Object} options - Pagination options
 * @returns {Promise<{data: Array<any>, total: number}>} - Records and total count
 */
async function getPaginatedRecords(table, { page = 1, limit = 10, orderBy = 'id', order = 'ASC' }) {
  const offset = (page - 1) * limit;
  
  const countQuery = {
    text: `SELECT COUNT(*) FROM ${table}`
  };
  
  const dataQuery = {
    text: `
      SELECT *
      FROM ${table}
      ORDER BY ${orderBy} ${order}
      LIMIT $1 OFFSET $2
    `,
    values: [limit, offset]
  };
  
  const [countResult, dataResult] = await Promise.all([
    db.query(countQuery.text),
    db.query(dataQuery.text, dataQuery.values)
  ]);
  
  return {
    data: dataResult.rows,
    total: parseInt(countResult.rows[0].count)
  };
}

module.exports = {
  executeTransaction,
  insertRecord,
  updateRecord,
  deleteRecord,
  getRecordById,
  getPaginatedRecords
}; 