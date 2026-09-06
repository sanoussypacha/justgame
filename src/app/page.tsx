import Link from "next/link";
import BottomNav from "@/components/BottomNav";
import TopBar from "@/components/TopBar";

export default function HomePage() {
  return (
    <>
      <TopBar />
      <main className="main">
        <h1 className="hero-title">À quoi voulez-vous jouer ?</h1>
        <p className="hero-sub">
          Tes jeux classiques préférés, partout : ordinateur, mobile et
          tablette. Une partie en quelques secondes, sans installation
          obligatoire.
        </p>

        <section className="game-cards" aria-label="Choix des jeux">
          <Link href="/sudoku" className="game-card">
            <div>
              <h2>SUDOKU</h2>
              <p>Clavier + souris sur desktop, tactile sur mobile</p>
            </div>
            <span className="play-link">Jouer →</span>
          </Link>

          <Link href="/snake" className="game-card">
            <div>
              <h2>SNAKE</h2>
              <p>Clavier sur PC, tactile sur mobile</p>
            </div>
            <span className="play-link">Jouer →</span>
          </Link>

          <article className="game-card disabled">
            <div>
              <h2>TETRIX</h2>
              <p>Bientôt disponible</p>
            </div>
            <span className="play-link">Jouer →</span>
          </article>
        </section>

        <div className="quick-links" id="defis">
          <span>Défi du jour</span>
          <span id="classement">Classement</span>
          <span>Parties récentes</span>
          <span id="stats">Statistiques</span>
          <span id="profil">Profil</span>
        </div>
      </main>
      <BottomNav active="Accueil" />
    </>
  );
}
