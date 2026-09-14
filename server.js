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
  '.json': 'application/json'
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
      if (!err && stats.isDirectory()) {
        filePath = path.join(filePath, 'index.html');
      }

      const ext = path.extname(filePath).toLowerCase();

      fs.readFile(filePath, (readErr, content) => {
        if (readErr) {
          res.writeHead(404, { 'Content-Type': 'text/plain; charset=utf-8' });
          res.end('404 Not Found');
        } else {
          res.writeHead(200, {
            'Content-Type': MIME[ext] || 'application/octet-stream',
            'Cache-Control': 'no-cache, no-store, must-revalidate'
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
