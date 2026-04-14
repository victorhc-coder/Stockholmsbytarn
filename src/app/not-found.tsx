import Link from 'next/link'

export default function NotFound() {
  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="text-center">
        <div className="font-serif text-8xl text-brand-100 font-bold mb-4">404</div>
        <h1 className="font-serif text-2xl text-gray-900 mb-2">Sidan hittades inte</h1>
        <p className="text-gray-500 text-sm mb-6">
          Annonsen kan ha tagits bort eller länken stämmer inte.
        </p>
        <div className="flex gap-3 justify-center">
          <Link href="/annonser" className="btn-primary">
            Bläddra annonser
          </Link>
          <Link href="/" className="btn-secondary">
            Till startsidan
          </Link>
        </div>
      </div>
    </div>
  )
}
