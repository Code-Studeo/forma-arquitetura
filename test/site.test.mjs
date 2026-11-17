import test from 'node:test';
import assert from 'node:assert/strict';
import { readFile, stat } from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { dirname, join } from 'node:path';

const root = dirname(dirname(fileURLToPath(import.meta.url)));
const html = await readFile(join(root, 'index.html'), 'utf8');
const css = await readFile(join(root, 'styles.css'), 'utf8');
const js = await readFile(join(root, 'app.js'), 'utf8');

test('documento institucional em português sem rótulos fictícios ou contatos inventados', () => {
  assert.match(html, /<html lang="pt-BR">/);
  assert.match(html, /Espaços que fazem/);
  assert.doesNotMatch(html, /lorem ipsum/i);
  assert.doesNotMatch(html, /fictício|fictícia|conceitual|demonstrativo|ilustrativo|personagem fictícia/i);
  assert.doesNotMatch(html, /Rua das Amendoeiras|4000-2026|Clara Nogueira|Tomás Reis|Júlia Prado/);
  assert.match(html, /formulário ainda não está conectado/i);
});

test('cinco projetos usam os cinco assets locais fornecidos', async () => {
  const cards = html.match(/class="project-card[^"]*"/g) ?? [];
  assert.equal(cards.length, 5);
  for (const image of ['hero.jpg', 'ambiente.jpg', 'destaque-01.jpg', 'destaque-02.jpg', 'detalhe.jpg']) {
    assert.ok(html.includes(`public/images/${image}`), `${image} referenciada`);
    const imagePath = join(root, 'public', 'images', image);
    assert.ok((await stat(imagePath)).size > 100_000, `${image} tem tamanho válido`);
  }
});

test('interações principais e acessibilidade estão conectadas', () => {
  for (const token of ['data-filter', 'data-project', 'role="tablist"', 'project-dialog', 'brief-form', 'aria-live']) {
    assert.ok(html.includes(token), `${token} no documento`);
  }
  for (const token of ['IntersectionObserver', 'showModal()', 'reportValidity()', 'prefers-reduced-motion']) {
    assert.ok(js.includes(token) || css.includes(token), `${token} implementado`);
  }
});

test('movimento respeita preferência de movimento reduzido', () => {
  assert.match(css, /prefers-reduced-motion:\s*reduce/);
});
