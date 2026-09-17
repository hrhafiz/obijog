// POST /api/save
// body: { filename: string, base64: string, contentType?: string }
// Uploads the file to Vercel Blob storage and returns a public URL.
import { put } from '@vercel/blob';

export const config = {
  api: { bodyParser: { sizeLimit: '15mb' } }
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }
  try {
    const { filename, base64, contentType } = req.body || {};
    if (!filename || !base64) {
      res.status(400).json({ error: 'filename ও base64 প্রয়োজন' });
      return;
    }
    const buffer = Buffer.from(base64, 'base64');
    const blob = await put(filename, buffer, {
      access: 'public',
      contentType: contentType || 'application/octet-stream',
      addRandomSuffix: true,
    });
    res.status(200).json({ url: blob.url, filename: blob.pathname, uploadedAt: new Date().toISOString() });
  } catch (err) {
    res.status(500).json({ error: err.message || 'আপলোড ব্যর্থ হয়েছে' });
  }
}
