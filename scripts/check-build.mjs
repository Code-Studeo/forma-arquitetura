import { access, readFile } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const required = [
  'index.html', 'styles.css', 'app.js', 'server.mjs', 'README.md',
  'public/favicon.svg',
  'public/images/hero.jpg', 'public/images/ambiente.jpg',
  'public/images/destaque-01.jpg', 'public/images/destaque-02.jpg',
  'public/images/detalhe.jpg'
];

for (const path of required) await access(join(root, path));

const html = await readFile(join(root, 'index.html'), 'utf8');
const assets = [...html.matchAll(/(?:src|href)="(public\/[^\"]+)"/g)].map(match => match[1]);
for (const asset of assets) await access(join(root, asset));
if (!html.includes('<html lang="pt-BR">')) throw new Error('Idioma do documento ausente.');
if (/lorem ipsum/i.test(html)) throw new Error('Texto provisório encontrado.');

console.log(`Verificação concluída: ${required.length} arquivos-base e ${assets.length} referências locais presentes.`);
