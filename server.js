const { createServer } = require('http');
const { parse } = require('url');
const next = require('next');
const path = require('path');

const dev = false;
const hostname = 'localhost';
const port = 3000;

// Point to your ADMIN folder where Next.js app lives
const app = next({ 
  dev, 
  hostname, 
  port,
  dir: path.join(__dirname, 'ADMIN')
});

const handle = app.getRequestHandler();

let server;

async function startServer() {
  console.log('🚀 Preparing Next.js server...');
  await app.prepare();
  
  return new Promise((resolve, reject) => {
    server = createServer(async (req, res) => {
      try {
        const parsedUrl = parse(req.url, true);
        await handle(req, res, parsedUrl);
      } catch (err) {
        console.error('Error occurred handling', req.url, err);
        res.statusCode = 500;
        res.end('Internal server error');
      }
    });

    server.listen(port, (err) => {
      if (err) {
        reject(err);
        return;
      }
      console.log(`✅ Next.js server ready on http://${hostname}:${port}`);
      resolve();
    });

    server.on('error', (error) => {
      console.error('❌ Server error:', error);
      reject(error);
    });
  });
}

function stopServer() {
  if (server) {
    server.close(() => {
      console.log('🛑 Next.js server stopped');
    });
  }
}

module.exports = { startServer, stopServer };