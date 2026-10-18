const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');

const context = { window: {} };
vm.runInNewContext(fs.readFileSync('public/images.js', 'utf8'), context);
const images = context.window.QUIZ_IMAGES;
const activeImages = images.filter((image) => image.active !== false);
assert(images.length >= 100);
assert.equal(new Set(images.map((image) => image.id)).size, images.length);
assert(images.some((image) => image.real));
assert(images.some((image) => !image.real));
for (const directory of ['photos', 'ai images']) {
  const listed = new Set(images.map((image) => image.src));
  for (const filename of fs.readdirSync(path.join('public', directory))) {
    assert(
      listed.has(directory + '/' + filename),
      'Unlisted quiz asset: ' + filename,
    );
  }
}

assert(
  activeImages.every((image) =>
    ['Cars', 'Portrait'].includes(image.category.en),
  ),
);
for (const [category, maximum] of [
  ['Cars', 150],
  ['Portrait', 600],
]) {
  const collection = activeImages.filter(
    (image) => image.category.en === category,
  );
  assert(
    collection.length <= maximum,
    `Keep at most ${maximum} playable ${category} images`,
  );
  assert(
    activeImages.some((image) => image.real && image.category.en === category),
  );
  assert(
    activeImages.some((image) => !image.real && image.category.en === category),
  );
}
for (const [category, real, ai] of [
  ['Cars', 120, 30],
  ['Portrait', 470, 130],
]) {
  const collection = activeImages.filter(
    (image) => image.category.en === category,
  );
  assert.equal(collection.filter((image) => image.real).length, real);
  assert.equal(collection.filter((image) => !image.real).length, ai);
}
assert.equal(
  new Set(images.map((image) => image.src)).size,
  images.length,
  'Every entry must use a distinct local image',
);
for (const image of images) {
  assert.equal(typeof image.real, 'boolean');
  assert(
    image.category.en && image.category.fa,
    `Missing translations: ${image.id}`,
  );
  assert(image.credit, `Missing credit: ${image.id}`);
  assert(
    fs.existsSync(path.join('public', image.src)),
    `Missing image: ${image.src}`,
  );
  assert(!image.src.startsWith('http'), 'Quiz assets must be local');
  const bytes = fs.readFileSync(path.join('public', image.src));
  assert(
    image.src.endsWith('.jpg') && bytes.readUInt16BE(0) === 0xffd8,
    `Use the same JPEG delivery format for both labels: ${image.id}`,
  );
  assert(bytes.length <= 140 * 1024, `Oversized quiz image: ${image.id}`);
  let offset = 2;
  let dimensions;
  while (offset + 9 < bytes.length) {
    assert.equal(bytes[offset], 0xff, `Invalid JPEG marker: ${image.id}`);
    const marker = bytes[offset + 1];
    if ([0xc0, 0xc1, 0xc2].includes(marker)) {
      dimensions = {
        height: bytes.readUInt16BE(offset + 5),
        width: bytes.readUInt16BE(offset + 7),
      };
      break;
    }
    offset += 2 + bytes.readUInt16BE(offset + 2);
  }
  assert(
    dimensions && Math.max(dimensions.width, dimensions.height) <= 1000,
    `Quiz image exceeds the shared resolution limit: ${image.id}`,
  );
}
const medianBytes = (real) => {
  const sizes = activeImages
    .filter((image) => image.real === real)
    .map((image) => fs.statSync(path.join('public', image.src)).size)
    .sort((a, b) => a - b);
  return sizes[Math.floor(sizes.length / 2)];
};
const sizeRatio = medianBytes(false) / medianBytes(true);
assert(
  sizeRatio >= 0.67 && sizeRatio <= 1.5,
  'Real and AI images should have comparable median download sizes',
);
for (const [file, language, direction] of [
  ['index.html', 'fa', 'rtl'],
  ['en/index.html', 'en', 'ltr'],
  ['fa/index.html', 'fa', 'rtl'],
]) {
  const html = fs.readFileSync(path.join('public', file), 'utf8');
  assert(html.includes(`lang="${language}"`));
  assert(html.includes(`dir="${direction}"`));
  for (const token of [
    'rel="canonical"',
    'hreflang="fa"',
    'hreflang="en"',
    'name="description"',
    'application/ld+json',
    '<h1',
  ]) {
    assert(html.includes(token), `Missing SEO tag ${token} in ${file}`);
  }
  assert(html.includes('https://ohmydevops.github.io/realorai/'));
  assert(!html.includes('chatgpt.site'));
  for (const match of html.matchAll(/(?:src|href)="([^"#]+)"/g)) {
    const reference = match[1];
    if (/^https?:/.test(reference)) continue;
    const target = path.resolve('public', path.dirname(file), reference);
    assert(
      fs.existsSync(target),
      `Broken local reference: ${file} -> ${reference}`,
    );
  }
}
console.log(
  'PASS: local assets, unique IDs, credits, language metadata, Pages URLs, and relative links.',
);

// Umami is the only approved external runtime resource.
const analyticsURL = 'https://cloud.umami.is/script.js';
const analyticsID = 'e334ba0d-1ec4-4ab7-b4c1-2c1f1477f33b';
for (const file of [
  'index.html',
  'en/index.html',
  'fa/index.html',
  'sources/index.html',
  'en/sources/index.html',
]) {
  const html = fs.readFileSync(path.join('public', file), 'utf8');
  let analyticsCount = 0;
  for (const resource of html.matchAll(/<(?:script|link)\b[^>]*>/g)) {
    if (!/\bsrc=|rel="(?:stylesheet|preload)"/.test(resource[0])) continue;
    if (resource[0].includes(`src="${analyticsURL}"`)) {
      assert(resource[0].includes(`data-website-id="${analyticsID}"`));
      assert(resource[0].includes('data-domains="ohmydevops.github.io"'));
      assert(/\bdefer\b/.test(resource[0]));
      analyticsCount++;
      continue;
    }
    assert(
      !/(?:src|href)="(?:https?:)?\/\//.test(resource[0]),
      'External runtime resource',
    );
  }
  assert.equal(analyticsCount, 1, `Exactly one Umami script required: ${file}`);
  const helper = html.indexOf('analytics.js');
  const consumer = html.indexOf(
    file.includes('sources/') ? 'sources.js' : 'app.js',
  );
  assert(
    helper >= 0 && helper < consumer,
    `Analytics helper loads first: ${file}`,
  );
}
const css = fs.readFileSync('public/style.css', 'utf8');
assert(!/@import/.test(css), 'No CSS imports');
for (const match of css.matchAll(/url\(['"]?([^)'"\s]+)/g)) {
  assert(!/^https?:/.test(match[1]), 'No CDN fonts');
  assert(
    fs.existsSync(path.join('public', match[1])),
    `Missing font: ${match[1]}`,
  );
}
console.log(
  'PASS: self-hosted site assets and one approved Umami script per page.',
);

console.log(
  'PASS: cars and portraits within category limits, with real and AI available in each.',
);

for (const file of [
  'index.html',
  'en/index.html',
  'fa/index.html',
  'sources/index.html',
  'en/sources/index.html',
]) {
  const html = fs.readFileSync(path.join('public', file), 'utf8');
  const language = file.startsWith('en/') ? 'en' : 'fa';
  const ogImage = html.match(/property="og:image"\s+content="([^"]+)"/)[1];
  assert.equal(
    ogImage,
    `https://ohmydevops.github.io/realorai/social/og-${language}.png`,
  );
  assert(html.includes('name="twitter:card" content="summary_large_image"'));
  assert(html.includes('property="og:image:alt"'));
  assert.equal((html.match(/property="og:title"/g) || []).length, 1);
  assert(html.includes('class="brand"'));
  for (const link of html.matchAll(
    /<link[^>]+rel="(?:icon|apple-touch-icon|manifest)"[^>]+href="([^"]+)"/g,
  )) {
    assert(fs.existsSync(path.resolve('public', path.dirname(file), link[1])));
  }
  const png = fs.readFileSync(`public/social/og-${language}.png`);
  assert.equal(png.readUInt32BE(16), 1200);
  assert.equal(png.readUInt32BE(20), 630);
}
console.log(
  'PASS: localized social cards, PNG dimensions, shared title, and page icons.',
);
