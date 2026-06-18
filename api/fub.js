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
  // Follow Up Boss does not accept `notes` inside the person create payload.
  // We'll create the person first, then create a separate note via /v1/notes.
  const payload = {
    firstName: firstName || undefined,
    lastName: lastName || undefined,
    emails: email ? [{ value: email, type: 'home' }] : undefined,
    phones: phone ? [{ value: phone, type: 'mobile' }] : undefined,
    // Optional custom source/tag to help identify origin in Follow Up Boss
    source: 'Website - 1428 Brickell'
  };

  // Remove undefined keys
  Object.keys(payload).forEach(k => payload[k] === undefined && delete payload[k]);

  const auth = 'Basic ' + Buffer.from(apiKey + ':').toString('base64');

  try {
    console.log('FUB request payload:', payload);
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
    console.log('FUB response status:', resp.status);
    console.log('FUB response body:', data);

    if (!resp.ok) {
      return res.status(resp.status).json({ error: 'FUB API error', details: data });
    }

    // Person created (or found). Now, if comments were provided, create a note.
    // Determine personId from response
    let personId = null;
    if (data && data.id) personId = data.id;
    else if (data && data.personId) personId = data.personId;
    else if (data && data.person && data.person.id) personId = data.person.id;

    if (comments && personId) {
      const notePayload = { personId: personId, text: `Website contact form:\n${comments}` };
      console.log('Creating FUB note payload:', notePayload);
      try {
        const noteResp = await fetch('https://api.followupboss.com/v1/notes', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': auth
          },
          body: JSON.stringify(notePayload)
        });
        const noteData = await noteResp.json().catch(() => ({}));
        console.log('FUB note response status:', noteResp.status);
        console.log('FUB note response body:', noteData);
        if (!noteResp.ok) {
          // Return person creation success but note creation error details
          return res.status(200).json({ success: true, fub: data, noteError: { status: noteResp.status, details: noteData } });
        }
      } catch (err) {
        console.log('FUB note creation error:', String(err));
        return res.status(200).json({ success: true, fub: data, noteError: String(err) });
      }
    }

    return res.status(200).json({ success: true, fub: data });
  } catch (err) {
    return res.status(500).json({ error: 'Integration error', details: String(err) });
  }
}
