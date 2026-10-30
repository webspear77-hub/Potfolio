import { PortfolioContent } from '../types/portfolio';

// Automatically uses relative '/api' on Netlify or custom VITE_API_BASE_URL
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || '/api';

/**
 * Fetch latest portfolio content from MySQL
 */
export async function fetchRemoteContent(): Promise<PortfolioContent | null> {
  try {
    const res = await fetch(`${API_BASE_URL}/content`, {
      method: 'GET',
      headers: { 'Accept': 'application/json' }
    });
    if (!res.ok) return null;
    const json = await res.json();
    if (json.success && json.data) {
      return json.data as PortfolioContent;
    }
  } catch (err) {
    console.warn('Could not fetch remote content from database:', err);
  }
  return null;
}

/**
 * Save updated portfolio content to MySQL
 */
export async function saveRemoteContent(content: PortfolioContent): Promise<boolean> {
  try {
    const res = await fetch(`${API_BASE_URL}/content`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(content)
    });
    const json = await res.json();
    return !!json.success;
  } catch (err) {
    console.error('Failed to save content to database:', err);
    return false;
  }
}

/**
 * Submit contact message to MySQL (table: contact_messages)
 */
export async function submitContactMessage(payload: {
  name: string;
  email: string;
  category: string;
  message: string;
}): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/contact`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    });
    const json = await res.json();
    return {
      success: !!json.success,
      message: json.message || (json.success ? 'Message sent successfully!' : json.error || 'Failed to send message.')
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Network error while contacting database.'
    };
  }
}

/**
 * Submit CV request to MySQL (table: cv_requests)
 */
export async function submitCvRequest(email: string): Promise<{ success: boolean; message: string }> {
  try {
    const res = await fetch(`${API_BASE_URL}/cv_request`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ email })
    });
    const json = await res.json();
    return {
      success: !!json.success,
      message: json.message || (json.success ? 'CV Request submitted!' : json.error || 'Failed to submit.')
    };
  } catch (err: any) {
    return {
      success: false,
      message: err.message || 'Network error while submitting CV request.'
    };
  }
}
