const fs = require('node:fs');
const path = require('node:path');
const assert = require('node:assert/strict');
const origin = 'https://ohmydevops.github.io/realorai/';
for (const file of [
  'index.html',
  'fa/index.html',
  'en/index.html',
  'sources/index.html',
  'en/sources/index.html',
]) {
  const html = fs.readFileSync('public/' + file, 'utf8');
  const en = file.startsWith('en/');
  const sources = file.includes('sources/');
  const suffix = sources ? (en ? 'en/sources/' : 'sources/') : en ? 'en/' : '';
  assert.equal(
    html.match(/rel="canonical"\s+href="([^"]+)"/)[1],
    origin + suffix,
  );
  assert.equal(
    (html.match(/<h1[ >]/g) || []).length,
    1,
    `One main heading: ${file}`,
  );
  assert.equal(
    (html.match(/<footer>/g) || []).length,
    1,
    `Shared footer: ${file}`,
  );
  const description = html.match(/name="description"\s+content="([^"]+)"/)[1];
  assert(description.length > 40 && description.length < 180);
  assert(
    !/five|پنج/i.test(description),
    'Promotional copy must not fix the round length',
  );
  for (const [language, destination] of [
    ['fa', sources ? 'sources/' : ''],
    ['en', sources ? 'en/sources/' : 'en/'],
  ]) {
    assert(
      new RegExp(
        `hreflang="${language}"\\s+href="${origin + destination}"`,
      ).test(html),
    );
  }
  const structured = [
    ...html.matchAll(
      /<script type="application\/ld\+json">([\s\S]*?)<\/script>/g,
    ),
  ];
  assert.equal(structured.length, 1);
  const data = JSON.parse(structured[0][1]);
  assert.equal(data['@context'], 'https://schema.org');
  if (!sources) {
    assert(
      html.includes('class="home-art"'),
      'Home should have visible initial content without JS',
    );
    assert(html.includes('href="#play"'));
    assert(
      data['@graph'].some(
        (item) =>
          item['@type'] === 'WebApplication' && item.url === origin + suffix,
      ),
    );
  }
  for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
    if (/^https?:/.test(match[1])) continue;
    const local = match[1].split('#')[0];
    assert(
      fs.existsSync(path.resolve('public', path.dirname(file), local)),
      `Broken local reference: ${file}: ${local}`,
    );
  }
}
const sitemap = fs.readFileSync('public/sitemap.xml', 'utf8');
for (const suffix of ['', 'en/', 'sources/', 'en/sources/'])
  assert(sitemap.includes(`<loc>${origin + suffix}</loc>`));
assert(!sitemap.includes('/fa/'), 'Do not submit a duplicate canonical alias');
console.log(
  'PASS: canonical URLs, language links, metadata, structured data, static Home, shared footers, sitemap, and local links.',
);

const languages = ['fa', 'en', 'ar', 'tr', 'fr', 'ru'];
for (const lang of languages) {
  for (const page of [
    '',
    'about/',
    'history/',
    'guide/',
    'sources/',
    'ai-for-business/',
    'image-generators/',
  ]) {
    const suffix = (lang === 'fa' ? '' : `${lang}/`) + page;
    const file = suffix + 'index.html';
    const html = fs.readFileSync('public/' + file, 'utf8');
    assert(
      html.includes(
        `<html lang="${lang}" dir="${['fa', 'ar'].includes(lang) ? 'rtl' : 'ltr'}">`,
      ),
    );
    assert.equal(
      html.match(/rel="canonical"\s+href="([^"]+)"/)[1],
      origin + suffix,
    );
    assert(sitemap.includes(`<loc>${origin + suffix}</loc>`));
    assert(html.includes('class="language-menu"'));
    assert.equal((html.match(/<main[ >]/g) || []).length, 1);
    assert.equal((html.match(/id="theme-toggle"/g) || []).length, 1);
    for (const alternate of languages) {
      const destination =
        origin + (alternate === 'fa' ? '' : `${alternate}/`) + page;
      assert(
        new RegExp(`hreflang="${alternate}"\\s+href="${destination}"`).test(
          html,
        ),
      );
    }
    for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
      if (/^https?:/.test(match[1])) continue;
      assert(
        fs.existsSync(
          path.resolve('public', path.dirname(file), match[1].split('#')[0]),
        ),
        `Broken reference: ${file}: ${match[1]}`,
      );
    }
  }
}
console.log(
  'PASS: all six languages have complete page routes, reciprocal SEO links, language controls and valid local assets.',
);
