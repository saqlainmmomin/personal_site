// page-data.jsx — All copy, project data, chart geometry, notes

/* ======== PALETTES ======== */
const PAL = {
  auditor: { bg:'#f3f3f1', fg:'#1a1a17', dim:'#55534d', accent:'#0e6b5e', line:'#dcdcd6', bg2:'#eceae4' },
  builder: { bg:'#0c0e13', fg:'#e3e8ee', dim:'#8a97a8', accent:'#6ea8fe', line:'#1d2530', bg2:'#12151c' },
  window:  { bg:'#07080b', fg:'#e8ecf2', dim:'#6f7a8a', grid:'#161a22', machine:'#f5a623', human:'#6ea8fe', gap:'rgba(245,166,35,0.10)' },
};

/* ======== HERO COPY ======== */
const HERO = {
  name: 'Saqlain Momin',
  headline: 'I see risk at the enterprise level, and I build the tools to close the gaps I find.',
  auditor: { eyebrow:'Cyber Strategy & Governance', sub:'Four years auditing controls at enterprise scale\u2009\u2014\u2009I know why a control exists, not just that someone ticked the box.' },
  builder: { eyebrow:'Build & Ship', sub:'Async Python, FastAPI, the Anthropic SDK, Swift, n8n. Understand by shipping.' },
};

/* ======== CLOSING WINDOW ======== */
const WINDOW_INTRO = {
  eyebrow: 'The argument',
  headline: 'The window is closing.',
  lead: 'Defenders run on human cycles. Quarterly scans, annual pentests, patch SLAs measured in weeks. Attackers now run on machine cycles. The gap between the two is the story of my work.',
};

const WINDOW_STEPS = [
  { h:'Two timelines, same starting point.', p:'A decade ago, defenders and attackers moved at roughly the same pace. Both bounded by human effort, human review, human salaries.' },
  { h:'Then one of them stopped being human.', p:'AI task autonomy is doubling every 89 days. Vulnerability discovery windows collapse from months to minutes.' },
  { h:"The defender's line barely moves.", p:'Frameworks lag reality by three to five years. ISO 27001 was updated in 2022, a decade overdue. NIST CSF only added Govern in 2024.' },
  { h:'This shaded gap is the risk.', p:'Every defensive delay is now measured against autonomous iteration. The structural disadvantage compounds daily. This is the space I build into.' },
];

const WINDOW_STATS = [
  { num:'89', suffix:' days', color:'machine', cap:'The time it takes for AI task autonomy to double. Your patch cycle did not get twice as fast this quarter.', src:'METR' },
  { num:'97', suffix:'M', color:'machine', cap:'Downloads weaponised in a single PyPI supply-chain attack. It was caught only because it had a bug that crashed machines. That is luck, not a control.', src:'PyPI transitive dependency attack' },
  { num:'3\u20135', suffix:' yrs', color:'human', cap:'How far compliance frameworks lag the threats they are meant to govern. The standards exist. The migration does not.', src:'ISO 27001:2022 / NIST CSF 2.0' },
];

/* ======== CHART GEOMETRY (from chart.ts) ======== */
const CW = 1000, CH = 520, padB = 40, padT = 20;
const cx = (t) => 30 + t * 9;
const yb = CH - padB, cspan = yb - padT;
const humanH = (t) => t * 1.0;
const K = 0.045, expMax = Math.exp(K * 100) - 1;
const expH = (t) => ((Math.exp(K * t) - 1) / expMax) * cspan;
const humanY = (t) => yb - humanH(t);
const machineY = (t) => yb - expH(t);

function mkPath(fn) { let d=''; for(let t=0;t<=100;t+=2) d+=(t===0?'M':'L')+cx(t).toFixed(1)+' '+fn(t).toFixed(1)+' '; return d; }
const CHART = {
  w: CW, h: CH,
  humanPath: mkPath(humanY),
  machinePath: mkPath(machineY),
  gapPath: (function(){ let d=mkPath(machineY); for(let t=100;t>=0;t-=2) d+='L'+cx(t).toFixed(1)+' '+humanY(t).toFixed(1)+' '; return d+'Z'; })(),
  lblH: { x: cx(100)-8, y: humanY(100)-12 },
  lblM: { x: cx(100)-8, y: Math.max(padT+14, machineY(100)-12) },
  gridLines: [0,1,2,3,4,5].map(i => ({ y: 20 + i * ((CH-60)/5) })),
};

/* ======== PROJECTS ======== */
const PROJECTS = [
  {
    tag:'compliance maturity platform', lead:true,
    builder:{ title:'Six frameworks, 400 controls, one adaptive engine.', body:'A three-phase engine cuts 157 questions to about 35. Desk review pre-fills from documents, a tier engine assigns depth, a screening pass infers the rest.', meta:'Python 3.13 \u00b7 FastAPI \u00b7 Anthropic SDK \u00b7 SQLAlchemy' },
    auditor:{ title:'It closes the self-attestation gap I watched repeat across every client.', body:'Most platforms accept what a company declares about itself. Self-attestation is not assurance. CyberAssess reads the evidence first, the way a seasoned auditor does.', meta:'6 frameworks \u00b7 400 controls \u00b7 157 to 35 questions \u00b7 0 missed of 15' },
  },
  {
    tag:'cyber due diligence for M&A', lead:true,
    builder:{ title:'Six scanners, running in parallel.', body:'Async Python so the scanners run concurrently, because the speed is the product. A deterministic red-flag detector runs before the AI analysis.', meta:'async Python \u00b7 FastAPI \u00b7 React 19' },
    auditor:{ title:'A three-day due-diligence review is already a control failure.', body:'Attackers iterate at machine speed. If it takes three days to know whether a target is sound, the answer arrives after it matters. Speed is a control.', meta:'6 concurrent scanners \u00b7 3 days to 60 seconds' },
  },
  {
    tag:'evidence-based compliance',
    builder:{ title:'Full-stack on Next.js 14 and Supabase.', body:'Auth, storage, and row-level security out of the box, Docker for deployment flexibility.', meta:'Next.js 14 \u00b7 Supabase \u00b7 Docker' },
    auditor:{ title:'Built to kill self-attestation.', body:'An AI analyzes the actual document, a human confirms. That is the minimum standard that should exist, and almost no tooling meets it.', meta:'evidence first \u00b7 human confirms' },
  },
  {
    tag:'AI capability tracker',
    builder:{ title:'A capability tracker scored against my own profile.', body:'React, Express, SQLite, Gemini, an n8n workflow that ingests AI news automatically.', meta:'React \u00b7 Express \u00b7 SQLite \u00b7 Gemini \u00b7 n8n' },
    auditor:{ title:'I track AI capability the way I track a threat landscape.', body:'Quarterly shifts matter. Generic AI news is noise; relevance to the work is the signal.', meta:'quarterly shifts \u00b7 signal over noise' },
  },
];

/* ======== FIELD NOTES ======== */
const NOTES = [
  { hook:'The recursion is tightening.', thesis:'AI agents are no longer tools. They have inboxes, credentials, execution budgets, and production access. The relevant security object is an autonomous system, not a chatbot.' },
  { hook:'The control problem just became a deployment problem.', thesis:'Code autonomy, agent persistence, and silicon economics colliding in the threat landscape.' },
  { hook:'CI/CD pipelines are already autonomous agents.', thesis:'A pipeline with publish tokens reads environmental state, chains tools, and executes with minimal human oversight.' },
  { hook:'The standards exist. The migration does not.', thesis:'Post-quantum cryptography is not a cryptography problem for enterprises. It is an inventory, vendor-management, and migration-timeline problem.' },
  { hook:'The environment is part of the attack surface.', thesis:'An attacker does not need model access if they can place content where the agent will read it.' },
];

/* ======== WHO ======== */
const WHO = {
  heading: 'The audit grounding.',
  lead: 'Pre-certification readiness for ISO 27001, 27701, and 22301. Third-party risk program design for financial services and fintech. Technology risk assessments and board-level reporting.',
  facts: [
    { k:'Role', v:'Assistant Manager, Cyber Strategy & Governance, at a Big Four firm' },
    { k:'Certifications', v:'ISO 27001, ISO 27701, ISO 22301 Lead Auditor' },
    { k:'Education', v:'B.Tech in Information Technology and MBA in Finance, NMIMS' },
    { k:'Sectors', v:'Financial services, fintech, SaaS' },
  ],
};

/* ======== OUTSIDE ======== */
const OUTSIDE = [
  { label:'Reading', body:'[PLACEHOLDER] What you are reading now, and the recurring kind of thing you read. One or two specific titles or domains beat a vague genre.' },
  { label:"What I'm chasing", body:'[PLACEHOLDER] Where you are taking the work over the next few years. A concrete direction, not a mission statement.' },
  { label:'Off the clock', body:'[PLACEHOLDER] Two or three specific things. Concrete beats categorical.' },
];

/* ======== CONTACT ======== */
const CONTACT = {
  closing: 'The frameworks will catch up eventually. I would rather be early.',
  links: [
    { label:'saqlainmmomin@gmail.com', href:'mailto:saqlainmmomin@gmail.com' },
    { label:'linkedin', href:'https://www.linkedin.com/in/saqlain-musa/' },
    { label:'github', href:'#' },
  ],
};

Object.assign(window, { PAL, HERO, WINDOW_INTRO, WINDOW_STEPS, WINDOW_STATS, CHART, PROJECTS, NOTES, WHO, OUTSIDE, CONTACT });
