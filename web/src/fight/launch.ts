// Loaded only on /?fight. Puts a stickman glyph in the nav; clicking it loads the game chunk.
const desktop = matchMedia('(min-width: 768px) and (pointer: fine)')

const GLYPH = `<svg viewBox="0 0 16 20" width="14" height="18" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" aria-hidden="true">
<circle cx="8" cy="3.5" r="2.3"/><path d="M8 6v6.5M8 12.5l-3.5 6M8 12.5l3.5 6M8 8l-4 2.5M8 8l4.5-2.5"/></svg>`

function mount() {
  const list = document.querySelector('header nav ul')
  if (!list) return requestAnimationFrame(mount)
  const li = document.createElement('li')
  li.dataset.fightLaunch = ''
  const button = document.createElement('button')
  button.type = 'button'
  button.title = 'Fight on this page'
  button.setAttribute('aria-label', 'Start the stickman fight')
  button.className = 'flex h-full cursor-pointer items-center text-ink hover:text-link'
  button.innerHTML = GLYPH
  button.addEventListener('click', async () => {
    button.disabled = true
    const { start } = await import('./game')
    start(() => (button.disabled = false))
  })
  li.append(button)
  list.append(li)
}

if (desktop.matches) mount()
