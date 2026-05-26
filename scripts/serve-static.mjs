import http from 'node:http';
import { createReadStream, existsSync, statSync } from 'node:fs';
import { extname, join, normalize, resolve } from 'node:path';

const root = resolve(process.cwd());
const port = Number(process.env.PORT || 5173);
const host = process.env.HOST || '127.0.0.1';
const types = {
  '.html': 'text/html; charset=utf-8',
  '.css': 'text/css; charset=utf-8',
  '.js': 'text/javascript; charset=utf-8',
  '.json': 'application/json; charset=utf-8',
  '.mp3': 'audio/mpeg',
  '.mp4': 'video/mp4',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.webp': 'image/webp',
  '.svg': 'image/svg+xml; charset=utf-8'
};

function send(res, status, body, type = 'text/plain; charset=utf-8') {
  res.writeHead(status, { 'content-type': type, 'x-content-type-options': 'nosniff' });
  res.end(body);
}

const server = http.createServer((req, res) => {
  const rawPath = decodeURIComponent(new URL(req.url, 'http://' + host + ':' + port).pathname);
  const cleanPath = normalize(rawPath).replace(/^([/\\])+/, '');
  let filePath = resolve(join(root, cleanPath || 'index.html'));
  if (!filePath.startsWith(root)) return send(res, 403, 'Forbidden');
  if (existsSync(filePath) && statSync(filePath).isDirectory()) filePath = join(filePath, 'index.html');
  if (!existsSync(filePath)) return send(res, 404, 'Not found');

  res.writeHead(200, {
    'content-type': types[extname(filePath).toLowerCase()] || 'application/octet-stream',
    'x-content-type-options': 'nosniff',
    'cache-control': 'no-cache'
  });
  createReadStream(filePath).pipe(res);
});

server.listen(port, host, () => {
  console.log('Ultah Kay Web running at http://' + host + ':' + port);
});
