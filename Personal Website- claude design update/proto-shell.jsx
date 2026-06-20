// proto-shell.jsx — Nav, below-fold section, app shell

/* ================================================================
   NAV — hidden initially, slides in on scroll past hero
   ================================================================ */

function SiteNav({ reading, visible }) {
  const isA = reading === 'auditor';
  const pal = PAL[reading];

  return (
    <nav style={{
      position: 'fixed', top: 0, left: 0, right: 0,
      zIndex: 100,
      background: pal.bg,
      borderBottom: `1px solid ${pal.line}`,
      padding: '0 clamp(24px, 5vw, 64px)',
      height: 56,
      display: 'flex', alignItems: 'center', justifyContent: 'space-between',
      transform: visible ? 'translateY(0)' : 'translateY(-100%)',
      transition: 'transform var(--tr), background var(--tr), border-color var(--tr)',
    }}>
      <span style={{
        fontFamily: F.mono, fontSize: 16, fontWeight: 600,
        color: pal.fg, letterSpacing: '0.06em',
        transition: 'color var(--tr)',
      }}>SM</span>

      <div style={{
        display: 'flex', gap: 28,
        fontFamily: F.mono, fontSize: 12,
        letterSpacing: '0.06em', textTransform: 'uppercase',
      }}>
        {['The Work', 'Field Notes', 'Contact'].map(label => (
          <a key={label} href="#" onClick={e => e.preventDefault()} style={{
            color: pal.dim, textDecoration: 'none',
            transition: 'color var(--tr)',
          }}
          onMouseEnter={e => e.target.style.color = pal.fg}
          onMouseLeave={e => e.target.style.color = pal.dim}
          >{label}</a>
        ))}
      </div>
    </nav>
  );
}

/* ================================================================
   BELOW FOLD — contextual "The Work" hint to show scroll behavior
   ================================================================ */

const WORK_ITEMS = [
  { auditor: 'Global SOX ITGC Assessment', builder: 'Automated Control Testing Pipeline', year: '2024' },
  { auditor: 'Cloud Security Posture Review', builder: 'FastAPI Audit Dashboard', year: '2023' },
  { auditor: 'Third-Party Vendor Risk Framework', builder: 'n8n GRC Automation Flows', year: '2023' },
];

function BelowFold({ reading }) {
  const isA = reading === 'auditor';
  const pal = PAL[reading];

  return (
    <section
      data-screen-label="The Work (preview)"
      style={{
        padding: 'clamp(64px, 10vh, 120px) clamp(24px, 5vw, 64px) clamp(80px, 14vh, 160px)',
        background: pal.bg, color: pal.fg,
        transition: 'background var(--tr), color var(--tr)',
      }}
    >
      <div style={{ maxWidth: 1080, margin: '0 auto' }}>
        <p style={{
          fontFamily: F.mono, fontSize: 12,
          letterSpacing: '0.14em', textTransform: 'uppercase',
          color: pal.accent, marginBottom: 20,
          transition: 'color var(--tr)',
        }}>The Work</p>

        <h2 style={{
          fontFamily: isA ? F.serif : F.sans,
          fontSize: 'clamp(26px, 3.6vw, 44px)',
          fontWeight: 600, lineHeight: 1.08,
          letterSpacing: '-0.02em',
          maxWidth: '20ch',
          marginBottom: 48,
        }}>
          {isA
            ? 'Control assessments that changed how leadership saw risk.'
            : 'Tools shipped to close gaps faster.'}
        </h2>

        {/* Work rows */}
        <div style={{ display: 'flex', flexDirection: 'column' }}>
          {WORK_ITEMS.map((item, i) => (
            <div key={i} style={{
              padding: '20px 0',
              borderTop: `1px solid ${pal.line}`,
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'baseline', gap: 16,
              transition: 'border-color var(--tr)',
            }}>
              <span style={{
                fontFamily: isA ? F.serif : F.sans,
                fontSize: 'clamp(16px, 2vw, 20px)',
                fontWeight: 500,
              }}>{isA ? item.auditor : item.builder}</span>
              <span style={{
                fontFamily: F.mono, fontSize: 12,
                color: pal.dim, flexShrink: 0,
                transition: 'color var(--tr)',
              }}>{item.year}</span>
            </div>
          ))}
          {/* Final border */}
          <div style={{
            borderTop: `1px solid ${pal.line}`,
            transition: 'border-color var(--tr)',
          }}></div>
        </div>
      </div>
    </section>
  );
}

/* ================================================================
   APP SHELL
   ================================================================ */

function ProtoApp() {
  const [reading, setReading] = React.useState('auditor');
  const [navVisible, setNavVisible] = React.useState(false);
  const heroRef = React.useRef(null);

  // Intersection observer: show nav when hero scrolls out
  React.useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => setNavVisible(!entry.isIntersecting),
      { threshold: 0.05 }
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  return (
    <div>
      <SiteNav reading={reading} visible={navVisible} />
      <div ref={heroRef}>
        <HeroSection reading={reading} onReadingChange={setReading} />
      </div>
      <BelowFold reading={reading} />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<ProtoApp />);
