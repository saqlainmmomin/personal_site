// proto-hero.jsx — Hero section with Lens toggle, palettes, constants
// IBM Plex family: Serif (auditor display), Sans (builder display), Mono (meta/labels)

const { useState, useRef, useCallback, useEffect } = React;

/* ================================================================
   PALETTES & COPY
   ================================================================ */

const PAL = {
  auditor: {
    bg: '#f3f3f1', fg: '#1a1a17', dim: '#55534d',
    accent: '#0e6b5e', line: '#d5d4ce', bg2: '#eceae4',
  },
  builder: {
    bg: '#0c0e13', fg: '#e3e8ee', dim: '#8a97a8',
    accent: '#6ea8fe', line: '#1e2530', bg2: '#12151c',
  },
};

const COPY = {
  name: 'Saqlain Momin',
  headline: 'I see risk at the enterprise level, and I build the tools to close the gaps I find.',
  auditor: {
    eyebrow: 'Cyber Strategy & Governance',
    sub: 'Four years auditing controls at enterprise scale\u2009—\u2009I know why a control exists, not just that someone ticked the box.',
  },
  builder: {
    eyebrow: 'Build & Ship',
    sub: 'Async Python, FastAPI, the Anthropic SDK, Swift, n8n. Understand by shipping.',
  },
};

const F = {
  serif: "'IBM Plex Serif', Georgia, serif",
  sans:  "'IBM Plex Sans', system-ui, sans-serif",
  mono:  "'IBM Plex Mono', monospace",
};

/* ================================================================
   LENS TOGGLE — mini-seam echoing the Lens mechanic
   Accessible: role=slider, keyboard arrows, focus ring
   ================================================================ */

function LensToggle({ reading, onReadingChange, pal }) {
  const isA = reading === 'auditor';
  const [focused, setFocused] = useState(false);

  const handleKeyDown = useCallback((e) => {
    if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') {
      e.preventDefault(); onReadingChange('auditor');
    } else if (e.key === 'ArrowRight' || e.key === 'ArrowDown') {
      e.preventDefault(); onReadingChange('builder');
    }
  }, [onReadingChange]);

  const focusRing = focused
    ? { boxShadow: `0 0 0 2px ${pal.accent}` }
    : {};

  return (
    <div
      role="slider"
      tabIndex={0}
      aria-label="Reading lens"
      aria-valuemin={0}
      aria-valuemax={1}
      aria-valuenow={isA ? 0 : 1}
      aria-valuetext={`${reading} reading`}
      onKeyDown={handleKeyDown}
      onFocus={() => setFocused(true)}
      onBlur={() => setFocused(false)}
      style={{
        display: 'inline-flex', alignItems: 'stretch',
        border: `1px solid ${pal.line}`,
        transition: 'border-color var(--tr), box-shadow var(--tr)',
        outline: 'none', userSelect: 'none',
        position: 'relative',
        ...focusRing,
      }}
    >
      {/* Active indicator slides behind the active label */}
      <div style={{
        position: 'absolute',
        top: 0, bottom: 0,
        left: isA ? 0 : '50%',
        width: '50%',
        background: pal.accent,
        opacity: 0.08,
        transition: 'left var(--tr), background var(--tr)',
        pointerEvents: 'none',
      }}></div>

      <button
        onClick={() => onReadingChange('auditor')}
        aria-hidden="true"
        tabIndex={-1}
        style={{
          all: 'unset', padding: '10px 22px', cursor: 'pointer',
          fontFamily: F.mono, fontSize: 12, letterSpacing: '0.08em',
          textTransform: 'uppercase', position: 'relative',
          color: isA ? pal.accent : pal.dim,
          transition: 'color var(--tr), opacity var(--tr)',
          opacity: isA ? 1 : 0.5,
        }}
      >Auditor</button>

      {/* Seam line */}
      <div style={{
        width: 1, alignSelf: 'stretch',
        background: pal.line,
        transition: 'background var(--tr)',
      }}></div>

      <button
        onClick={() => onReadingChange('builder')}
        aria-hidden="true"
        tabIndex={-1}
        style={{
          all: 'unset', padding: '10px 22px', cursor: 'pointer',
          fontFamily: F.mono, fontSize: 12, letterSpacing: '0.08em',
          textTransform: 'uppercase', position: 'relative',
          color: !isA ? pal.accent : pal.dim,
          transition: 'color var(--tr), opacity var(--tr)',
          opacity: !isA ? 1 : 0.5,
        }}
      >Builder</button>

      {/* Keyboard hint — appears on focus */}
      {focused && (
        <span style={{
          position: 'absolute', bottom: -22, left: '50%',
          transform: 'translateX(-50%)',
          fontFamily: F.mono, fontSize: 10, color: pal.dim,
          whiteSpace: 'nowrap', opacity: 0.6, pointerEvents: 'none',
        }}>← →</span>
      )}
    </div>
  );
}

/* ================================================================
   CROSSFADE TEXT — smooth transition between two readings
   ================================================================ */

function CrossfadeText({ textA, textB, reading, style, styleA, styleB }) {
  const isA = reading === 'auditor';
  const base = { transition: 'opacity var(--tr)', position: 'absolute', top: 0, left: 0, width: '100%' };

  return (
    <div style={{ position: 'relative', ...style }}>
      {/* Invisible sizer — whichever text is longer sets the height */}
      <span style={{ ...styleA, visibility: 'hidden', display: 'block' }}>{textA}</span>
      <span style={{ ...styleB, visibility: 'hidden', display: 'block', position: 'absolute', top: 0, left: 0, width: '100%' }}>{textB}</span>

      {/* Visible layers */}
      <span style={{ ...base, ...styleA, opacity: isA ? 1 : 0 }}>{textA}</span>
      <span style={{ ...base, ...styleB, opacity: isA ? 0 : 1 }}>{textB}</span>
    </div>
  );
}

/* ================================================================
   HERO SECTION
   ================================================================ */

function HeroSection({ reading, onReadingChange }) {
  const isA = reading === 'auditor';
  const pal = PAL[reading];
  const copy = COPY[reading];

  return (
    <section
      data-screen-label="Hero"
      style={{
        minHeight: '100vh',
        display: 'flex', flexDirection: 'column', justifyContent: 'center',
        background: pal.bg, color: pal.fg,
        transition: 'background var(--tr), color var(--tr)',
        padding: '0 clamp(24px, 5vw, 64px)',
      }}
    >
      <div style={{ maxWidth: 1080, margin: '0 auto', width: '100%' }}>

        {/* Eyebrow — crossfades between readings */}
        <CrossfadeText
          textA={COPY.auditor.eyebrow}
          textB={COPY.builder.eyebrow}
          reading={reading}
          style={{ marginBottom: 28, height: 16 }}
          styleA={{
            fontFamily: F.mono, fontSize: 12, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: PAL.auditor.accent,
          }}
          styleB={{
            fontFamily: F.mono, fontSize: 12, letterSpacing: '0.14em',
            textTransform: 'uppercase', color: PAL.builder.accent,
          }}
        />

        {/* Name — dominant element */}
        <h1 style={{
          fontFamily: isA ? F.serif : F.sans,
          fontSize: 'clamp(52px, 8.5vw, 118px)',
          fontWeight: 600,
          lineHeight: 0.92,
          letterSpacing: '-0.03em',
          marginBottom: 'clamp(24px, 3.5vw, 44px)',
        }}>{COPY.name}</h1>

        {/* Headline — unified text, register typography */}
        <h2 style={{
          fontFamily: isA ? F.serif : F.sans,
          fontSize: 'clamp(22px, 3vw, 38px)',
          fontWeight: isA ? 500 : 400,
          lineHeight: 1.18,
          letterSpacing: '-0.012em',
          maxWidth: '24ch',
          marginBottom: 'clamp(16px, 2vw, 24px)',
        }}>{COPY.headline}</h2>

        {/* Sub — reading-specific, crossfades */}
        <CrossfadeText
          textA={COPY.auditor.sub}
          textB={COPY.builder.sub}
          reading={reading}
          style={{ marginBottom: 'clamp(40px, 6vh, 72px)', maxWidth: '40ch' }}
          styleA={{
            fontFamily: F.serif,
            fontSize: 'clamp(16px, 1.8vw, 20px)',
            lineHeight: 1.55, color: PAL.auditor.dim, display: 'block',
          }}
          styleB={{
            fontFamily: F.mono,
            fontSize: 'clamp(13px, 1.4vw, 16px)',
            lineHeight: 1.7, color: PAL.builder.dim, display: 'block',
          }}
        />

        {/* Lens control */}
        <LensToggle reading={reading} onReadingChange={onReadingChange} pal={pal} />
      </div>
    </section>
  );
}

Object.assign(window, { PAL, COPY, F, LensToggle, CrossfadeText, HeroSection });
