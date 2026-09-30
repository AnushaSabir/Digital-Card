const http = require('http');
const fs = require('fs');
const path = require('path');

const PORTS = [5500, 3000, 8080, 8000];
const MIME = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.json': 'application/json',
  '.mp4': 'video/mp4',
  '.webm': 'video/webm'
};

function startServer(portIndex) {
  if (portIndex >= PORTS.length) {
    console.error('No available ports found.');
    return;
  }
  const port = PORTS[portIndex];
  const server = http.createServer((req, res) => {
    let reqPath = decodeURIComponent(req.url.split('?')[0]);
    if (reqPath === '/') reqPath = '/index.html';
    
    let filePath = path.join(__dirname, reqPath);

    fs.stat(filePath, (err, stats) => {
      if (err) {
        res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
        res.end('404 Not Found');
        return;
      }

      if (stats.isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }

      const ext = path.extname(filePath).toLowerCase();

      // Video Byte-Range Streaming Support (Required for Chrome/Edge HTML5 video)
      if (ext === '.mp4' || ext === '.webm') {
        const range = req.headers.range;
        const fileSize = stats.size;

        if (range) {
          const parts = range.replace(/bytes=/, "").split("-");
          const start = parseInt(parts[0], 10);
          const end = parts[1] ? parseInt(parts[1], 10) : fileSize - 1;
          const chunksize = (end - start) + 1;
          const file = fs.createReadStream(filePath, { start, end });
          const head = {
            'Content-Range': `bytes ${start}-${end}/${fileSize}`,
            'Accept-Ranges': 'bytes',
            'Content-Length': chunksize,
            'Content-Type': MIME[ext] || 'video/mp4',
          };
          res.writeHead(206, head);
          file.pipe(res);
        } else {
          const head = {
            'Content-Length': fileSize,
            'Content-Type': MIME[ext] || 'video/mp4',
            'Accept-Ranges': 'bytes'
          };
          res.writeHead(200, head);
          fs.createReadStream(filePath).pipe(res);
        }
        return;
      }

      fs.readFile(filePath, (readErr, content) => {
        if (readErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('404 Not Found');
        } else {
          res.writeHead(200, {
            'Content-Type': MIME[ext] || 'application/octet-stream',
            'Cache-Control': 'no-cache, no-store, must-revalidate',
            'Accept-Ranges': 'bytes'
          });
          res.end(content);
        }
      });
    });
  });

  server.once('error', (err) => {
    if (err.code === 'EADDRINUSE') {
      console.log(`Port ${port} in use, trying next port...`);
      startServer(portIndex + 1);
    } else {
      console.error(err);
    }
  });

  server.listen(port, () => {
    console.log(`SUCCESS: Digital Card & NextGen AI Engineers running at http://localhost:${port}/`);
  });
}

startServer(0);
