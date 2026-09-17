// GET /api/list
// Returns previously saved files (newest first) so the user can re-download them later.
import { list } from '@vercel/blob';

export default async function handler(req, res) {
  if (req.method !== 'GET') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const { blobs } = await list();
    const files = blobs
      .sort((a, b) => new Date(b.uploadedAt) - new Date(a.uploadedAt))
      .map(b => ({
        url: b.url,
        filename: b.pathname,
        uploadedAt: b.uploadedAt,
        size: b.size,
      }));
    res.status(200).json({ files });
  } catch (err) {
    res.status(500).json({ error: err.message || 'তালিকা লোড ব্যর্থ হয়েছে' });
  }
}
