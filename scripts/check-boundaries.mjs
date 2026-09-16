import { readdirSync, readFileSync, existsSync } from 'node:fs';
import { join } from 'node:path';
function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
    e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)],
  );
}
const files = walk('src');
for (const file of files) {
  if (!/\.(?:tsx?|mjs|astro)$/.test(file)) continue;
  const text = readFileSync(file, 'utf8');
  if (
    /DATABASE_URL|SESSION_SECRET|GOOGLE_CLIENT_SECRET|GITHUB_CLIENT_SECRET|from ['"](?:pg|node:crypto)['"]/.test(
      text,
    )
  )
    throw new Error('Server credential or database dependency in frontend: ' + file);
}
const pkg = JSON.parse(readFileSync('package.json', 'utf8'));
if (pkg.dependencies.pg || pkg.dependencies.nodemailer) throw new Error('Backend dependency in frontend');
if (existsSync('.next/static'))
  for (const file of walk('.next/static')) {
    if (
      /\.(?:js|html)$/.test(file) &&
      /API_PROXY_SECRET|DATABASE_URL|SESSION_SECRET/.test(readFileSync(file, 'utf8'))
    )
      throw new Error('Server configuration in browser output: ' + file);
  }
for (const file of files) {
  if (/admin_members|admin_sessions|ADMIN_BOOTSTRAP_EMAIL/.test(readFileSync(file, 'utf8')))
    throw new Error('Private administrator implementation in service repository: ' + file);
}
console.log('Repository and browser boundaries verified.');

if (files.some((file) => file.endsWith('.astro'))) throw new Error('Legacy UI template');
