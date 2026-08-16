const https = require('https');
const http = require('http');

/**
 * Extract Google Drive File ID from URL
 */
function extractDriveFileId(url) {
  if (!url) return null;
  const match = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || url.match(/id=([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

/**
 * Native HTTP/HTTPS request helper supporting redirects (0 npm dependencies required)
 */
function fetchStream(url, maxRedirects = 5) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) return reject(new Error('Too many redirects'));

    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
      }
    }, (res) => {
      // Handle HTTP redirects (301, 302, 303, 307, 308)
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          const parsed = new URL(url);
          redirectUrl = `${parsed.protocol}//${parsed.host}${redirectUrl}`;
        }
        return fetchStream(redirectUrl, maxRedirects - 1).then(resolve).catch(reject);
      }
      if (res.statusCode >= 200 && res.statusCode < 300) {
        resolve(res);
      } else {
        reject(new Error(`HTTP Status ${res.statusCode}`));
      }
    });

    req.on('error', reject);
  });
}

/**
 * Stream file directly from Google Drive to Express response using native HTTPS
 * Completely hides drive.google.com so address bar never shows Drive URL!
 */
async function streamDriveFile(driveUrl, filename, res) {
  const fileId = extractDriveFileId(driveUrl);
  if (!fileId) return false;

  try {
    const directUrl = `https://drive.google.com/uc?export=download&confirm=t&id=${fileId}`;
    const streamRes = await fetchStream(directUrl);

    const cleanName = (filename || 'Document_THANHBUITDH').replace(/[^a-zA-Z0-9_-]/g, '_') + '.zip';
    res.setHeader('Content-Disposition', `attachment; filename="${cleanName}"`);
    res.setHeader('Content-Type', streamRes.headers['content-type'] || 'application/octet-stream');

    streamRes.pipe(res);
    return true;
  } catch (err) {
    console.error('[Drive Stream Error]:', err.message);
    return false;
  }
}

module.exports = { extractDriveFileId, streamDriveFile };
