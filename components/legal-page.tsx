import Link from "next/link";
import type { ReactNode } from "react";

export function LegalPage({ title, children }: { title: string; children: ReactNode }) {
  return (
    <main className="legal-page">
      <nav className="nav wrap">
        <Link href="/" className="brand">LOVE PATTERN <i>LAB</i></Link>
        <Link className="back-link" href="/">← Home</Link>
        <span />
      </nav>
      <article className="legal-content wrap">
        <p className="kicker">LOVE PATTERN LAB</p>
        <h1>{title}</h1>
        <p className="legal-updated">Effective September 8, 2026</p>
        {children}
      </article>
    </main>
  );
}
