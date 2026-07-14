import assert from 'node:assert/strict';
import { createRequire } from 'node:module';
import { readFileSync, statSync } from 'node:fs';
import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { parse } from 'parse5';

const require = createRequire(import.meta.url);
const { parse: parseCss } = require('css-tree');

const root = dirname(fileURLToPath(import.meta.url));
const PRODUCTION_ORIGIN = 'https://saqlainswebsite.vercel.app';
const RECURSION_LINK = 'https://www.linkedin.com/posts/saqlain-musa_artificialabrintelligence-cybersecurity-activity-7422552460696698880-RLNL?utm_source=share&utm_medium=member_desktop&rcm=ACoAACD3yM8BSyqSc7F2ugwZkJdAE3Rl_HWABmA';
const EXPECTED_FIELD_NOTE_IMAGES = 6;
const EXPECTED_PROJECTS = 4;
const htmlPath = join(root, 'index.html');
const html = readFileSync(htmlPath, 'utf8');
const parseErrors = [];
const document = parse(html, {
  sourceCodeLocationInfo: true,
  onParseError(error) {
    parseErrors.push(error);
  }
});

function walk(node, visit) {
  visit(node);
  for (const child of node.childNodes ?? []) walk(child, visit);
  if (node.content) walk(node.content, visit);
}

function attributes(node) {
  return Object.fromEntries((node.attrs ?? []).map(({ name, value }) => [name, value]));
}

function textContent(node) {
  let value = '';
  walk(node, current => {
    if (current.nodeName === '#text') value += current.value;
  });
  return value.trim();
}

const nodesByTagIndex = new Map();
const nodesByIdIndex = new Map();
walk(document, node => {
  if (node.tagName) {
    const matches = nodesByTagIndex.get(node.tagName) ?? [];
    matches.push(node);
    nodesByTagIndex.set(node.tagName, matches);
  }
  const id = attributes(node).id;
  if (id) nodesByIdIndex.set(id, node);
});

function nodesByTag(tagName) {
  return nodesByTagIndex.get(tagName) ?? [];
}

function nodeById(id) {
  return nodesByIdIndex.get(id);
}

function classIncludes(node, className) {
  return (attributes(node).class ?? '').split(/\s+/).includes(className);
}

function descendants(node, predicate) {
  const matches = [];
  walk(node, current => {
    if (current !== node && predicate(current)) matches.push(current);
  });
  return matches;
}

function assertNonemptyFile(path, label) {
  assert.doesNotThrow(() => {
    assert.ok(statSync(path).size > 0, 'Empty ' + label);
  }, 'Missing or unreadable ' + label);
}

assert.deepEqual(parseErrors, [], 'HTML should parse without errors');
assert.equal(nodesByTag('h1').length, 1, 'Page should contain exactly one h1');

for (const id of ['top', 'main', 'experience', 'builds', 'credentials', 'writing', 'contact', 'projectDialog']) {
  assert.ok(nodeById(id), 'Missing required id #' + id);
}

const title = textContent(nodesByTag('title')[0]);
assert.match(title, /Saqlain Momin/);
assert.match(title, /GRC/);
assert.ok(!html.includes('Mahmood'), 'Old surname must not remain');
assert.ok(!html.includes('youremail@domain.com'), 'Placeholder contact must not remain');
for (const confidentialName of ['Marvell Semiconductor', 'Airtel Money', 'OneOncology']) {
  assert.ok(!html.includes(confidentialName), 'Confidential client name leaked: ' + confidentialName);
}
assert.ok(!html.includes('—'), 'Project copy should follow the no-em-dash rule');

const images = nodesByTag('img');
const fieldNoteImages = images.filter(image => image.parentNode && (
  classIncludes(image.parentNode, 'note-media') || classIncludes(image.parentNode, 'note-featured-media')
));
assert.equal(fieldNoteImages.length, EXPECTED_FIELD_NOTE_IMAGES, 'Every Field Note needs a cover image');
for (const image of images) {
  const attrs = attributes(image);
  assert.ok(attrs.alt?.trim(), 'Every image needs descriptive alt text: ' + attrs.src);
  assert.ok(attrs.width && attrs.height, 'Every image needs dimensions: ' + attrs.src);
}

const localAssetExtensions = /\.(?:svg|png|webp|mp4|pdf|woff2)$/i;
const localAssets = new Set();
walk(document, node => {
  const attrs = attributes(node);
  for (const name of ['src', 'href', 'poster', 'data-media', 'data-poster']) {
    const value = attrs[name];
    if (!value || !localAssetExtensions.test(value) || /^(?:https?:|mailto:)/.test(value)) continue;
    localAssets.add(value);
  }
});
for (const asset of localAssets) {
  assertNonemptyFile(join(root, asset), 'local asset: ' + asset);
}

for (const link of nodesByTag('a')) {
  const attrs = attributes(link);
  if (attrs.target === '_blank') {
    assert.match(attrs.rel ?? '', /\bnoopener\b/, 'External target=_blank link needs noopener: ' + attrs.href);
  }
}

const dialog = nodeById('projectDialog');
assert.equal(attributes(dialog)['aria-labelledby'], 'dialogTitle');
assert.equal(attributes(dialog)['aria-describedby'], 'dialogDescription');
const projectElements = nodesByTag('article').filter(node => attributes(node)['data-project']);
const projectTriggers = nodesByTag('button').filter(node => classIncludes(node, 'project-demo'));
assert.equal(projectElements.length, EXPECTED_PROJECTS, 'Expected one flagship and three supporting projects');
assert.equal(projectTriggers.length, EXPECTED_PROJECTS * 2 - 1, 'CyberAssess needs one demo trigger; supporting projects need two');

const cyberAssess = projectElements.find(node => attributes(node)['data-project'] === 'cyberassess');
assert.ok(cyberAssess, 'CyberAssess project is required');
assert.equal(descendants(cyberAssess, node => classIncludes(node, 'project-demo')).length, 1, 'CyberAssess should open its demo from one button');
assert.equal(descendants(cyberAssess, node => node.tagName === 'img').length, 0, 'CyberAssess flagship card should be text-only');

const featuredNote = nodesByTag('a').find(node => classIncludes(node, 'note-featured'));
assert.equal(attributes(featuredNote).href, RECURSION_LINK, 'Featured Field Note should use the supplied LinkedIn URL');

assert.match(html, /@media\(prefers-reduced-motion:reduce\)/, 'Reduced-motion styles are required');
const particleCanvas = nodeById('particleCanvas');
assert.ok(particleCanvas, 'Site-wide particle canvas is required');
assert.equal(particleCanvas.parentNode.tagName, 'body', 'Particle canvas should be site-wide, not nested in the hero');
assert.match(html, /#particleCanvas\{/, 'Particle canvas needs site-wide positioning styles');
assert.match(html, /\.is-scrolled nav/, 'Scrolled navigation needs an isolated visual surface');
assert.match(html, /\.is-scrolled \.status-bar/, 'Availability status should leave when scrolling begins');
assert.match(html, /projectDialog\.showModal/, 'Project demos should use a modal dialog');
assert.match(html, /dialogMedia\.replaceChildren/, 'Dialog media should be removed when closed');
assert.match(html, /navLinks\.classList/, 'Mobile navigation should use progressive enhancement');

const executableScripts = nodesByTag('script').filter(node => {
  const attrs = attributes(node);
  return !attrs.src && attrs.type !== 'application/ld+json';
});
for (const script of executableScripts) {
  const source = textContent(script);
  assert.doesNotThrow(() => new Function(source), 'Inline JavaScript should compile');
}

for (const style of nodesByTag('style')) {
  assert.doesNotThrow(() => parseCss(textContent(style)), 'Inline CSS should parse');
}

const jsonLdScript = nodesByTag('script').find(node => attributes(node).type === 'application/ld+json');
assert.ok(jsonLdScript, 'JSON-LD is required');
let jsonLd;
assert.doesNotThrow(() => {
  jsonLd = JSON.parse(textContent(jsonLdScript));
}, 'JSON-LD should be valid JSON');

const canonical = nodesByTag('link').find(node => attributes(node).rel === 'canonical');
const ogUrl = nodesByTag('meta').find(node => attributes(node).property === 'og:url');
const ogImage = nodesByTag('meta').find(node => attributes(node).property === 'og:image');
const twitterImage = nodesByTag('meta').find(node => attributes(node).name === 'twitter:image');
const canonicalUrl = attributes(canonical).href;
const expectedPageUrl = PRODUCTION_ORIGIN + '/';
const expectedOgImage = PRODUCTION_ORIGIN + '/og/og-image.png';
assert.equal(canonicalUrl, expectedPageUrl, 'Canonical URL should use the production origin');
assert.equal(attributes(ogUrl).content, expectedPageUrl, 'OG URL should match the canonical URL');
assert.equal(jsonLd.url, expectedPageUrl, 'JSON-LD URL should match the canonical URL');
assert.equal(attributes(ogImage).content, expectedOgImage, 'OG image should use the production origin');
assert.equal(attributes(twitterImage).content, expectedOgImage, 'Twitter image should match the OG image');
assertNonemptyFile(join(root, 'og', 'og-image.png'), 'local OG image');

const robots = readFileSync(join(root, 'robots.txt'), 'utf8');
const sitemap = readFileSync(join(root, 'sitemap.xml'), 'utf8');
assert.match(robots, new RegExp('Sitemap: ' + PRODUCTION_ORIGIN.replace(/[.*+?^${}()|[\]\\]/g, '\\$&') + '/sitemap\\.xml'));
assert.ok(sitemap.includes('<loc>' + expectedPageUrl + '</loc>'), 'Sitemap URL should match the canonical URL');
assert.ok(html.includes('Synthetic demo data'), 'CyberAssess media must disclose synthetic demo data');

for (const date of ['2026-02-09', '2026-03-12', '2026-03-25', '2026-03-30', '2026-04-06', '2026-04-08']) {
  assert.ok(html.includes('datetime="' + date + '"'), 'Missing corrected Field Note date ' + date);
}

const vercelConfigPath = join(root, '..', 'vercel.json');
assertNonemptyFile(vercelConfigPath, 'root vercel.json');
const vercelConfig = JSON.parse(readFileSync(vercelConfigPath, 'utf8'));
assert.equal(vercelConfig.outputDirectory, 'site-v2');

console.log('site-v2 smoke test passed');
console.log('  HTML parse errors: 0');
console.log('  Local assets checked: ' + localAssets.size);
console.log('  Images with alt text and dimensions: ' + images.length);
console.log('  Project dialog triggers: ' + projectTriggers.length);
