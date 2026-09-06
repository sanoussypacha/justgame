import Link from "next/link";

const links = [
  { href: "/", label: "Accueil" },
  { href: "/#defis", label: "Défis" },
  { href: "/#classement", label: "Classement" },
  { href: "/#stats", label: "Statistiques" },
  { href: "/#profil", label: "Profil" },
];

export default function BottomNav({ active = "Accueil" }: { active?: string }) {
  return (
    <nav className="bottom-nav" aria-label="Navigation principale">
      {links.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className={link.label === active ? "active" : undefined}
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}
