// Vercel serverless function to proxy RSS feeds
export default async function handler(req, res) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight requests
  if (req.method === 'OPTIONS') {
    res.status(200).end();
    return;
  }

  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { url } = req.query;
    
    if (!url) {
      res.status(400).json({ error: 'URL parameter is required' });
      return;
    }

    // Fetch the RSS feed
    const response = await fetch(url);
    
    if (!response.ok) {
      res.status(response.status).json({ error: 'Failed to fetch RSS feed' });
      return;
    }

    const xmlText = await response.text();
    
    // Set appropriate headers
    res.setHeader('Content-Type', 'application/xml');
    res.status(200).send(xmlText);
    
  } catch (error) {
    console.error('RSS proxy error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
