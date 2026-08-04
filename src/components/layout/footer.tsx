import Link from "next/link"

import { Container } from "@/components/layout/container"
import { Logo } from "@/components/shared/logo"
import {
  GitHubIcon,
  LinkedInIcon,
  XIcon,
} from "@/components/shared/social-icons"
import { APP_NAME, APP_TAGLINE, FOOTER_LINKS } from "@/constants/nav"

const SOCIAL_LINKS: { label: string; href: string; icon: typeof XIcon }[] = [
  { label: "X (Twitter)", href: "https://x.com", icon: XIcon },
  { label: "GitHub", href: "https://github.com", icon: GitHubIcon },
  { label: "LinkedIn", href: "https://linkedin.com", icon: LinkedInIcon },
]

export function Footer() {
  return (
    <footer className="border-t border-border/60 bg-muted/30">
      <Container className="py-14">
        <div className="grid grid-cols-2 gap-10 md:grid-cols-4 lg:grid-cols-5">
          <div className="col-span-2 flex flex-col gap-4 lg:col-span-2">
            <Logo />
            <p className="max-w-xs text-sm leading-relaxed text-muted-foreground">
              {APP_TAGLINE} Grocery shopping, reimagined with AI.
            </p>
            <div className="flex items-center gap-2">
              {SOCIAL_LINKS.map(({ label, href, icon: Icon }) => (
                <a
                  key={label}
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={`${APP_NAME} on ${label}`}
                  className="flex size-8 items-center justify-center rounded-lg border border-border text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
                >
                  <Icon className="size-3.5" aria-hidden />
                </a>
              ))}
            </div>
          </div>

          {FOOTER_LINKS.map((column) => (
            <nav key={column.title} aria-label={column.title}>
              <h3 className="mb-4 text-sm font-semibold">{column.title}</h3>
              <ul className="flex flex-col gap-2.5">
                {column.links.map((link) => (
                  <li key={link.href}>
                    <Link
                      href={link.href}
                      className="text-sm text-muted-foreground transition-colors hover:text-foreground"
                    >
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-border/60 pt-6 sm:flex-row">
          <p className="text-xs text-muted-foreground">
            © {new Date().getFullYear()} {APP_NAME}. All rights reserved.
          </p>
          <p className="text-xs text-muted-foreground">
            Built with Next.js, Tailwind CSS &amp; a whole lot of AI.
          </p>
        </div>
      </Container>
    </footer>
  )
}
