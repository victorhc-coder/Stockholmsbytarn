import Link from 'next/link'

export default function Footer() {
  return (
    <footer className="bg-white border-t border-gray-100 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {/* Brand */}
          <div>
            <Link href="/" className="flex items-center gap-2.5 mb-3">
              <div className="w-8 h-8 rounded-lg bg-brand-500 flex items-center justify-center">
                <span className="font-serif text-white text-lg font-bold leading-none">S</span>
              </div>
              <span className="font-serif text-gray-900">Stockholmsbytarn</span>
            </Link>
            <p className="text-sm text-gray-500 leading-relaxed">
              Byt hyresrätt i Stockholm — tryggt och gratis.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Tjänsten</h3>
            <ul className="space-y-2">
              {[
                { href: '/annonser', label: 'Bläddra annonser' },
                { href: '/lagg-upp', label: 'Lägg upp annons' },
                { href: '/logga-in', label: 'Logga in' },
                { href: '/registrera', label: 'Skapa konto' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-500 hover:text-brand-600 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Info */}
          <div>
            <h3 className="text-sm font-semibold text-gray-900 mb-3">Om oss</h3>
            <ul className="space-y-2 mb-3">
              {[
                { href: '/om-oss', label: 'Om Stockholmsbytarn' },
                { href: '/hur-det-fungerar', label: 'Hur det fungerar' },
                { href: '/sa-byter-du', label: 'Så byter du lägenhet' },
              ].map(link => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-500 hover:text-brand-600 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="mt-8 pt-6 border-t border-gray-100 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="text-xs text-gray-400">
            © {new Date().getFullYear()} Stockholmsbytarn. Gratis och öppen tjänst.
          </p>
          <p className="text-xs text-gray-400">
            Byggt med Next.js & Supabase
          </p>
        </div>
      </div>
    </footer>
  )
}
