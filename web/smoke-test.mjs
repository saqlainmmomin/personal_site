// Smoke test for the Vite build in web/dist. Run `npm run build` first.
// Static checks (assets, metadata, copy rules) always run; browser checks drive headless
// Chromium through playwright-core against a local static server that mimics cleanUrls.
import assert from 'node:assert/strict'
import { readFileSync, readdirSync, statSync } from 'node:fs'
import { createServer } from 'node:http'
import { dirname, extname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { chromium } from 'playwright-core'

const root = dirname(fileURLToPath(import.meta.url))
const dist = join(root, 'dist')
const PRODUCTION_ORIGIN = 'https://saqlainswebsite.vercel.app'
const EMAIL = 'saqlainmmomin@gmail.com'

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
assert.ok(size(join(dist, 'projects.html')) > 0, 'web/dist/projects.html is missing: projects should be a second Vite entry')
assert.ok(size(join(dist, 'writing.html')) > 0, 'web/dist/writing.html is missing: writing should be a Vite entry')
const html = readFileSync(join(dist, 'index.html'), 'utf8')
const projectsHtml = readFileSync(join(dist, 'projects.html'), 'utf8')
const writingHtml = readFileSync(join(dist, 'writing.html'), 'utf8')
const contentFiles = walk(join(root, 'src', 'content')).filter((f) => f.endsWith('.ts'))
const contentSource = contentFiles.map((f) => readFileSync(f, 'utf8')).join('\n')
const bundle = walk(join(dist, 'assets'))
  .filter((f) => f.endsWith('.js'))
  .map((f) => readFileSync(f, 'utf8'))
  .join('\n')

console.log('Static checks')

assert.match(html, /<title>[^<]*Saqlain Momin[^<]*GRC/, 'Title should name Saqlain Momin and GRC')
assert.ok(html.includes(`<link rel="canonical" href="${PRODUCTION_ORIGIN}/">`), 'Canonical URL should use the production origin')
assert.ok(projectsHtml.includes(`<link rel="canonical" href="${PRODUCTION_ORIGIN}/projects">`), '/projects canonical should use the production origin')
assert.ok(writingHtml.includes(`<link rel="canonical" href="${PRODUCTION_ORIGIN}/writing">`), '/writing canonical should use the production origin')
assert.ok(html.includes(`content="${PRODUCTION_ORIGIN}/og/og-image.png"`), 'OG image should use the production origin')
const jsonLd = JSON.parse(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/.exec(html)?.[1] ?? 'null')
assert.equal(jsonLd?.url, `${PRODUCTION_ORIGIN}/`, 'JSON-LD URL should match the canonical URL')
assert.ok(size(join(dist, 'og', 'og-image.png')) > 0, 'Missing og/og-image.png')
assert.match(readFileSync(join(dist, 'robots.txt'), 'utf8'), new RegExp(`Sitemap: ${PRODUCTION_ORIGIN}/sitemap\\.xml`))
const sitemap = readFileSync(join(dist, 'sitemap.xml'), 'utf8')
assert.ok(sitemap.includes(`<loc>${PRODUCTION_ORIGIN}/</loc>`) && sitemap.includes(`<loc>${PRODUCTION_ORIGIN}/projects</loc>`), 'Sitemap should list / and /projects')
assert.ok(sitemap.includes(`<loc>${PRODUCTION_ORIGIN}/writing</loc>`), 'Sitemap should list /writing')
assert.ok(size(join(dist, 'yozora.html')) > 0 && sitemap.includes(`<loc>${PRODUCTION_ORIGIN}/yozora</loc>`), '/yozora should be a Vite entry listed in the sitemap')
ok('metadata, canonical, JSON-LD, robots, sitemap')

const vercel = JSON.parse(readFileSync(join(root, '..', 'vercel.json'), 'utf8'))
assert.equal(vercel.outputDirectory, 'web/dist', 'vercel.json should deploy web/dist')
assert.equal(vercel.cleanUrls, true, 'vercel.json needs cleanUrls so /projects serves projects.html')
ok('vercel.json deploys web/dist with cleanUrls')

const assetPaths = [...new Set([...contentSource.matchAll(/'(\/(?:img|fonts|og)\/[^']+|\/cv\.pdf)'/g)].map((m) => m[1]))]
assert.ok(assetPaths.length >= 6, `Expected the content files to name at least 6 assets, found ${assetPaths.length}`)
for (const p of assetPaths) assert.ok(size(join(dist, p)) > 0, `Missing or empty asset in dist: ${p}`)
ok(`${assetPaths.length} assets named in content exist in dist`)

for (const name of ['Marvell Semiconductor', 'Airtel Money', 'OneOncology']) {
  assert.ok(!bundle.includes(name) && !contentSource.includes(name), `Confidential client name leaked: ${name}`)
}
assert.ok(!contentSource.includes('—'), 'Content should follow the no-em-dash rule')
assert.ok(!bundle.includes('youremail@domain.com') && !bundle.includes('Mahmood'), 'Placeholder or old surname must not remain')
ok('no confidential names, em dashes or placeholders')

assert.ok(bundle.includes('synthetic demo data'), 'Yozora media must disclose synthetic demo data')
ok('demo-data disclosure present')

// The fight prototype's physics lib ships in its own lazy chunk, never in the homepage entry.
const mainChunk = readFileSync(join(dist, /<script type="module" crossorigin src="\/([^"]+)"/.exec(html)[1]), 'utf8')
assert.ok(!mainChunk.includes('collisionStart'), 'Main chunk must not contain the physics lib')
assert.ok(bundle.includes('collisionStart'), 'Physics lib should exist as a lazy chunk')
ok('physics lib is a lazy chunk, not in the main entry')

// ---------------------------------------------------------------- browser checks
const MIME = { '.html': 'text/html', '.js': 'text/javascript', '.css': 'text/css', '.svg': 'image/svg+xml', '.png': 'image/png', '.jpg': 'image/jpeg', '.webp': 'image/webp', '.woff2': 'font/woff2', '.mp4': 'video/mp4', '.pdf': 'application/pdf', '.xml': 'application/xml', '.txt': 'text/plain' }

const server = createServer((req, res) => {
  let path = decodeURIComponent((req.url ?? '/').split('?')[0])
  if (path === '/') path = '/index.html'
  else if (!extname(path)) path += '.html' // cleanUrls
  const file = join(dist, path)
  if (!file.startsWith(dist) || size(file) === 0) {
    res.writeHead(404).end('not found')
    return
  }
  const body = readFileSync(file)
  const range = req.headers.range
  const headers = { 'content-type': MIME[extname(file)] ?? 'application/octet-stream', 'accept-ranges': 'bytes' }
  if (range) {
    const [a, b] = range.replace('bytes=', '').split('-')
    const start = Number(a)
    const end = b ? Number(b) : body.length - 1
    res.writeHead(206, { ...headers, 'content-range': `bytes ${start}-${end}/${body.length}`, 'content-length': end - start + 1 })
    res.end(body.subarray(start, end + 1))
    return
  }
  res.writeHead(200, { ...headers, 'content-length': body.length })
  res.end(body)
})
await new Promise((r) => server.listen(0, '127.0.0.1', r))
const origin = `http://127.0.0.1:${server.address().port}`

console.log('Browser checks')
const browser = await chromium.launch({ channel: 'chrome' }).catch(() => chromium.launch())

async function open(path, viewport) {
  const context = await browser.newContext({ viewport, permissions: ['clipboard-read', 'clipboard-write'] })
  const page = await context.newPage()
  const problems = []
  page.on('console', (m) => m.type() === 'error' && problems.push(`console: ${m.text()}`))
  page.on('pageerror', (e) => problems.push(`pageerror: ${e.message}`))
  page.on('response', (r) => r.status() >= 400 && problems.push(`${r.status()} ${r.url()}`))
  page.on('requestfailed', (r) => !r.failure()?.errorText.includes('ERR_ABORTED') && problems.push(`failed ${r.url()}`))
  await page.goto(origin + path, { waitUntil: 'load' })
  await page.evaluate(() => document.fonts.ready)
  return { page, context, problems }
}

const viewports = [
  ['1440', { width: 1440, height: 900 }],
  ['390', { width: 390, height: 844 }],
]

try {
  for (const path of ['/', '/projects', '/writing', '/yozora']) {
    for (const [vw, viewport] of viewports) {
      const label = `${path} @${vw}`
      const { page, context, problems } = await open(path, viewport)

      const overflow = await page.evaluate(() => ({
        doc: document.documentElement.scrollWidth,
        body: document.body.scrollWidth,
        inner: window.innerWidth,
      }))
      assert.ok(overflow.doc <= overflow.inner && overflow.body <= overflow.inner, `[${label}] horizontal overflow: ${JSON.stringify(overflow)}`)
      ok(`${label}: no horizontal overflow`)

      const small = await page.evaluate(() => {
        const bad = []
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT)
        for (let n = walker.nextNode(); n; n = walker.nextNode()) {
          if (!n.textContent.trim()) continue
          const el = n.parentElement
          const st = getComputedStyle(el)
          if (st.display === 'none' || st.visibility === 'hidden' || el.closest('.sr-only, [hidden]')) continue
          if (parseFloat(st.fontSize) < 12) bad.push(`${el.tagName} ${st.fontSize} "${n.textContent.trim().slice(0, 30)}"`)
        }
        return bad
      })
      assert.deepEqual(small, [], `[${label}] text under 12px`)
      ok(`${label}: no text under 12px`)

      const reds = await page.evaluate(() => {
        const found = new Set()
        const isRed = (c) => {
          const m = c.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)/)
          if (!m) return false
          const [r, g, b] = m.slice(1).map(Number)
          return r > g + 40 && r > b + 40
        }
        for (const el of document.querySelectorAll('body *')) {
          const st = getComputedStyle(el)
          for (const prop of ['color', 'backgroundColor', 'borderTopColor', 'outlineColor']) {
            if (isRed(st[prop])) found.add(`${prop}:${st[prop]}`)
          }
        }
        return [...found]
      })
      const redValues = new Set(reds.map((r) => r.split(':')[1]))
      assert.ok(redValues.size <= 1, `[${label}] more than one red in use: ${reds.join(', ')}`)
      ok(`${label}: ${redValues.size} red in use`)

      const links = await page.evaluate(() =>
        [...document.querySelectorAll('a[href]')].map((a) => ({ href: a.href, target: a.target, rel: a.rel, external: new URL(a.href).origin !== location.origin && a.protocol.startsWith('http') })),
      )
      for (const l of links.filter((x) => x.external)) assert.ok(l.rel.split(/\s+/).includes('noopener'), `[${label}] external link needs rel=noopener: ${l.href}`)
      ok(`${label}: ${links.filter((l) => l.external).length} external links all rel=noopener`)

      const broken = await page.evaluate(() =>
        [...document.images].filter((i) => !i.complete || i.naturalWidth === 0).map((i) => i.src),
      )
      assert.deepEqual(broken, [], `[${label}] images failed to load`)
      ok(`${label}: images load`)

      assert.equal(await page.locator('h1').count(), 1, `[${label}] needs exactly one h1`)
      assert.deepEqual(problems, [], `[${label}] console or network problems`)
      ok(`${label}: one h1, no console errors, no 4xx/failed requests`)
      await context.close()
    }
  }

  // Home specifics
  for (const [vw, viewport] of viewports) {
    const { page, context } = await open('/', viewport)
    const missing = await page.evaluate(() => ['work', 'projects', 'writing', 'contact'].filter((id) => !document.getElementById(id)))
    assert.deepEqual(missing, [], `[home @${vw}] nav anchors must resolve`)
    const nav = await page.evaluate(() => {
      const h = document.querySelector('header').getBoundingClientRect()
      return { height: h.height, labels: [...document.querySelectorAll('header a')].map((a) => a.textContent) }
    })
    assert.deepEqual(nav.labels, ['Saqlain Momin', 'Work', 'Projects', 'Writing', 'Contact'])
    assert.ok(nav.height < 90, `[home @${vw}] nav should stay on one line (height ${nav.height})`)
    ok(`home @${vw}: nav anchors resolve and the nav fits on one line`)

    const names = await page.locator('[role=tab]').allTextContents()
    assert.deepEqual(names, ['Plan', 'Do', 'Check', 'Act'], `[home @${vw}] work cycle tabs`)
    const visibleCount = async () => page.locator('#cycle-panel li:visible').count()
    assert.equal(await visibleCount(), 5, `[home @${vw}] Plan shows five points`)
    for (const name of ['Do', 'Check', 'Act', 'Plan']) {
      await page.getByRole('tab', { name }).click()
      await page.waitForFunction((n) => document.querySelector('[role=tab][aria-selected=true]')?.textContent === n, name)
      await page.waitForTimeout(900)
      assert.equal(await visibleCount(), 5, `[home @${vw}] ${name} shows five points`)
      assert.equal(await page.locator('[role=tab][aria-selected=true]').textContent(), name)
    }
    assert.equal(await page.locator('a[href="/kpmg"]').count(), 0, 'old /kpmg link should be gone')
    assert.ok(await page.getByText('4.5 years').first().isVisible(), `[home @${vw}] tenure line`)
    ok(`home @${vw}: work cycle tabs switch, one stage at a time`)

    const copy = page.locator('[data-copy-email]')
    await copy.click()
    await page.waitForFunction(() => document.querySelector('[data-copy-email]')?.textContent?.trim() === 'Copied', null, { timeout: 3000 })
    assert.equal(await page.evaluate(() => navigator.clipboard.readText()), EMAIL)
    ok(`home @${vw}: email copy button copies the address and confirms`)
    await context.close()
  }

  // Fight prototype: only behind /?fight, desktop only; launching breaks lines loose, Esc restores the page.
  {
    const { page, context } = await open('/', viewports[0][1])
    assert.equal(await page.locator('[data-fight-launch]').count(), 0, '/ must have no fight control')
    await context.close()
    const phone = await open('/?fight', viewports[1][1])
    assert.equal(await phone.page.locator('[data-fight-launch]').count(), 0, '/?fight must hide the control on phones')
    await phone.context.close()
    const { page: p, context: c, problems } = await open('/?fight', viewports[0][1])
    await p.waitForTimeout(1500) // let the scroll-reveal settle so it doesn't change main mid-test
    const before = await p.evaluate(() => ({ main: document.querySelector('main').innerHTML, overflow: document.documentElement.style.overflow }))
    await p.locator('[data-fight-launch] button').click()
    await p.locator('canvas[data-fight]').waitFor()
    await p.waitForFunction(() => window.__fight?.ready(), null, { timeout: 5000 })
    await p.waitForTimeout(800)
    const during = await p.evaluate(() => ({ hidden: document.querySelectorAll('[data-fight-hidden]').length, debris: document.querySelectorAll('[data-fight-debris]').length, fighters: window.__fight?.state().length }))
    assert.ok(during.hidden > 0 && during.debris > 0, `launching should break lines loose: ${JSON.stringify(during)}`)
    assert.ok(during.fighters >= 2, 'launching should drop in a player and an enemy')
    await p.keyboard.press('Escape')
    await p.waitForFunction(() => !window.__fight, null, { timeout: 5000 })
    const after = await p.evaluate(() => ({ main: document.querySelector('main').innerHTML, overflow: document.documentElement.style.overflow, canvas: document.querySelectorAll('canvas[data-fight], [data-fight-debris], [data-fight-hud]').length }))
    assert.equal(after.main, before.main, 'Esc must restore the page text exactly')
    assert.equal(after.overflow, before.overflow, 'Esc must unlock scroll')
    assert.equal(after.canvas, 0, 'Esc must remove the canvas, clones and HUD')
    assert.deepEqual(problems, [], '/?fight console or network problems')
    ok(`/?fight: control on desktop only; launch turned ${during.debris} pieces into the arena; Esc flew them home and restored the page`)
    await c.close()
  }

  // Video: plays in view only
  {
    const { page, context } = await open('/projects', viewports[0][1])
    const state = await page.evaluate(async () => {
      const v = document.querySelector('video')
      v.scrollIntoView({ block: 'center' })
      await new Promise((r) => setTimeout(r, 800))
      return { playing: !v.paused }
    })
    assert.ok(state.playing, 'project video should play when in view')
    await context.close()
    const rm = await browser.newContext({ viewport: viewports[0][1], reducedMotion: 'reduce' })
    const p2 = await rm.newPage()
    await p2.goto(origin + '/projects', { waitUntil: 'load' })
    const paused = await p2.evaluate(async () => {
      const v = document.querySelector('video')
      v.scrollIntoView({ block: 'center' })
      await new Promise((r) => setTimeout(r, 600))
      return v.paused
    })
    assert.ok(paused, 'video should not autoplay under reduced motion')
    await rm.close()
    ok('project video plays in view, and stays still under reduced motion')
  }

  // Projects page
  for (const [vw, viewport] of viewports) {
    const { page, context } = await open('/projects', viewport)
    const titles = await page.locator('article h3').allTextContents()
    assert.deepEqual(titles, ['Yozora', 'Recon', 'Unshrimp', 'Tell Me How', 'Munshi', 'RL Playground'], `[projects @${vw}] tiles`)
    assert.ok((await page.locator('a[href="/"]').count()) >= 2, 'projects page needs a way back home')
    ok(`projects @${vw}: six tiles; back link present`)
    await context.close()
  }
  // Writing page
  for (const [vw, viewport] of viewports) {
    const { page, context } = await open('/writing', viewport)
    assert.equal(await page.locator('li a[target=_blank]').count(), 5, `[writing @${vw}] five article links`)
    assert.equal(await page.locator('li time').count(), 5, `[writing @${vw}] five dates`)
    assert.ok((await page.getByRole('link', { name: 'LinkedIn' }).count()) === 1, `[writing @${vw}] LinkedIn link`)
    assert.ok((await page.locator('a[href="/"]').count()) >= 2, 'writing page needs a way back home')
    ok(`writing @${vw}: five notes, LinkedIn link, back link present`)
    await context.close()
  }
  // Yozora story page: six stages, each a product screen at its content height. Analyse, Run
  // analysis and Approve reveal their result inside the screen; Reset restores it.
  const REVEALS = [
    [3, 'Analyse', /Design effectiveness/],
    [4, 'Run analysis', /Draft conclusions/],
    [5, 'Approve', /Approved by Priya Sharma/],
  ]
  for (const [vw, viewport] of viewports) {
    const { page, context, problems } = await open('/yozora', viewport)
    await page.emulateMedia({ reducedMotion: 'reduce' })
    assert.ok(await page.getByText('In development · synthetic demo data').first().isVisible(), `[yozora @${vw}] page must say it is in development on synthetic data`)
    assert.equal(await page.locator('[data-stage]').count(), 6, `[yozora @${vw}] six stages`)
    for (let n = 1; n <= 6; n++) {
      const frame = page.locator(`[data-stage="${n}"] iframe`)
      await frame.scrollIntoViewIfNeeded()
      await page.frameLocator(`[data-stage="${n}"] iframe`).locator('.app').waitFor()
    }
    const overflow = async (when) => {
      const page_ = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
      assert.ok(page_ <= 0, `[yozora @${vw}] page overflows by ${page_}px ${when}`)
      for (let n = 1; n <= 6; n++) {
        const fit = await page.locator(`[data-stage="${n}"] iframe`).evaluate((f) => {
          const h = f.contentDocument.documentElement
          return { wide: h.scrollWidth - h.clientWidth, tall: h.scrollHeight - h.clientHeight }
        })
        assert.ok(fit.wide <= 0, `[yozora @${vw}] stage ${n} screen overflows sideways by ${fit.wide}px ${when}`)
        assert.ok(fit.tall <= 1, `[yozora @${vw}] stage ${n} screen scrolls inside its frame (${fit.tall}px) ${when}`)
      }
    }
    // The whole framed screen, top and bottom, must be visible in one viewport.
    const fits = async (when) => {
      for (let n = 1; n <= 6; n++) {
        const r = await page.locator(`[data-stage="${n}"] iframe`).evaluate((f) => {
          const box = f.parentElement.parentElement
          const b = box.getBoundingClientRect()
          scrollBy(0, b.top + b.height / 2 - innerHeight / 2)
          const a = box.getBoundingClientRect()
          const t = f.style.transform.match(/scale\(([\d.]+)\)/)
          return { top: a.top, bottom: a.bottom, scale: t ? +t[1] : 1 }
        })
        assert.ok(r.top >= 0 && r.bottom <= viewport.height, `[yozora @${vw}] stage ${n} frame does not fit in the viewport (${Math.round(r.top)}..${Math.round(r.bottom)} of ${viewport.height}) ${when}`)
        assert.ok(r.scale >= 0.6, `[yozora @${vw}] stage ${n} screen scaled down too far (${r.scale}) ${when}`)
      }
    }
    await overflow('before reveals')
    await fits('before reveals')
    for (const [n, label, expected] of REVEALS) {
      const screen = page.frameLocator(`[data-stage="${n}"] iframe`)
      const result = screen.getByText(expected).first()
      assert.equal(await result.isVisible(), false, `[yozora @${vw}] stage ${n} result should be hidden before ${label}`)
      await screen.getByRole('button', { name: label }).click()
      await result.waitFor({ state: 'visible' })
      const reset = page.locator(`[data-stage="${n}"]`).getByRole('button', { name: 'Reset' })
      await reset.click()
      await result.waitFor({ state: 'hidden' })
      assert.ok(await screen.getByRole('button', { name: label }).isVisible(), `[yozora @${vw}] Reset should bring back ${label}`)
      await screen.getByRole('button', { name: label }).click()
      await result.waitFor({ state: 'visible' })
    }
    await page.waitForTimeout(100)
    await overflow('after reveals')
    await fits('after reveals')
    assert.ok(await page.frameLocator('[data-stage="6"] iframe').getByText(/Released by Priya Sharma/).isVisible(), `[yozora @${vw}] report shows the sign-off`)
    assert.deepEqual(problems, [], `[yozora @${vw}] console or network problems`)
    ok(`yozora @${vw}: six stages; Analyse, Run analysis and Approve reveal, Reset restores; no overflow on the page or in any screen`)
    await context.close()
  }
} finally {
  await browser.close()
  server.close()
}

console.log(`\n${results.length} checks passed`)
