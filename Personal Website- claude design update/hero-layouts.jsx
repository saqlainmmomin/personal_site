// hero-layouts.jsx — Three hero layout directions for the landing page exploration.
// Each receives: fonts, reading ('auditor'|'builder'), onToggle

const { useState, useEffect, useRef } = React;

/* ================================================================
   SHARED CONSTANTS
   ================================================================ */

const PALETTE = {
  auditor: {
    bg: '#f3f3f1', bg2: '#eceae4', fg: '#1a1a17',
    dim: '#55534d', accent: '#0e6b5e', line: '#dcdcd6',
  },
  builder: {
    bg: '#0c0e13', bg2: '#12151c', fg: '#e3e8ee',
    dim: '#8a97a8', accent: '#6ea8fe', line: '#1d2530',
  },
};

const COPY = {
  name: 'Saqlain Momin',
  role: 'Assistant Manager, Cyber Strategy & Governance',
  auditor: {
    eyebrow: 'Cyber Strategy & Governance',
    headline: 'I assess where systems break.',
    sub: 'Four years auditing controls at enterprise scale. I know why a control exists, not just that someone ticked the box.',
  },
  builder: {
    eyebrow: 'Build & Ship',
    headline: 'I build security tools.',
    sub: 'Async Python, FastAPI, the Anthropic SDK, Swift, n8n. Understand by shipping.',
  },
  thread: 'I see risk at the enterprise level, and I build the tools to close the gaps I find.',
};

/* ================================================================
   SHARED TOGGLE
   ================================================================ */

function ReadingToggle({ reading, onToggle, pal, fonts }) {
  const btn = (label, value) => {
    const active = reading === value;
    return (
      <button
        onClick={() => onToggle(value)}
        style={{
          fontFamily: fonts.mono,
          fontSize: 13, letterSpacing: '0.04em',
          padding: '9px 18px', border: 0, cursor: 'pointer',
          background: active ? pal.bg2 : 'transparent',
          color: pal.fg,
          opacity: active ? 1 : 0.5,
          transition: 'opacity 200ms ease, background 200ms ease',
        }}
      >{label}</button>
    );
  };
  return (
    <div style={{
      display: 'inline-flex',
      border: `1px solid ${pal.line}`,
    }}>
      {btn('Auditor', 'auditor')}
      {btn('Builder', 'builder')}
    </div>
  );
}

/* ================================================================
   LAYOUT 1 — "NAME FIRST"
   Name is the undisputed #1 hierarchy element. The reading's
   headline + sub sit below it, secondary.
   ================================================================ */

function CrownHero({ fonts, reading, onToggle }) {
  const pal = PALETTE[reading];
  const copy = COPY[reading];
  const isA = reading === 'auditor';

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      justifyContent: 'center',
      background: pal.bg, color: pal.fg,
      transition: 'background 500ms cubic-bezier(.4,0,.2,1), color 400ms cubic-bezier(.4,0,.2,1)',
      padding: '96px clamp(24px, 5vw, 64px) 0',
    }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', width: '100%', flex: '1 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* Eyebrow */}
        <p style={{
          fontFamily: fonts.mono, fontSize: 12,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: pal.accent, marginBottom: 24,
          transition: 'color 400ms ease',
        }}>{copy.eyebrow}</p>

        {/* Name — THE dominant element */}
        <h1 style={{
          fontFamily: isA ? fonts.serif : fonts.sans,
          fontSize: 'clamp(56px, 9vw, 130px)',
          fontWeight: isA ? fonts.serifDisplayWt : fonts.sansDisplayWt,
          lineHeight: 0.92, letterSpacing: '-0.03em',
          transition: 'font-family 0ms',
        }}>{COPY.name}</h1>

        {/* Reading headline */}
        <h2 style={{
          fontFamily: isA ? fonts.serif : fonts.sans,
          fontSize: 'clamp(26px, 3.6vw, 48px)',
          fontWeight: isA ? 600 : 500,
          lineHeight: 1.08, letterSpacing: '-0.02em',
          marginTop: 'clamp(20px, 3vw, 40px)',
          maxWidth: '20ch',
          transition: 'color 400ms ease',
        }}>{copy.headline}</h2>

        {/* Sub */}
        <p style={{
          fontFamily: isA ? fonts.serif : fonts.mono,
          fontSize: isA ? 'clamp(17px, 2vw, 22px)' : 'clamp(14px, 1.5vw, 17px)',
          lineHeight: isA ? 1.5 : 1.7,
          color: pal.dim, maxWidth: '36ch',
          marginTop: 20,
          transition: 'color 400ms ease',
        }}>{copy.sub}</p>
      </div>

      {/* Bar */}
      <div style={{
        maxWidth: 1100, margin: '0 auto', width: '100%',
        padding: '28px 0 clamp(32px, 5vh, 56px)',
        borderTop: `1px solid ${pal.line}`,
        marginTop: 'clamp(32px, 5vh, 64px)',
        display: 'flex', flexWrap: 'wrap', alignItems: 'flex-end',
        justifyContent: 'space-between', gap: 20,
        transition: 'border-color 400ms ease',
      }}>
        <p style={{
          fontFamily: isA ? fonts.serif : fonts.mono,
          fontStyle: isA ? 'italic' : 'normal',
          fontSize: isA ? 'clamp(16px, 1.8vw, 21px)' : 16,
          lineHeight: 1.4, maxWidth: '38ch', margin: 0,
        }}>{COPY.thread}</p>
        <ReadingToggle reading={reading} onToggle={onToggle} pal={pal} fonts={fonts} />
      </div>
    </div>
  );
}


/* ================================================================
   LAYOUT 2 — "NAME IN LENS"
   Closest to the current Lens mechanic. Both readings are
   stacked, each includes the name. Toggle crossfades.
   ================================================================ */

function IntegratedHero({ fonts, reading, onToggle }) {
  const isA = reading === 'auditor';
  const pal = PALETTE[reading];

  const paneBase = {
    position: 'absolute', inset: 0,
    display: 'flex', alignItems: 'center',
    transition: 'opacity 400ms cubic-bezier(.4,0,.2,1)',
    padding: '96px clamp(24px, 5vw, 64px) 0',
  };

  const renderPane = (mode) => {
    const p = PALETTE[mode];
    const c = COPY[mode];
    const a = mode === 'auditor';
    const visible = reading === mode;
    return (
      <div style={{
        ...paneBase,
        background: p.bg, color: p.fg,
        justifyContent: a ? 'flex-end' : 'flex-start',
        textAlign: a ? 'right' : 'left',
        opacity: visible ? 1 : 0,
        pointerEvents: visible ? 'auto' : 'none',
        zIndex: visible ? 2 : 1,
      }}>
        <div style={{
          maxWidth: 1100, width: '100%', margin: '0 auto',
          display: 'flex', flexDirection: 'column',
          alignItems: a ? 'flex-end' : 'flex-start',
        }}>
          <p style={{
            fontFamily: fonts.mono, fontSize: 12,
            letterSpacing: '0.14em', textTransform: 'uppercase',
            color: p.accent, marginBottom: 20,
          }}>{c.eyebrow}</p>

          <p style={{
            fontFamily: a ? fonts.serif : fonts.sans,
            fontSize: 'clamp(22px, 2.8vw, 34px)',
            fontWeight: a ? fonts.serifDisplayWt : fonts.sansDisplayWt,
            lineHeight: 1.1, letterSpacing: '-0.01em',
            color: p.dim, marginBottom: 8,
          }}>{COPY.name}</p>

          <h1 style={{
            fontFamily: a ? fonts.serif : fonts.sans,
            fontSize: 'clamp(42px, 6.8vw, 86px)',
            fontWeight: a ? fonts.serifDisplayWt : fonts.sansDisplayWt,
            lineHeight: 0.96, letterSpacing: '-0.025em',
            maxWidth: '14ch',
          }}>{c.headline}</h1>

          <p style={{
            fontFamily: a ? fonts.serif : fonts.mono,
            fontSize: a ? 'clamp(17px, 2vw, 22px)' : 'clamp(14px, 1.5vw, 17px)',
            lineHeight: a ? 1.5 : 1.7,
            color: p.dim, maxWidth: '32ch', marginTop: 20,
          }}>{c.sub}</p>
        </div>
      </div>
    );
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      <div style={{ position: 'relative', flex: '1 1 auto', minHeight: 0 }}>
        {renderPane('auditor')}
        {renderPane('builder')}
      </div>

      {/* Bar */}
      <div style={{
        position: 'relative', zIndex: 5,
        background: pal.bg, color: pal.fg,
        borderTop: `1px solid ${pal.line}`,
        padding: '24px clamp(24px, 5vw, 64px) clamp(28px, 4vh, 48px)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', textAlign: 'center', gap: 20,
        transition: 'background 400ms ease, color 400ms ease, border-color 400ms ease',
      }}>
        <p style={{
          fontFamily: isA ? fonts.serif : fonts.mono,
          fontStyle: isA ? 'italic' : 'normal',
          fontSize: isA ? 'clamp(16px, 1.8vw, 21px)' : 16,
          lineHeight: 1.4, maxWidth: '36ch', margin: 0,
        }}>{COPY.thread}</p>
        <ReadingToggle reading={reading} onToggle={onToggle} pal={pal} fonts={fonts} />
      </div>
    </div>
  );
}


/* ================================================================
   LAYOUT 3 — "MASTHEAD"
   Centered, balanced, professional. Name is the anchor.
   Both readings are shown side-by-side; one highlighted, one dimmed.
   ================================================================ */

function MastheadHero({ fonts, reading, onToggle }) {
  const pal = PALETTE[reading];
  const isA = reading === 'auditor';

  const renderColumn = (mode) => {
    const c = COPY[mode];
    const active = reading === mode;
    const p = PALETTE[mode];
    const a = mode === 'auditor';

    return (
      <div style={{
        flex: '1 1 0', minWidth: 260,
        opacity: active ? 1 : 0.25,
        transition: 'opacity 400ms cubic-bezier(.4,0,.2,1)',
        cursor: active ? 'default' : 'pointer',
        padding: 'clamp(16px, 2vw, 24px)',
        borderLeft: a ? 'none' : `1px solid ${pal.line}`,
      }} onClick={() => !active && onToggle(mode)}>
        <p style={{
          fontFamily: fonts.mono, fontSize: 11,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: active ? pal.accent : pal.dim,
          marginBottom: 12,
          transition: 'color 300ms ease',
        }}>{a ? 'Auditor' : 'Builder'}</p>
        <h3 style={{
          fontFamily: a ? fonts.serif : fonts.sans,
          fontSize: 'clamp(20px, 2.4vw, 30px)',
          fontWeight: a ? fonts.serifDisplayWt : fonts.sansDisplayWt,
          lineHeight: 1.15, letterSpacing: '-0.015em',
          marginBottom: 10,
        }}>{c.headline}</h3>
        <p style={{
          fontFamily: a ? fonts.serif : fonts.mono,
          fontSize: a ? 16 : 14,
          lineHeight: a ? 1.5 : 1.7,
          color: pal.dim,
          maxWidth: '40ch',
        }}>{c.sub}</p>
      </div>
    );
  };

  return (
    <div style={{
      minHeight: '100vh', display: 'flex', flexDirection: 'column',
      justifyContent: 'center', alignItems: 'center',
      background: pal.bg, color: pal.fg,
      transition: 'background 500ms cubic-bezier(.4,0,.2,1), color 400ms cubic-bezier(.4,0,.2,1)',
      padding: '96px clamp(24px, 5vw, 64px) 0',
      textAlign: 'center',
    }}>
      <div style={{ maxWidth: 1100, width: '100%', flex: '1 1 auto', display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
        {/* Name */}
        <h1 style={{
          fontFamily: isA ? fonts.serif : fonts.sans,
          fontSize: 'clamp(48px, 8vw, 110px)',
          fontWeight: isA ? fonts.serifDisplayWt : fonts.sansDisplayWt,
          lineHeight: 0.92, letterSpacing: '-0.03em',
        }}>{COPY.name}</h1>

        {/* Role */}
        <p style={{
          fontFamily: fonts.mono, fontSize: 13,
          letterSpacing: '0.08em', textTransform: 'uppercase',
          color: pal.dim, marginTop: 16,
        }}>{COPY.role}</p>

        {/* Divider */}
        <div style={{
          width: 64, height: 1, background: pal.line,
          margin: 'clamp(28px, 4vw, 48px) auto',
          transition: 'background 400ms ease',
        }}></div>

        {/* Two-column readings */}
        <div style={{
          display: 'flex', flexWrap: 'wrap', gap: 0,
          textAlign: 'left', maxWidth: 840, margin: '0 auto',
        }}>
          {renderColumn('auditor')}
          {renderColumn('builder')}
        </div>
      </div>

      {/* Thread + toggle */}
      <div style={{
        maxWidth: 1100, width: '100%',
        padding: '28px clamp(24px, 5vw, 64px) clamp(32px, 5vh, 56px)',
        borderTop: `1px solid ${pal.line}`,
        marginTop: 'clamp(28px, 4vh, 48px)',
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', gap: 20, textAlign: 'center',
        transition: 'border-color 400ms ease',
      }}>
        <p style={{
          fontFamily: isA ? fonts.serif : fonts.mono,
          fontStyle: isA ? 'italic' : 'normal',
          fontSize: isA ? 'clamp(16px, 1.8vw, 21px)' : 16,
          lineHeight: 1.4, maxWidth: '36ch', margin: 0,
        }}>{COPY.thread}</p>
        <ReadingToggle reading={reading} onToggle={onToggle} pal={pal} fonts={fonts} />
      </div>
    </div>
  );
}

Object.assign(window, {
  CrownHero, IntegratedHero, MastheadHero,
  ReadingToggle, PALETTE, COPY,
});
