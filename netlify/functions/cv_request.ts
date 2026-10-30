import type { Handler } from '@netlify/functions';
import { getPool } from './db';

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'POST, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  'Content-Type': 'application/json'
};

export const handler: Handler = async (event) => {
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  try {
    const data = JSON.parse(event.body || '{}');
    const email = (data.email || '').trim();

    if (!email || !email.includes('@')) {
      return {
        statusCode: 400,
        headers,
        body: JSON.stringify({ success: false, error: 'Valid email is required.' })
      };
    }

    const pool = getPool();
    const [result]: any = await pool.query(
      'INSERT INTO cv_requests (email) VALUES (?)',
      [email]
    );

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'CV request recorded in MySQL successfully.',
        id: result?.insertId
      })
    };
  } catch (err: any) {
    console.error('Error saving CV request to MySQL:', err);
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ success: false, error: err.message })
    };
  }
};
