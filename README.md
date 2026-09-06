# TRI PLAY

Plateforme multi-supports TRI PLAY (Snake + Sudoku + Tetrix).

## Lancer avec Docker Compose

```bash
docker compose up --build
```

Ouvre [http://localhost:3000](http://localhost:3000).

## Développement local

```bash
npm install
npm run dev
```

## Jeux

### Sudoku
- Grille générée (facile / moyen / difficile)
- Desktop : flèches + chiffres + souris
- Mobile : sélection tactile + pavé numérique

### Snake
| Plateforme | Commandes |
|---|---|
| Ordinateur | Flèches ou ZQSD / WASD |
| Mobile / tablette | Boutons tactiles |

### Tetrix
| Plateforme | Commandes |
|---|---|
| Ordinateur | ←→ déplacer, ↑ tourner, ↓ soft drop, Espace hard drop |
| Mobile / tablette | Boutons tactiles (↻ / ←→↓ / ⇓) |
