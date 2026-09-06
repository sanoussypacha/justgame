import Link from "next/link";

export default function HomePage() {
  return (
    <>
      <section className="hero">
        <h1>À QUOI VOULEZ-VOUS JOUER ?</h1>
        <p>
          Tes jeux classiques préférés, partout : ordinateur, mobile et
          tablette. Une partie en quelques secondes, sans installation
          obligatoire.
        </p>
      </section>

      <section className="game-grid">
        <Link className="game-card" href="/sudoku">
          <div>
            <h2>SUDOKU</h2>
            <p>Clavier + souris sur desktop, tactile sur mobile.</p>
          </div>
          <span className="play-link">Jouer →</span>
        </Link>

        <div className="game-card disabled" aria-disabled="true">
          <div>
            <h2>SNAKE</h2>
            <p>Bientôt disponible (branche dédiée).</p>
          </div>
          <span className="play-link">Bientôt</span>
        </div>

        <div className="game-card disabled" aria-disabled="true">
          <div>
            <h2>TETRIX</h2>
            <p>Bientôt disponible (branche dédiée).</p>
          </div>
          <span className="play-link">Bientôt</span>
        </div>
      </section>
    </>
  );
}
