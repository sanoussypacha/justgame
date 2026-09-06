import BottomNav from "@/components/BottomNav";
import SnakeGame from "@/components/SnakeGame";
import TopBar from "@/components/TopBar";

export default function SnakePage() {
  return (
    <>
      <TopBar title="SNAKE" showBack />
      <main className="main">
        <SnakeGame />
      </main>
      <BottomNav active="Accueil" />
    </>
  );
}
