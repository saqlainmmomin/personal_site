import { Builds } from '@/components/builds/Builds'
import { Contact } from '@/components/contact/Contact'
import { Credentials } from '@/components/credentials/Credentials'
import { Experience } from '@/components/experience/Experience'
import { Hero } from '@/components/hero/Hero'
import { Nav, type NavSection } from '@/components/Nav'
import { FieldNotes } from '@/components/writing/FieldNotes'

// Section anchors match site-v2 so existing links keep resolving.
const sections: NavSection[] = [
  { id: 'experience', index: '01', label: 'Engagements' },
  { id: 'builds', index: '02', label: 'Builds' },
  { id: 'credentials', index: '03', label: 'Credentials' },
  { id: 'writing', index: '04', label: 'Field notes' },
  { id: 'contact', index: '05', label: 'Contact' },
]

export default function App() {
  return (
    <>
      <a href="#main" className="sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-50 focus:bg-ink focus:px-4 focus:py-2 focus:text-paper">
        Skip to content
      </a>
      <Nav sections={sections} />
      <main id="main">
        <Hero />
        <Experience />
        <Builds />
        <Credentials />
        <FieldNotes />
        <Contact />
      </main>
      <footer className="flex flex-wrap justify-between gap-2 border-t border-line px-page py-6 font-mono text-[11px] tracking-[0.15em] text-ink-2 uppercase">
        <p>© 2026 Saqlain Momin</p>
        <p>Designed and built in Bangalore</p>
      </footer>
    </>
  )
}
