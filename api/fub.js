// Serverless Vercel function to forward contact form submissions to Follow Up Boss
// Set your Follow Up Boss API key in Vercel as the environment variable `FUB_API_KEY`.
// Example: in Vercel dashboard > Project > Settings > Environment Variables -> add FUB_API_KEY

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const apiKey = process.env.FUB_API_KEY;
  if (!apiKey) {
    return res.status(500).json({ error: 'Missing Follow Up Boss API key (FUB_API_KEY)' });
  }

  const { firstName, lastName, email, phone, comments, countryCode } = req.body || {};

  // Basic validation
  if (!firstName && !lastName && !email && !phone) {
    return res.status(400).json({ error: 'Missing required contact fields' });
  }

  // Build person payload according to Follow Up Boss API expectations.
  // If you need different fields or to create a Lead instead, edit this code.
  const payload = {
    firstName: firstName || undefined,
    lastName: lastName || undefined,
    emails: email ? [{ value: email, type: 'home' }] : undefined,
    phones: phone ? [{ value: phone, type: 'mobile' }] : undefined,
    // Add a note with the comments and source
    notes: comments ? [{ text: `Website contact form:\n${comments}` }] : undefined,
    // Optional custom source/tag to help identify origin in Follow Up Boss
    source: 'Website - 1428 Brickell'
  };

  // Remove undefined keys
  Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);

  const auth = 'Basic ' + Buffer.from(apiKey + ':').toString('base64');

  try {
    // Create or update person in Follow Up Boss
    const resp = await fetch('https://api.followupboss.com/v1/people', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': auth
      },
      body: JSON.stringify(payload)
    });

    const data = await resp.json().catch(() => ({}));

    if (!resp.ok) {
      return res.status(resp.status).json({ error: 'FUB API error', details: data });
    }

    // Optionally you can create a lead or add tags here using other FUB endpoints.

    return res.status(200).json({ success: true, fub: data });
  } catch (err) {
    return res.status(500).json({ error: 'Integration error', details: String(err) });
  }
}
