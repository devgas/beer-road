#!/usr/bin/env node
'use strict';

// Downloads free (CC0 / CC BY-SA / public domain) beer & brewery photos from
// Wikimedia Commons and saves them into client/public/images.
// No API key required. We query the Commons API for real, existing files so we
// never guess filenames. Each category downloads one verified image.

const fs = require('fs');
const path = require('path');
const https = require('https');

const OUT_DIR = path.join(__dirname, '..', 'client', 'static', 'images');

// [target filename, commons search query]
const QUERIES = [
  ['brewery-01.jpg', 'Pilsner Urquell brewery'],
  ['brewery-02.jpg', 'Budweiser Budvar brewery'],
  ['brewery-03.jpg', 'Staropramen brewery Prague'],
  ['brewery-04.jpg', 'Velke Popovice Kozel brewery'],
  ['brewery-05.jpg', 'Krusovice brewery'],
  ['brewery-06.jpg', 'Radegast brewery'],
  ['brewery-07.jpg', 'Starobrno brewery'],
  ['brewery-08.jpg', 'brewery building exterior'],
  ['beer-ipa.jpg', 'India pale ale glass'],
  ['beer-stout.jpg', 'stout beer glass'],
  ['beer-porter.jpg', 'porter beer glass'],
  ['beer-pilsner.jpg', 'pilsner beer glass'],
  ['beer-lager.jpg', 'lager beer glass'],
  ['beer-saison.jpg', 'saison beer glass'],
  ['beer-farmhouse.jpg', 'saison beer farmhouse brewery'],
  ['beer-sour.jpg', 'sour beer glass'],
  ['challenge-beginner.jpg', 'beer tasting'],
  ['challenge-style.jpg', 'beer flight'],
  ['challenge-social.jpg', 'friends beer'],
  ['challenge-travel.jpg', 'beer pub interior'],
  ['challenge-barrel.jpg', 'beer barrels'],
];

const UA = 'BeerRoad/1.0 (https://github.com/devgas/beer-road; contact: beerroad@example.com)';

function sleep(ms) {
  return new Promise((r) => setTimeout(r, ms));
}

async function getJson(url) {
  await sleep(1500);
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { 'User-Agent': UA } }, (res) => {
        let body = '';
        res.on('data', (c) => (body += c));
        res.on('end', () => {
          try {
            resolve(JSON.parse(body));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on('error', reject);
  });
}

function download(url) {
  return new Promise((resolve, reject) => {
    const run = (u) => {
      const opts = {
        headers: {
          'User-Agent':
            'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0 Safari/537.36',
          Accept: 'image/avif,image/webp,image/png,image/*,*/*;q=0.8',
          Referer: 'https://commons.wikimedia.org/',
        },
      };
      https.get(u, opts, (res) => {
        if (res.statusCode === 429) {
          setTimeout(() => run(u), 3000);
          return;
        }
        if (res.statusCode >= 300 && res.statusCode < 400 && res.headers.location) {
          https.get(res.headers.location, opts, (r2) => collect(r2, resolve, reject)).on('error', reject);
          return;
        }
        collect(res, resolve, reject);
      }).on('error', reject);
    };
    run(url);
  });
}

function collect(res, resolve, reject) {
  const chunks = [];
  res.on('data', (c) => chunks.push(c));
  res.on('end', () => {
    const buf = Buffer.concat(chunks);
    const ct = res.headers['content-type'] || '';
    if (res.statusCode !== 200 || !ct.startsWith('image/')) {
      reject(new Error(`bad response ${res.statusCode} ${ct}`));
      return;
    }
    resolve(buf);
  });
  res.on('error', reject);
}

async function findImage(query) {
  const api =
    'https://commons.wikimedia.org/w/api.php' +
    '?action=query&format=json&generator=search&gsrnamespace=6' +
    `&gsrsearch=${encodeURIComponent(query)}&gsrlimit=10` +
    '&prop=imageinfo&iiprop=url%7Cmime%7Cextmetadata&iiurlwidth=900';
  const data = await getJson(api);
  const pages = data.query && data.query.pages ? Object.values(data.query.pages) : [];
  for (const p of pages) {
    const info = p.imageinfo && p.imageinfo[0];
    if (!info) continue;
    if (!String(info.mime || '').startsWith('image/')) continue;
    const meta = info.extmetadata || {};
    const license = (meta.LicenseShortName && meta.LicenseShortName.value) || '';
    const restricted = /non-free|fair use|restricted/i.test(license);
    if (restricted) continue;
    return { url: info.thumburl, title: p.title, license };
  }
  return null;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const manifest = [];
  let ok = 0;
  for (const [target, query] of QUERIES) {
    const dest = path.join(OUT_DIR, target);
    try {
      const found = await findImage(query);
      if (!found) {
        console.error(`FAIL ${target} (${query}): no free image found`);
        continue;
      }
      const buf = await download(found.url);
      fs.writeFileSync(dest, buf);
      manifest.push({ target, source: found.title, license: found.license, bytes: buf.length });
      console.log(`OK  ${target}  <- ${found.title}  [${found.license}]  ${buf.length}b`);
      ok += 1;
    } catch (e) {
      console.error(`FAIL ${target} (${query}): ${e.message}`);
    }
  }
  fs.writeFileSync(
    path.join(OUT_DIR, 'manifest.json'),
    JSON.stringify(manifest, null, 2)
  );
  console.log(`\nDone: ${ok}/${QUERIES.length} downloaded.`);
}

main();
