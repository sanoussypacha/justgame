import Link from "next/link";

type Props = {
  title?: string;
  showBack?: boolean;
};

export default function TopBar({ title = "TRI PLAY", showBack = false }: Props) {
  return (
    <header className="topbar">
      <div style={{ display: "flex", alignItems: "center", gap: "0.85rem" }}>
        {showBack && (
          <Link href="/" aria-label="Retour à l'accueil">
            ← Accueil
          </Link>
        )}
        <div className="brand">
          {title === "TRI PLAY" ? (
            <>
              TRI <span>PLAY</span>
            </>
          ) : (
            title
          )}
        </div>
      </div>
      <div className="topbar-meta">
        <span>Niveau 12</span>
        <span>👤 Profil</span>
      </div>
    </header>
  );
}
