export default function Footer() {
  return (
    <footer className="px-6 lg:px-28 py-8 border-t border-[var(--color-line)] flex flex-col sm:flex-row items-center justify-between gap-3 font-mono text-[11px] text-[var(--color-muted)]">
      <span>© {new Date().getFullYear()} Shweta Rajpara. Built with React, Framer Motion &amp; more chai than advisable.</span>
      <span>v2.4.1 — status: <span className="text-[var(--color-teal)]">deployed</span></span>
    </footer>
  )
}
