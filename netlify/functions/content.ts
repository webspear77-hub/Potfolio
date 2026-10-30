import type { Handler } from '@netlify/functions';
import { getPool } from './db';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  const pool = getPool();

  if (event.httpMethod === 'GET') {
    try {
      const [rows]: any = await pool.query(
        'SELECT content_json, updated_at FROM portfolio_content ORDER BY id DESC LIMIT 1'
      );
      if (rows && rows.length > 0 && rows[0].content_json) {
        const data = JSON.parse(rows[0].content_json);
        return {
          statusCode: 200,
          headers,
          body: JSON.stringify({ success: true, data, updated_at: rows[0].updated_at })
        };
      }
      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({ success: true, data: null, message: 'Using default content' })
      };
    } catch (err: any) {
      console.error('Error fetching content from MySQL:', err);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ success: false, error: err.message })
      };
    }
  }

  if (event.httpMethod === 'POST') {
    try {
      const raw = event.body;
      if (!raw) {
        return { statusCode: 400, headers, body: JSON.stringify({ success: false, error: 'Empty payload' }) };
      }

      JSON.parse(raw); // validate JSON

      const [result]: any = await pool.query(
        'INSERT INTO portfolio_content (content_json) VALUES (?)',
        [raw]
      );

      return {
        statusCode: 200,
        headers,
        body: JSON.stringify({
          success: true,
          message: 'Saved to Hostinger MySQL successfully',
          id: result?.insertId
        })
      };
    } catch (err: any) {
      console.error('Error saving content to MySQL:', err);
      return {
        statusCode: 500,
        headers,
        body: JSON.stringify({ success: false, error: err.message })
      };
    }
  }

  return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
};
