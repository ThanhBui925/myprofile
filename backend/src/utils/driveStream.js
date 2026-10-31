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
function fetchStream(url, maxRedirects = 5, cookies = []) {
  return new Promise((resolve, reject) => {
    if (maxRedirects <= 0) return reject(new Error('Too many redirects'));

    const lib = url.startsWith('https') ? https : http;
    const req = lib.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
        'Cookie': cookies.join('; ')
      }
    }, (res) => {
      // Collect new cookies
      let newCookies = [...cookies];
      if (res.headers['set-cookie']) {
        const parsedCookies = res.headers['set-cookie'].map(c => c.split(';')[0]);
        newCookies = [...new Set([...cookies, ...parsedCookies])];
      }

      // Handle HTTP redirects (301, 302, 303, 307, 308)
      if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
        let redirectUrl = res.headers.location;
        if (!redirectUrl.startsWith('http')) {
          const parsed = new URL(url);
          redirectUrl = `${parsed.protocol}//${parsed.host}${redirectUrl}`;
        }
        return fetchStream(redirectUrl, maxRedirects - 1, newCookies).then(resolve).catch(reject);
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

    // If Google Drive returns an HTML page instead of a file (e.g., virus scan warning for large files)
    // we must abort the stream and return false to trigger the iframe fallback viewer.
    if (streamRes.headers['content-type'] && streamRes.headers['content-type'].includes('text/html')) {
      return false;
    }

    let ext = '.zip';
    if (streamRes.headers['content-disposition']) {
      const match = streamRes.headers['content-disposition'].match(/filename="?([^"]+)"?/);
      if (match && match[1].includes('.')) {
        ext = '.' + match[1].split('.').pop();
      }
    } else if (streamRes.headers['content-type']) {
      if (streamRes.headers['content-type'].includes('application/pdf')) ext = '.pdf';
      else if (streamRes.headers['content-type'].includes('application/vnd.rar')) ext = '.rar';
      else if (streamRes.headers['content-type'].includes('image/jpeg')) ext = '.jpg';
      else if (streamRes.headers['content-type'].includes('image/png')) ext = '.png';
    }

    const cleanName = (filename || 'Document_THANHBUITDH').replace(/[^a-zA-Z0-9_-]/g, '_') + ext;
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
