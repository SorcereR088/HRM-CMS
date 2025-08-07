'use client'
type NavLink = {
  label: string
  url: string
}

type NavbarProps = {
  title: { url: string } // logo image object
  links: NavLink[]
  ctaLabel: string
  ctaUrl: string
}

export default function Navbar({ title, links, ctaLabel, ctaUrl }: NavbarProps) {
  return (
    <nav className="flex justify-between items-center px-[140px] py-5  bg-white">
      <div className="flex items-center">
        <img src={title.url} alt="Site Logo" className="h-10 w-auto" />
      </div>

      <ul className="flex gap-6">
        {links.map((link, index) => (
          <li key={index}>
            <a href={link.url} className="hover:underline">
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      <a href={ctaUrl} className="bg-Teal px-4 py-2 rounded text-white">
        {ctaLabel}
      </a>
    </nav>
  )
}
