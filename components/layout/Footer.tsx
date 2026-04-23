export default function Footer() {
    return (
      <footer className="border-t border-[var(--border)] mt-32">
        <div className="max-w-6xl mx-auto px-6 py-10
          flex flex-col md:flex-row items-center justify-between gap-4">
  
          <span className="font-mono font-bold text-base">
            yameen<span style={{ color: 'var(--accent)' }}>.</span>
          </span>
  
          <p className="text-xs text-[var(--muted)]">
            Lead Product Designer · Chennai, India
          </p>
  
          <p className="text-xs text-[var(--muted)]">
            © {new Date().getFullYear()} Yameen. Built with Next.js
          </p>
  
        </div>
      </footer>
    )
  }