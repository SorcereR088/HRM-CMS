'use client'

type NavLink = {
  label: string
  url: string
}

type NavbarProps = {
  title: string
  links: NavLink[]
  ctaLabel: string
  ctaUrl: string
}

export default function Navbar({ title, links, ctaLabel, ctaUrl }: NavbarProps) {
  return (
    <nav className="flex justify-between items-center p-6 shadow-md bg-white">
      <div className="font-bold text-xl">{title}</div>
      <ul className="flex gap-6">
        {links.map((link, index) => (
          <li key={index}>
            <a href={link.url} className="hover:underline">
              {link.label}
            </a>
          </li>
        ))}
      </ul>
      <a href={ctaUrl} className="bg-green-500 px-4 py-2 rounded text-white">
        {ctaLabel}
      </a>
    </nav>
  )
}
