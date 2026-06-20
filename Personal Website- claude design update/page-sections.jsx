// page-sections.jsx — All section components for the full page prototype

const { useState, useCallback } = React;

/* ======== SHARED ======== */
const F = { serif:"'IBM Plex Serif',Georgia,serif", sans:"'IBM Plex Sans',system-ui,sans-serif", mono:"'IBM Plex Mono',monospace" };
const eyebrowStyle = (color) => ({ fontFamily:F.mono, fontSize:12, letterSpacing:'0.14em', textTransform:'uppercase', color, marginBottom:16 });

/* ======== HERO ======== */
function HeroSection({ reading, p, onSwitch }) {
  const isA = reading==='auditor';
  const copy = HERO[reading];
  return (
    <section id="hero" data-screen-label="Hero" style={{ minHeight:'100vh', display:'flex', flexDirection:'column', justifyContent:'center', padding:'0 clamp(24px,5vw,64px)', backgroundColor:p.bg, color:p.fg }}>
      <div style={{ maxWidth:1080, margin:'0 auto', width:'100%' }}>
        <p style={eyebrowStyle(p.accent)}>{copy.eyebrow}</p>
        <h1 style={{ fontFamily:isA?F.serif:F.sans, fontSize:'clamp(52px,8.5vw,118px)', fontWeight:600, lineHeight:0.92, letterSpacing:'-0.03em', marginBottom:'clamp(24px,3.5vw,44px)' }}>{HERO.name}</h1>
        <h2 style={{ fontFamily:isA?F.serif:F.sans, fontSize:'clamp(22px,3vw,38px)', fontWeight:isA?500:400, lineHeight:1.18, letterSpacing:'-0.012em', maxWidth:'24ch', marginBottom:'clamp(16px,2vw,24px)' }}>{HERO.headline}</h2>
        <p style={{ fontFamily:isA?F.serif:F.mono, fontSize:isA?'clamp(16px,1.8vw,20px)':'clamp(13px,1.4vw,16px)', lineHeight:isA?1.55:1.7, color:p.dim, maxWidth:'40ch', marginBottom:'clamp(40px,6vh,72px)' }}>{copy.sub}</p>
        <LensToggle reading={reading} p={p} onSwitch={onSwitch} />
      </div>
    </section>
  );
}

function LensToggle({ reading, p, onSwitch }) {
  const isA = reading==='auditor';
  const [focused, setFocused] = useState(false);
  const onKey = useCallback((e) => {
    if(e.key==='ArrowLeft'||e.key==='ArrowUp'){e.preventDefault();onSwitch('auditor');}
    else if(e.key==='ArrowRight'||e.key==='ArrowDown'){e.preventDefault();onSwitch('builder');}
  },[onSwitch]);
  const btn = (label,active,onClick) => (
    <button onClick={onClick} style={{ padding:'10px 22px', cursor:'pointer', border:0, background:'transparent', fontFamily:F.mono, fontSize:12, letterSpacing:'0.08em', textTransform:'uppercase', color:active?p.accent:p.dim, opacity:active?1:0.5 }}>{label}</button>
  );
  return (
    <div role="slider" tabIndex={0} aria-label="Reading lens" onKeyDown={onKey} onFocus={()=>setFocused(true)} onBlur={()=>setFocused(false)}
      style={{ display:'inline-flex', alignItems:'stretch', border:`1px solid ${p.line}`, position:'relative', overflow:'hidden', outline:'none', userSelect:'none' }}>
      <div style={{ position:'absolute', top:0, bottom:0, width:'50%', left:isA?0:'50%', backgroundColor:p.accent, opacity:0.08, pointerEvents:'none' }}></div>
      {btn('Auditor',isA,()=>onSwitch('auditor'))}
      <div style={{ width:1, alignSelf:'stretch', backgroundColor:p.line }}></div>
      {btn('Builder',!isA,()=>onSwitch('builder'))}
      {focused && <span style={{ position:'absolute', bottom:-22, left:'50%', transform:'translateX(-50%)', fontFamily:F.mono, fontSize:10, color:p.dim, whiteSpace:'nowrap', opacity:0.6, pointerEvents:'none' }}>← →</span>}
    </div>
  );
}

/* ======== CLOSING WINDOW ======== */
function WindowSection() {
  const w = PAL.window;
  return (
    <section id="argument" data-screen-label="The Closing Window" style={{ backgroundColor:w.bg, color:w.fg }}>
      {/* Intro */}
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'clamp(96px,14vh,200px) clamp(20px,5vw,64px) 48px' }}>
        <p style={eyebrowStyle(w.machine)}>{WINDOW_INTRO.eyebrow}</p>
        <h2 style={{ fontFamily:F.serif, fontSize:'clamp(44px,7vw,88px)', fontWeight:600, lineHeight:0.96, letterSpacing:'-0.02em' }}>{WINDOW_INTRO.headline}</h2>
        <p style={{ fontFamily:F.serif, fontSize:'clamp(19px,2.2vw,24px)', color:w.dim, maxWidth:'46ch', marginTop:24, lineHeight:1.5 }}>{WINDOW_INTRO.lead}</p>
      </div>

      {/* Chart */}
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 clamp(20px,5vw,64px)', position:'relative' }}>
        <div style={{ display:'grid', gridTemplateColumns:'minmax(200px,300px) 1fr', gap:48, alignItems:'center' }}>
          <div>
            {WINDOW_STEPS.map((s,i) => (
              <div key={i} style={{ marginBottom:32 }}>
                <h3 style={{ fontFamily:F.serif, fontSize:'clamp(18px,2vw,24px)', fontWeight:600, lineHeight:1.15, marginBottom:8 }}>{s.h}</h3>
                <p style={{ fontSize:15, color:w.dim, lineHeight:1.55 }}>{s.p}</p>
              </div>
            ))}
          </div>
          <svg viewBox={`0 0 ${CHART.w} ${CHART.h}`} preserveAspectRatio="none" style={{ width:'100%', height:'min(50vh,420px)', display:'block', overflow:'visible' }}>
            <g>{CHART.gridLines.map((gl,i) => <line key={i} x1="30" y1={gl.y} x2="970" y2={gl.y} stroke={w.grid} strokeWidth="1" />)}</g>
            <path d={CHART.gapPath} fill={w.gap}></path>
            <path d={CHART.humanPath} fill="none" stroke={w.human} strokeWidth="2.5"></path>
            <path d={CHART.machinePath} fill="none" stroke={w.machine} strokeWidth="2.5"></path>
            <text x={CHART.lblH.x} y={CHART.lblH.y} textAnchor="end" fill={w.human} style={{ fontFamily:F.mono, fontSize:13, fontWeight:500 }}>human security cycle</text>
            <text x={CHART.lblM.x} y={CHART.lblM.y} textAnchor="end" fill={w.machine} style={{ fontFamily:F.mono, fontSize:13, fontWeight:500 }}>machine-speed iteration</text>
            <text x="6" y={CHART.h-8} fill={w.dim} style={{ fontFamily:F.mono, fontSize:11, letterSpacing:'0.06em' }}>2016</text>
            <text x="918" y={CHART.h-8} fill={w.dim} style={{ fontFamily:F.mono, fontSize:11 }}>2026</text>
            <text x="6" y="14" fill={w.dim} style={{ fontFamily:F.mono, fontSize:11 }}>capability / speed</text>
          </svg>
        </div>
      </div>

      {/* Stats */}
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'clamp(96px,14vh,200px) clamp(20px,5vw,64px) clamp(96px,14vh,200px)', borderTop:`1px solid ${w.grid}`, marginTop:64 }}>
        {WINDOW_STATS.map((s,i) => (
          <div key={i} style={{ padding:'64px 0', borderBottom:i<WINDOW_STATS.length-1?`1px solid ${w.grid}`:'none' }}>
            <div style={{ fontFamily:F.mono, fontSize:'clamp(56px,12vw,132px)', lineHeight:0.9, fontWeight:600, letterSpacing:'-0.04em', color:s.color==='machine'?w.machine:w.human, fontVariantNumeric:'tabular-nums' }}>{s.num}{s.suffix}</div>
            <p style={{ fontSize:'clamp(19px,2.2vw,24px)', color:w.dim, marginTop:16, maxWidth:'42ch', lineHeight:1.5 }}>{s.cap}</p>
            <div style={{ fontFamily:F.mono, fontSize:11, color:w.dim, marginTop:12, letterSpacing:'0.04em', opacity:0.7 }}>{s.src}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ======== THE WORK ======== */
function WorkSection({ reading, p, onSwitch }) {
  const isA = reading==='auditor';
  return (
    <section id="work" data-screen-label="The Work" style={{ backgroundColor:p.bg, color:p.fg, padding:'clamp(96px,14vh,200px) 0' }}>
      <div style={{ maxWidth:1100, margin:'0 auto', padding:'0 clamp(20px,5vw,64px)' }}>
        <header style={{ display:'flex', justifyContent:'space-between', alignItems:'flex-end', gap:32, flexWrap:'wrap', marginBottom:48 }}>
          <div>
            <p style={eyebrowStyle(p.accent)}>The work</p>
            <h2 style={{ fontFamily:isA?F.serif:F.sans, fontSize:'clamp(30px,4vw,50px)', fontWeight:600, letterSpacing:'-0.02em', lineHeight:1.02 }}>The response.</h2>
            <p style={{ fontSize:'clamp(19px,2.2vw,24px)', color:p.dim, maxWidth:'44ch', marginTop:16, lineHeight:1.45, fontFamily:isA?F.serif:F.mono, ...(isA?{}:{fontSize:19}) }}>
              Four years auditing controls at enterprise scale taught me where they fail. I build into the lag instead of writing about it.
            </p>
          </div>
          <LensToggle reading={reading} p={p} onSwitch={onSwitch} />
        </header>

        {PROJECTS.map((proj,i) => {
          const r = isA ? proj.auditor : proj.builder;
          return (
            <article key={i} style={{ display:'grid', gridTemplateColumns:'160px 1fr', gap:32, padding:proj.lead?'64px 0':'48px 0', borderBottom:`1px solid ${p.line}`, alignItems:'baseline' }}>
              <div style={{ fontFamily:F.mono, fontSize:12, letterSpacing:'0.06em', textTransform:'uppercase', color:p.accent, paddingTop:6 }}>{proj.tag}</div>
              <div>
                <h3 style={{ fontFamily:isA?F.serif:F.sans, fontSize:proj.lead?'clamp(24px,3vw,34px)':'clamp(22px,2.6vw,30px)', fontWeight:isA?600:500, letterSpacing:'-0.01em', lineHeight:1.18, maxWidth:'22ch' }}>{r.title}</h3>
                <p style={{ fontSize:15, lineHeight:1.55, marginTop:12, maxWidth:'56ch', fontFamily:isA?F.serif:F.mono, color:p.dim, ...(isA?{}:{lineHeight:1.7}) }}>{r.body}</p>
                <div style={{ fontFamily:F.mono, fontSize:12.5, marginTop:16, letterSpacing:'0.02em', color:p.accent }}>{r.meta}</div>
                <span style={{ display:'inline-block', marginTop:16, fontFamily:F.mono, fontSize:12, letterSpacing:'0.06em', borderBottom:'1px dotted currentColor', paddingBottom:2, opacity:0.6 }}>case study</span>
              </div>
            </article>
          );
        })}
      </div>
    </section>
  );
}

/* ======== FIELD NOTES ======== */
function NotesSection() {
  const p = PAL.auditor;
  return (
    <section id="notes" data-screen-label="Field Notes" style={{ backgroundColor:p.bg, color:p.fg, padding:'clamp(96px,14vh,200px) 0', borderTop:`1px solid ${p.line}` }}>
      <div style={{ maxWidth:760, margin:'0 auto', padding:'0 clamp(20px,5vw,64px)' }}>
        <p style={eyebrowStyle(p.accent)}>Field notes</p>
        <h2 style={{ fontFamily:F.serif, fontSize:'clamp(30px,4vw,50px)', fontWeight:600, letterSpacing:'-0.02em', lineHeight:1.04, maxWidth:'18ch' }}>I publish a position, with the data attached.</h2>
        <p style={{ fontSize:'clamp(19px,2.2vw,24px)', color:p.dim, maxWidth:'50ch', marginTop:16, lineHeight:1.45 }}>Sixteen articles for security and GRC practitioners. The recurring thesis: this is not IT security for AI tools, it is systems security for synthetic cognition.</p>
        <ul style={{ listStyle:'none', marginTop:48 }}>
          {NOTES.map((n,i) => (
            <li key={i} style={{ borderTop:`1px solid ${p.line}`, ...(i===NOTES.length-1?{borderBottom:`1px solid ${p.line}`}:{}) }}>
              <a href="#" onClick={e=>e.preventDefault()} style={{ display:'grid', gap:8, padding:'24px 0', textDecoration:'none', color:'inherit' }}>
                <span style={{ fontFamily:F.serif, fontSize:'clamp(21px,2.4vw,27px)', fontWeight:600, lineHeight:1.2, letterSpacing:'-0.01em' }}>{n.hook}</span>
                <span style={{ color:p.dim, fontSize:15, lineHeight:1.5, maxWidth:'64ch' }}>{n.thesis}</span>
                <span style={{ fontFamily:F.mono, fontSize:11.5, letterSpacing:'0.08em', color:p.accent, marginTop:4 }}>read on LinkedIn →</span>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ======== WHO ======== */
function WhoSection() {
  const p = PAL.auditor;
  return (
    <section id="who" data-screen-label="Who" style={{ backgroundColor:p.bg, color:p.fg, padding:'clamp(96px,14vh,200px) 0', borderTop:`1px solid ${p.line}` }}>
      <div style={{ maxWidth:760, margin:'0 auto', padding:'0 clamp(20px,5vw,64px)' }}>
        <p style={eyebrowStyle(p.accent)}>Who</p>
        <h2 style={{ fontFamily:F.serif, fontSize:'clamp(30px,4vw,50px)', fontWeight:600, letterSpacing:'-0.02em' }}>{WHO.heading}</h2>
        <p style={{ fontSize:'clamp(19px,2.2vw,24px)', color:p.dim, maxWidth:'52ch', marginTop:16, lineHeight:1.45 }}>{WHO.lead}</p>
        <dl style={{ marginTop:48, borderTop:`1px solid ${p.line}` }}>
          {WHO.facts.map((f,i) => (
            <div key={i} style={{ display:'grid', gridTemplateColumns:'180px 1fr', gap:24, padding:'16px 0', borderBottom:`1px solid ${p.line}` }}>
              <dt style={{ fontFamily:F.mono, fontSize:12, letterSpacing:'0.08em', textTransform:'uppercase', color:p.accent, paddingTop:4 }}>{f.k}</dt>
              <dd style={{ fontSize:19, lineHeight:1.55 }}>{f.v}</dd>
            </div>
          ))}
        </dl>
        <a href="#" onClick={e=>e.preventDefault()} style={{ display:'inline-block', marginTop:32, fontFamily:F.mono, fontSize:13, letterSpacing:'0.04em', textDecoration:'none', borderBottom:`1px solid ${p.accent}`, color:p.accent, paddingBottom:3 }}>Download CV (PDF) ↓</a>
      </div>
    </section>
  );
}

/* ======== OUTSIDE ======== */
function OutsideSection() {
  const p = PAL.auditor;
  return (
    <section id="outside" data-screen-label="Outside" style={{ backgroundColor:p.bg, color:p.fg, padding:'clamp(96px,14vh,200px) 0', borderTop:`1px solid ${p.line}` }}>
      <div style={{ maxWidth:760, margin:'0 auto', padding:'0 clamp(20px,5vw,64px)' }}>
        <p style={eyebrowStyle(p.accent)}>Outside the work</p>
        <h2 style={{ fontFamily:F.serif, fontSize:'clamp(30px,4vw,50px)', fontWeight:600, letterSpacing:'-0.02em' }}>The rest of it.</h2>
        <div style={{ marginTop:48, display:'grid', gap:32 }}>
          {OUTSIDE.map((s,i) => (
            <div key={i} style={{ display:'grid', gridTemplateColumns:'180px 1fr', gap:24, paddingTop:24, borderTop:`1px solid ${p.line}` }}>
              <h3 style={{ fontFamily:F.mono, fontSize:12, letterSpacing:'0.08em', textTransform:'uppercase', color:p.accent, fontWeight:500, paddingTop:4 }}>{s.label}</h3>
              <p style={{ fontSize:19, lineHeight:1.5, maxWidth:'56ch', color:p.dim, fontStyle:'italic' }}>{s.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ======== CONTACT ======== */
function ContactSection() {
  const w = PAL.window;
  return (
    <footer id="contact" data-screen-label="Contact" style={{ backgroundColor:w.bg, color:w.fg, padding:'clamp(96px,14vh,200px) clamp(20px,5vw,64px)', textAlign:'center' }}>
      <p style={eyebrowStyle(w.machine)}>Contact</p>
      <h2 style={{ fontFamily:F.serif, fontSize:'clamp(28px,4.4vw,46px)', fontWeight:600, letterSpacing:'-0.015em', lineHeight:1.08, maxWidth:'20ch', margin:'0 auto' }}>{CONTACT.closing}</h2>
      <div style={{ marginTop:48, display:'flex', gap:24, justifyContent:'center', flexWrap:'wrap', fontFamily:F.mono, fontSize:14 }}>
        {CONTACT.links.map((l,i) => (
          <a key={i} href={l.href} onClick={l.href==='#'?e=>e.preventDefault():undefined} style={{ color:w.fg, textDecoration:'none', borderBottom:`1px solid ${w.grid}`, paddingBottom:3 }}>{l.label}</a>
        ))}
      </div>
    </footer>
  );
}

Object.assign(window, { HeroSection, LensToggle, WindowSection, WorkSection, NotesSection, WhoSection, OutsideSection, ContactSection, F });
