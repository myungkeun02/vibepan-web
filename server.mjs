import next from 'next';
import { createServer } from 'node:http';
const dev = process.argv.includes('--dev');
const port = Number(process.env.PORT || 4310);
const hostname = process.env.HOST || '127.0.0.1';
process.env.VIBEPAN_CUSTOM_SERVER = '1';
const app = next({ dev, hostname, port });
await app.prepare();
const handler = app.getRequestHandler();
const server = createServer((req, res) => {
  let address = req.socket.remoteAddress || 'unknown';
  if (process.env.TRUST_PROXY === '1')
    address = String(req.headers['x-forwarded-for'] || address)
      .split(',')[0]
      .trim();
  req.headers['x-vibepan-remote-address'] = address;
  handler(req, res);
});
server.requestTimeout = 60000;
server.headersTimeout = 30000;
server.listen(port, hostname, () => console.log('Frontend ready on port ' + port));
let closing = false;
async function close() {
  if (closing) return;
  closing = true;
  server.close();
  await app.close();
  process.exit(0);
}
process.on('SIGTERM', close);
process.on('SIGINT', close);
