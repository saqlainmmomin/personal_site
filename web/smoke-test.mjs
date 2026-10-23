// Smoke test for the Vite build in web/dist. Run `npm run build` first.
// Static checks (assets, metadata, copy rules) always run; browser checks drive headless
// Chromium through playwright-core against a local static server.
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { dirname, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'

const root = dirname(fileURLToPath(import.meta.url))
const dist = join(root, 'dist')
const PRODUCTION_ORIGIN = 'https://saqlainswebsite.vercel.app'
const FEATURED_NOTE_LINK = 'https://the-slow-escape.vercel.app'
const NOTE_DATES = ['2026-02-09', '2026-03-12', '2026-03-25', '2026-03-30', '2026-04-06', '2026-04-08', '2026-08-23']
const SECTIONS = ['top', 'main', 'experience', 'builds', 'credentials', 'writing', 'contact']

const results = []
function ok(name) {
  results.push(name)
  console.log(`  ✓ ${name}`)
}

function size(path) {
  try {
    return statSync(path).size
  } catch {
    return 0
  }
}

function walk(dir) {
  return readdirSync(dir, { withFileTypes: true }).flatMap((e) => (e.isDirectory() ? walk(join(dir, e.name)) : [join(dir, e.name)]))
}

// ---------------------------------------------------------------- static checks
assert.ok(size(join(dist, 'index.html')) > 0, 'web/dist/index.html is missing: run `npm run build` first')
const html = readFileSync(join(dist, 'index.html'), 'utf8')
const contentFiles = walk(join(root, 'src', 'content')).filter((f) => f.endsWith('.ts'))
const contentSource = contentFiles.map((f) => readFileSync(f, 'utf8')).join('\n')
const bundle = walk(join(dist, 'assets'))
  .filter((f) => f.endsWith('.js'))
  .map((f) => readFileSync(f, 'utf8'))
  .join('\n')

console.log('Static checks')

assert.match(html, /<title>[^<]*Saqlain Momin[^<]*GRC/, 'Title should name Saqlain Momin and GRC')
assert.ok(html.includes(`<link rel="canonical" href="${PRODUCTION_ORIGIN}/">`), 'Canonical URL should use the production origin')
assert.ok(html.includes(`content="${PRODUCTION_ORIGIN}/og/og-image.png"`), 'OG image should use the production origin')
const jsonLd = JSON.parse(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(html)?.[1] ?? 'null')
assert.equal(jsonLd?.url, `${PRODUCTION_ORIGIN}/`, 'JSON-LD URL should match the canonical URL')
assert.ok(size(join(dist, 'og', 'og-image.png')) > 0, 'Missing og/og-image.png')
assert.match(readFileSync(join(dist, 'robots.txt'), 'utf8'), new RegExp(`Sitemap: ${PRODUCTION_ORIGIN}/sitemap\\.xml`))
assert.ok(readFileSync(join(dist, 'sitemap.xml'), 'utf8').includes(`<loc>${PRODUCTION_ORIGIN}/</loc>`), 'Sitemap URL should match the canonical URL')
ok('metadata, canonical, JSON-LD, robots, sitemap')

const vercel = JSON.parse(readFileSync(join(root, '..', 'vercel.json'), 'utf8'))
assert.equal(vercel.outputDirectory, 'web/dist', 'vercel.json should deploy web/dist')
ok('vercel.json deploys web/dist')

// Every public path named in the content files must exist in the build output.
const assetPaths = [...new Set([...contentSource.matchAll(/'(\/(?:img|fonts|og)\/[^']+|\/cv\.pdf)'/g)].map((m) => m[1]))]
assert.ok(assetPaths.length >= 15, `Expected the content files to name at least 15 assets, found ${assetPaths.length}`)
for (const p of assetPaths) assert.ok(size(join(dist, p)) > 0, `Missing or empty asset in dist: ${p}`)
ok(`${assetPaths.length} assets named in content exist in dist`)

for (const name of ['Marvell Semiconductor', 'Airtel Money', 'OneOncology']) {
  assert.ok(!bundle.includes(name) && !contentSource.includes(name), `Confidential client name leaked: ${name}`)
}
assert.ok(!contentSource.includes('—'), 'Content should follow the no-em-dash rule')
assert.ok(!bundle.includes('youremail@domain.com') && !bundle.includes('Mahmood'), 'Placeholder or old surname must not remain')
ok('no confidential names, em dashes or placeholders')

for (const date of NOTE_DATES) assert.ok(contentSource.includes(`'${date}'`), `Missing field note date ${date}`)
assert.ok(contentSource.includes(`'${FEATURED_NOTE_LINK}'`), 'Featured field note should use the supplied URL')
assert.ok(bundle.includes('Synthetic demo data'), 'Yozora media must disclose synthetic demo data')
ok('field note dates, featured link, demo-data disclosure')

// ---------------------------------------------------------------- browser checks
function serve() {
  const types = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.webp': 'image/webp', '.png': 'image/png', '.mp4': 'video/mp4', '.pdf': 'application/pdf', '.woff2': 'font/woff2', '.txt': 'text/plain', '.xml': 'application/xml' }
  const server = createServer((req, res) => {
    const path = decodeURIComponent(new URL(req.url, 'http://x').pathname)
    const file = join(dist, path === '/' ? 'index.html' : path)
    if (!file.startsWith(dist) || size(file) === 0) {
      res.writeHead(404).end('not found')
      return
    }
    res.writeHead(200, { 'content-type': types[extname(file)] ?? 'application/octet-stream' })
    res.end(readFileSync(file))
  })
  return new Promise((resolve) => server.listen(0, '127.0.0.1', () => resolve(server)))
}

const server = await serve()
const base = `http://127.0.0.1:${server.address().port}`
const browser = await chromium.launch().catch((e) => {
  throw new Error(`Could not launch Chromium (run \`npx playwright-core install chromium\`): ${e.message}`)
})

const GITHUB_API = 'https://github-contributions-api.jogruber.de/**'
/** A fixed year of fake contributions, so the graph test never depends on the live API. */
function sampleActivity() {
  const days = Array.from({ length: 371 }, (_, i) => {
    const d = new Date(Date.UTC(2026, 9, 23) - (370 - i) * 86400000)
    const count = i % 5 === 0 ? 0 : i % 7
    return { date: d.toISOString().slice(0, 10), count, level: Math.min(4, Math.ceil(count / 2)) }
  })
  return { total: { lastYear: days.reduce((n, d) => n + d.count, 0) }, contributions: days }
}

/** Opens the page and records everything that should fail the run. */
async function open(label, contextOptions) {
  const context = await browser.newContext(contextOptions)
  await context.route(GITHUB_API, (route) => route.fulfill({ json: sampleActivity(), headers: { 'access-control-allow-origin': '*' } }))
  const page = await context.newPage()
  const problems = []
  page.on('pageerror', (e) => problems.push(`[${label}] page error: ${e.message}`))
  page.on('console', (m) => m.type() === 'error' && problems.push(`[${label}] console error: ${m.text()}`))
  page.on('response', (r) => r.status() >= 400 && problems.push(`[${label}] HTTP ${r.status()}: ${r.url()}`))
  page.on('requestfailed', (r) => !/ERR_ABORTED/.test(r.failure()?.errorText ?? '') && problems.push(`[${label}] request failed: ${r.url()}`))
  await page.goto(base, { waitUntil: 'load' })
  await page.waitForTimeout(1200)
  return { page, context, problems }
}

/** Scrolls the whole page so lazy images load and in-view effects fire. */
async function scrollThrough(page) {
  await page.evaluate(async () => {
    document.documentElement.style.scrollBehavior = 'auto'
    for (let y = 0; y < document.documentElement.scrollHeight; y += innerHeight * 0.6) {
      scrollTo({ top: y, behavior: 'instant' })
      await new Promise((r) => setTimeout(r, 120))
    }
    scrollTo({ top: 0, behavior: 'instant' })
    await new Promise((r) => setTimeout(r, 300))
  })
}

async function commonChecks(label, { page, problems }) {
  await scrollThrough(page)

  const overflow = await page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, inner: innerWidth }))
  assert.ok(overflow.scroll <= overflow.inner, `[${label}] horizontal overflow: scrollWidth ${overflow.scroll} > ${overflow.inner}`)
  ok(`${label}: no horizontal overflow`)

  assert.equal(await page.locator('h1').count(), 1, `[${label}] page should have exactly one h1`)
  for (const id of SECTIONS) assert.equal(await page.locator(`#${id}`).count(), 1, `[${label}] missing #${id}`)
  const brokenAnchors = await page.evaluate(() =>
    [...document.querySelectorAll('a[href^="#"]')].map((a) => a.getAttribute('href')).filter((h) => h.length > 1 && !document.querySelector(h)),
  )
  assert.deepEqual(brokenAnchors, [], `[${label}] anchors with no target`)
  ok(`${label}: one h1, all sections present, every in-page anchor resolves`)

  const imgs = await page.evaluate(() =>
    [...document.images].map((i) => ({ src: i.getAttribute('src'), alt: i.getAttribute('alt'), ok: i.complete && i.naturalWidth > 0, hidden: !i.offsetParent })),
  )
  for (const i of imgs) {
    assert.notEqual(i.alt, null, `[${label}] image without alt attribute: ${i.src}`)
    if (!i.hidden) assert.ok(i.ok, `[${label}] image failed to load: ${i.src}`)
  }
  const notes = await page.locator('#writing img').evaluateAll((els) => els.map((e) => e.getAttribute('alt')))
  assert.equal(notes.length, 7, `[${label}] every field note needs a cover image`)
  assert.ok(notes.every((a) => a && a.trim()), `[${label}] field note images need descriptive alt text`)
  ok(`${label}: ${imgs.length} images, all visible ones loaded, note images have alt text`)

  const unsafe = await page.evaluate(() => [...document.querySelectorAll('a[target="_blank"]')].filter((a) => !/\bno(?:opener|referrer)\b/.test(a.rel)).map((a) => a.href))
  assert.deepEqual(unsafe, [], `[${label}] target=_blank links need noopener or noreferrer`)

  const links = await page.locator('#writing a').evaluateAll((els) => els.map((a) => a.href))
  assert.equal(links.length, 7 + 1, `[${label}] 7 note links plus the LinkedIn index link`)
  assert.equal(links[0], `${FEATURED_NOTE_LINK}/`, `[${label}] featured note link`)
  const contact = await page.locator('#contact a').evaluateAll((els) => els.map((a) => a.getAttribute('href')))
  assert.deepEqual(contact, ['mailto:saqlainmmomin@gmail.com', 'https://www.linkedin.com/in/saqlain-musa/', 'https://github.com/saqlainmmomin', '/cv.pdf'], `[${label}] contact links`)
  ok(`${label}: external links safe, note and contact links correct`)

  const cells = await page.locator('#credentials svg[role="img"] rect').count()
  assert.ok(cells >= 350, `[${label}] GitHub activity graph should draw a year of days, found ${cells}`)
  ok(`${label}: GitHub activity graph renders ${cells} days`)

  // Practice pass: all six panels live in the DOM (hidden ones included), one tab is selected, keyboard flips them.
  const groups = await page.locator('#credentials [role="tabpanel"] h4').evaluateAll((els) => els.map((e) => e.textContent))
  assert.equal(groups.length, 6, `[${label}] six practice groups`)
  const credText = await page.locator('#credentials').evaluate((el) => el.textContent)
  for (const term of ['PCI DSS', 'GDPR', 'IRDAI', 'Prompt engineering', 'Reinforcement learning from human feedback', 'ServiceNow GRC', 'Claude Code']) assert.ok(credText.includes(term), `[${label}] credentials should mention ${term}`)
  const tabs = page.locator('#credentials [role="tab"]')
  assert.equal(await tabs.count(), 6, `[${label}] six practice tabs`)
  assert.equal(await page.locator('#credentials [role="tabpanel"]:not([hidden])').count(), 1, `[${label}] exactly one practice panel visible`)
  await tabs.first().focus()
  await page.keyboard.press('ArrowDown')
  assert.equal(await tabs.nth(1).getAttribute('aria-selected'), 'true', `[${label}] ArrowDown should select the next practice tab`)
  assert.match(await page.locator('#credentials [role="tabpanel"]:not([hidden]) h4').innerText(), /Audit/, `[${label}] panel should follow the tab`)
  await page.getByRole('button', { name: /Next area/ }).click()
  assert.equal(await tabs.nth(2).getAttribute('aria-selected'), 'true', `[${label}] Next should advance the pass`)
  await tabs.first().click()
  ok(`${label}: six practice panels with the expected terms; tabs, arrow keys and Next flip the pass`)

  // Field-note index: two columns on desktop, one on phones.
  const noteCols = await page.locator('#writing ol li').evaluateAll((els) => new Set(els.map((e) => Math.round(e.getBoundingClientRect().left))).size)
  assert.equal(noteCols, label === '390' ? 1 : 2, `[${label}] field-note index columns`)
  ok(`${label}: field-note index lays out in ${noteCols} column(s)`)

  // Demo dialogs: Yozora's walkthrough and one exhibit.
  for (const [name, trigger] of [
    ['Yozora', page.getByRole('button', { name: /Watch earlier prototype/ })],
    ['Velocity', page.getByRole('button', { name: /View dashboard: Velocity/ })],
  ]) {
    await trigger.scrollIntoViewIfNeeded()
    await trigger.click()
    const dialog = page.locator('dialog[open]')
    await dialog.waitFor({ state: 'visible' })
    assert.equal(await dialog.getAttribute('aria-labelledby'), 'demo-title')
    assert.ok((await dialog.locator('#demo-title').innerText()).includes(name), `[${label}] ${name} dialog title`)
    await page.keyboard.press('Escape')
    await page.locator('dialog[open]').waitFor({ state: 'detached' })
    await page
      .waitForFunction(() => !document.querySelector('dialog video'), null, { timeout: 2000 })
      .catch(() => assert.fail(`[${label}] closing the dialog should unmount its media`))
  }
  ok(`${label}: demo dialogs open, label themselves and close on Escape`)

  assert.deepEqual(problems, [], `[${label}] console errors or failed requests`)
  ok(`${label}: console clean, no 4xx/failed requests`)
}

console.log('Browser checks')

// Desktop, fine pointer.
{
  const s = await open('1440', { viewport: { width: 1440, height: 900 } })
  await commonChecks('1440', s)

  // Active-section indicator follows the scroll.
  await s.page.evaluate(() => {
    document.documentElement.style.scrollBehavior = 'auto'
    scrollTo({ top: document.querySelector('#credentials').offsetTop + 100, behavior: 'instant' })
  })
  await s.page.waitForTimeout(400)
  assert.match(await s.page.locator('nav ul.md\\:flex a[aria-current="true"]').innerText(), /CREDENTIALS/i, 'nav should mark the section in view')
  ok('1440: nav marks the active section')

  // Redaction bars cover the thesis until hover or focus.
  const redact = s.page.locator('.redact').first()
  const color = () => redact.evaluate((el) => getComputedStyle(el).color)
  await redact.scrollIntoViewIfNeeded()
  assert.match(await color(), /rgba\(0, 0, 0, 0\)|transparent/, 'redacted text should be covered by default on fine pointers')
  await redact.hover()
  await s.page.waitForTimeout(700)
  assert.doesNotMatch(await color(), /rgba\(0, 0, 0, 0\)/, 'hover should lift the redaction')
  await s.page.mouse.move(2, 2)
  await s.page.waitForTimeout(600)
  await s.page.locator('.note-row').first().focus()
  await s.page.keyboard.press('Shift+Tab')
  await s.page.keyboard.press('Tab')
  await s.page.waitForTimeout(700)
  assert.doesNotMatch(await color(), /rgba\(0, 0, 0, 0\)/, 'keyboard focus should lift the redaction')
  ok('1440: redaction bars lift on hover and on keyboard focus')
  await s.context.close()
}

// Phone: touch, narrow, mobile menu.
{
  const s = await open('390', { viewport: { width: 390, height: 844 }, isMobile: true, hasTouch: true, deviceScaleFactor: 2 })
  await commonChecks('390', s)

  const menu = s.page.locator('#mobile-menu')
  const button = s.page.getByRole('button', { name: 'Menu' })
  assert.equal(await menu.isVisible(), false, 'mobile menu should start closed')
  await button.click()
  assert.equal(await s.page.locator('nav button[aria-expanded="true"]').count(), 1, 'menu button should report expanded')
  assert.equal(await menu.locator('a').count(), 5, 'mobile menu should list the five sections')
  await menu.getByRole('link', { name: /Field notes/i }).click()
  assert.equal(await menu.isVisible(), false, 'choosing a section should close the menu')
  await s.page.waitForTimeout(900)
  assert.ok(await s.page.evaluate(() => document.querySelector('#writing').getBoundingClientRect().top < 120), 'menu link should scroll to the section')
  await button.click()
  await s.page.keyboard.press('Escape')
  assert.equal(await menu.isVisible(), false, 'Escape should close the menu')
  ok('390: mobile menu opens, navigates and closes (link, Escape)')

  // Touch devices never get the black bars.
  const color = await s.page.locator('.redact').first().evaluate((el) => getComputedStyle(el).color)
  assert.doesNotMatch(color, /rgba\(0, 0, 0, 0\)/, 'notes must be readable on touch screens')
  ok('390: field note text is readable on touch')
  await s.context.close()
}

// Reduced motion: every reveal must resolve to its final, readable state.
{
  const s = await open('reduced-motion', { viewport: { width: 1440, height: 900 }, reducedMotion: 'reduce' })
  await scrollThrough(s.page)
  const state = await s.page.evaluate(() => {
    const q = (sel) => document.querySelector(sel)
    return {
      scrollBehavior: getComputedStyle(document.documentElement).scrollBehavior,
      redact: getComputedStyle(q('.redact')).color,
      stampOpacity: getComputedStyle(q('.stamp')).opacity,
      scribble: getComputedStyle(q('.scribble-ink')).strokeDashoffset,
      tile: getComputedStyle(q('.stagger-in')).opacity,
      rule: q('.grow-rule').getBoundingClientRect().width,
      mark: getComputedStyle(q('.mark')).backgroundSize,
      flow: getComputedStyle(q('.flow-link'), '::after').transform,
    }
  })
  assert.equal(state.scrollBehavior, 'auto', 'smooth scroll should be off')
  assert.doesNotMatch(state.redact, /rgba\(0, 0, 0, 0\)/, 'notes must stay readable under reduced motion')
  assert.equal(state.stampOpacity, '1', 'stamps should be visible without animating in')
  assert.ok(parseFloat(state.scribble) === 0, 'underline should be fully drawn')
  assert.equal(state.tile, '1', 'KPMG stages should be visible without animating in')
  assert.ok(state.rule > 0, 'KPMG rule should be full width')
  assert.match(state.mark, /100%/, 'key-phrase highlight should be drawn without animating')
  assert.ok(state.flow === 'none' || /matrix\(1, 0, 0, 1/.test(state.flow), 'lifecycle line should be fully drawn')
  assert.deepEqual(s.problems, [], 'reduced-motion: console errors or failed requests')
  ok('reduced motion: scroll, redaction, stamps, underline and KPMG stages resolve to their final state')
  await s.context.close()
}

// 320px (WCAG 1.4.10 reflow): no horizontal scroll.
{
  const s = await open('320', { viewport: { width: 320, height: 700 }, isMobile: true, hasTouch: true })
  await scrollThrough(s.page)
  const o = await s.page.evaluate(() => ({ scroll: document.documentElement.scrollWidth, inner: innerWidth }))
  assert.ok(o.scroll <= o.inner, `[320] horizontal overflow: scrollWidth ${o.scroll} > ${o.inner}`)
  ok('320: no horizontal overflow')
  await s.context.close()
}

// The graph degrades to a plain GitHub link when the API is down.
{
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } })
  await context.route(GITHUB_API, (route) => route.fulfill({ status: 500, body: 'down' }))
  const page = await context.newPage()
  await page.goto(base)
  await page.waitForTimeout(1200)
  assert.equal(await page.locator('#credentials svg[role="img"]').count(), 0, 'no graph when the API fails')
  assert.ok(await page.locator('#credentials a[href="https://github.com/saqlainmmomin"]').isVisible(), 'fallback GitHub link should show')
  ok('GitHub activity falls back to a profile link when the API fails')
  await context.close()
}

await browser.close()
server.close()
console.log(`web smoke test passed (${results.length} checks)`)
