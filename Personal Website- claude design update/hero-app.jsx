// hero-app.jsx — Main app shell for the hero exploration prototype.

const { useState } = React;

/* ================================================================
   FONT CONFIGURATIONS
   ================================================================ */

const FONT_MAP = {
  protocol: {
    label: 'Protocol',
    desc: 'Space Grotesk + Newsreader + Space Mono',
    serif:  "'Newsreader', Georgia, serif",
    sans:   "'Space Grotesk', system-ui, sans-serif",
    mono:   "'Space Mono', monospace",
    serifDisplayWt: 600,
    sansDisplayWt: 500,
  },
  plex: {
    label: 'Plex',
    desc: 'IBM Plex Sans + Serif + Mono',
    serif:  "'IBM Plex Serif', Georgia, serif",
    sans:   "'IBM Plex Sans', system-ui, sans-serif",
    mono:   "'IBM Plex Mono', monospace",
    serifDisplayWt: 600,
    sansDisplayWt: 600,
  },
  signal: {
    label: 'Signal',
    desc: 'Outfit + Literata + Fira Code',
    serif:  "'Literata', Georgia, serif",
    sans:   "'Outfit', system-ui, sans-serif",
    mono:   "'Fira Code', monospace",
    serifDisplayWt: 600,
    sansDisplayWt: 600,
  },
};

const LAYOUT_MAP = {
  crown:      { label: 'Name First',    component: CrownHero },
  integrated: { label: 'Name in Lens',  component: IntegratedHero },
  masthead:   { label: 'Masthead',      component: MastheadHero },
};

const FONT_KEYS = ['protocol', 'plex', 'signal'];
const LAYOUT_KEYS = ['crown', 'integrated', 'masthead'];

/* ================================================================
   CONTROL BAR — always visible, interactive
   ================================================================ */

const controlBarStyles = {
  bar: {
    position: 'fixed', top: 0, left: 0, right: 0, zIndex: 50,
    background: 'rgba(7,8,11,0.95)', backdropFilter: 'blur(12px)',
    color: '#e8ecf2',
    padding: '12px 20px',
    display: 'flex', flexDirection: 'column', gap: 8,
    borderBottom: '1px solid rgba(255,255,255,0.08)',
    fontFamily: "'Space Mono', 'IBM Plex Mono', monospace",
  },
  row: {
    display: 'flex', alignItems: 'center', gap: 12, flexWrap: 'wrap',
  },
  label: {
    fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase',
    opacity: 0.45, minWidth: 54,
  },
  btnGroup: {
    display: 'flex', gap: 2,
  },
  btn: (active) => ({
    fontSize: 11, letterSpacing: '0.04em',
    padding: '5px 12px',
    border: '1px solid ' + (active ? 'rgba(110,168,254,0.5)' : 'rgba(255,255,255,0.1)'),
    borderRadius: 3,
    background: active ? 'rgba(110,168,254,0.15)' : 'transparent',
    color: active ? '#6ea8fe' : 'rgba(255,255,255,0.55)',
    cursor: 'pointer',
    transition: 'all 150ms ease',
    fontFamily: 'inherit',
  }),
  desc: {
    fontSize: 10, opacity: 0.35, marginLeft: 8,
    letterSpacing: '0.02em',
  },
};

function ControlBar({ fontKey, setFontKey, layoutKey, setLayoutKey }) {
  return (
    <div style={controlBarStyles.bar}>
      <div style={controlBarStyles.row}>
        <span style={controlBarStyles.label}>Type</span>
        <div style={controlBarStyles.btnGroup}>
          {FONT_KEYS.map(k => (
            <button
              key={k}
              style={controlBarStyles.btn(fontKey === k)}
              onClick={() => setFontKey(k)}
            >{FONT_MAP[k].label}</button>
          ))}
        </div>
        <span style={controlBarStyles.desc}>{FONT_MAP[fontKey].desc}</span>
      </div>
      <div style={controlBarStyles.row}>
        <span style={controlBarStyles.label}>Layout</span>
        <div style={controlBarStyles.btnGroup}>
          {LAYOUT_KEYS.map(k => (
            <button
              key={k}
              style={controlBarStyles.btn(layoutKey === k)}
              onClick={() => setLayoutKey(k)}
            >{LAYOUT_MAP[k].label}</button>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ================================================================
   APP
   ================================================================ */

function HeroApp() {
  const [fontKey, setFontKey] = useState('protocol');
  const [layoutKey, setLayoutKey] = useState('crown');
  const [reading, setReading] = useState('auditor');

  const fonts = FONT_MAP[fontKey];
  const LayoutComponent = LAYOUT_MAP[layoutKey].component;

  return (
    <div>
      <ControlBar
        fontKey={fontKey} setFontKey={setFontKey}
        layoutKey={layoutKey} setLayoutKey={setLayoutKey}
      />
      <LayoutComponent
        fonts={fonts}
        reading={reading}
        onToggle={setReading}
      />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<HeroApp />);
