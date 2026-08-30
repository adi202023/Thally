import Link from "next/link"

const columns = [
  {
    heading: "Platform",
    links: [
      { label: "Changelog", href: "/docs" },
      { label: "Status", href: "/audit" },
      { label: "GitHub", href: "https://github.com/adi202023/Thally" },
    ],
  },
  {
    heading: "Legal",
    links: [
      { label: "Privacy", href: "/docs/permissions" },
      { label: "Terms", href: "/docs/permissions" },
      { label: "Support", href: "/support" },
    ],
  },
]

export function LandingFooter() {
  return (
    <footer className="relative border-t border-border bg-background/90 backdrop-blur-md">
      <div className="mx-auto grid max-w-7xl grid-cols-1 gap-10 px-6 py-16 lg:px-12 md:grid-cols-[1.5fr_1fr_1fr]">
        <div>
          <div className="flex items-center gap-2.5">
            <span className="grid size-7 place-items-center rounded-lg border border-border bg-card text-xs font-bold text-foreground">
              T
            </span>
            <span className="text-lg font-bold tracking-tight text-foreground">Thally</span>
          </div>
          <p className="mt-3 max-w-xs text-pretty text-sm leading-relaxed text-muted-foreground">
            Engineered for the craft. Precision data tools for modern development teams.
          </p>
        </div>

        {columns.map((col) => (
          <div key={col.heading}>
            <h3 className="font-mono text-xs uppercase tracking-wider text-muted-foreground">{col.heading}</h3>
            <ul className="mt-4 flex flex-col gap-3 list-none p-0 m-0">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground transition-colors hover:text-[#F5A623] no-underline"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </footer>
  )
}

export default LandingFooter
