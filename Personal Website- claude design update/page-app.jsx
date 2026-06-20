// page-app.jsx — App shell with nav, overlay, scroll observation

const { useState, useRef, useCallback, useEffect } = React;

/* ======== PAGE OVERLAY ======== */
function PageOverlay({ prevBg, counter }) {
  if (!prevBg) return null;
  return <div key={counter} style={{
    position:'fixed', inset:0, zIndex:90, pointerEvents:'none',
    backgroundColor:prevBg,
    animation:'overlay-out 380ms cubic-bezier(.4,0,.2,1) forwards',
  }}></div>;
}

/* ======== NAV ======== */
function SiteNav({ p, visible }) {
  const sections = ['argument','work','notes','who','contact'];
  const labels = { argument:'Window', work:'Work', notes:'Notes', who:'Who', contact:'Contact' };
  return (
    <nav style={{
      position:'fixed', top:0, left:0, right:0, zIndex:100,
      height:56, display:'flex', alignItems:'center', justifyContent:'space-between',
      padding:'0 clamp(24px,5vw,64px)', backgroundColor:p.bg, borderBottom:`1px solid ${p.line}`,
      transform:visible?'translateY(0)':'translateY(-100%)',
      transition:'transform 380ms cubic-bezier(.4,0,.2,1)',
    }}>
      <a href="#hero" style={{ fontFamily:F.mono, fontSize:16, fontWeight:600, color:p.fg, letterSpacing:'0.06em', textDecoration:'none' }}>SM</a>
      <div style={{ display:'flex', gap:24, fontFamily:F.mono, fontSize:12, letterSpacing:'0.06em', textTransform:'uppercase' }}>
        {sections.map(id => (
          <a key={id} href={`#${id}`} style={{ color:p.dim, textDecoration:'none' }}>{labels[id]}</a>
        ))}
      </div>
    </nav>
  );
}

/* ======== APP ======== */
function App() {
  const [reading, setReading] = useState('auditor');
  const [overlay, setOverlay] = useState({ bg:null, count:0 });
  const [navVis, setNavVis] = useState(false);
  const heroRef = useRef(null);
  const prevRef = useRef(reading);

  const switchReading = useCallback((next) => {
    if (next === prevRef.current) return;
    setOverlay(o => ({ bg: PAL[prevRef.current].bg, count: o.count+1 }));
    prevRef.current = next;
    setReading(next);
  }, []);

  useEffect(() => {
    const el = heroRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(([e]) => setNavVis(!e.isIntersecting), { threshold:0.05 });
    obs.observe(el);
    return () => obs.disconnect();
  }, []);

  const p = PAL[reading];

  return (
    <div>
      <PageOverlay prevBg={overlay.bg} counter={overlay.count} />
      <SiteNav p={p} visible={navVis} />
      <div ref={heroRef}>
        <HeroSection reading={reading} p={p} onSwitch={switchReading} />
      </div>
      <WindowSection />
      <WorkSection reading={reading} p={p} onSwitch={switchReading} />
      <NotesSection />
      <WhoSection />
      <OutsideSection />
      <ContactSection />
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
