import type { Metadata } from "next";
import Link from "next/link";
import "./globals.css";

export const metadata: Metadata = {
  title: "TRI PLAY — Sudoku",
  description:
    "Tes jeux classiques préférés, partout : ordinateur, mobile et tablette.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="fr">
      <body>
        <div className="app-shell">
          <header className="topbar">
            <div className="brand">
              TRI <span>PLAY</span>
            </div>
            <div className="topbar-meta">
              <span>Niveau 1</span>
              <span>Profil</span>
            </div>
          </header>
          <main className="main">{children}</main>
          <footer className="bottombar">
            <nav className="nav-links">
              <Link className="active" href="/">
                Accueil
              </Link>
              <Link href="/sudoku">Sudoku</Link>
              <span>Défis</span>
              <span>Classement</span>
              <span>Statistiques</span>
              <span>Profil</span>
            </nav>
          </footer>
        </div>
      </body>
    </html>
  );
}
