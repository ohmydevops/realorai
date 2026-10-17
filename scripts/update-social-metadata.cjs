const fs = require('node:fs');
const path = require('node:path');
const origin = 'https://ohmydevops.github.io/realorai/';
for (const file of [
  'index.html',
  'en/index.html',
  'fa/index.html',
  'sources/index.html',
  'en/sources/index.html',
]) {
  const target = path.join(__dirname, '../public', file);
  let html = fs.readFileSync(target, 'utf8');
  const english = file.startsWith('en/');
  const language = english ? 'en' : 'fa';
  const depth = file.split('/').length - 1;
  const base = '../'.repeat(depth);
  const title = html.match(/<title>([^<]+)<\/title>/)[1];
  const description =
    html.match(/<meta\s+name="description"\s+content="([^"]+)"/s)?.[1] ||
    (english
      ? 'Photo credits and sources for Real or AI?'
      : 'منبع عکس‌ها و نام عکاس‌های بازی واقعیه یا هوش مصنوعیه؟');
  const url =
    origin +
    (file === 'index.html' || file === 'fa/index.html'
      ? ''
      : file.replace('index.html', ''));
  const image = `${origin}social/og-${language}.png`;
  const alt = english
    ? 'Real or AI? Five images, five guesses, beside an illustrated question card.'
    : 'واقعیه یا هوش مصنوعیه؟ پنج تا عکس، پنج تا حدس، در کنار یک کارت با علامت سؤال.';
  html = html.replace(
    /<meta\b[^>]*(?:property|name)="(?:og:|twitter:)[^"]*"[^>]*>\s*/g,
    '',
  );
  html = html.replace(
    /<link\b[^>]*rel="(?:icon|apple-touch-icon|manifest)"[^>]*>\s*/g,
    '',
  );
  const metadata = `
    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="${english ? 'Real or AI?' : 'واقعیه یا هوش مصنوعیه؟'}" />
    <meta property="og:title" content="${title}" />
    <meta property="og:description" content="${description}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:locale" content="${english ? 'en_US' : 'fa_IR'}" />
    <meta property="og:locale:alternate" content="${english ? 'fa_IR' : 'en_US'}" />
    <meta property="og:image" content="${image}" />
    <meta property="og:image:secure_url" content="${image}" />
    <meta property="og:image:type" content="image/png" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${alt}" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${title}" />
    <meta name="twitter:description" content="${description}" />
    <meta name="twitter:image" content="${image}" />
    <meta name="twitter:image:alt" content="${alt}" />
    <link rel="icon" href="${base}favicon.svg" type="image/svg+xml" />
    <link rel="icon" href="${base}favicon-32.png" type="image/png" sizes="32x32" />
    <link rel="apple-touch-icon" href="${base}apple-touch-icon.png" sizes="180x180" />
    <link rel="manifest" href="${base}site.webmanifest" />
`;
  html = html.replace('</head>', metadata + '  </head>');
  fs.writeFileSync(target, html);
}
