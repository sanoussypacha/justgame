import BottomNav from "@/components/BottomNav";
import TetrixGame from "@/components/TetrixGame";
import TopBar from "@/components/TopBar";

export default function TetrixPage() {
  return (
    <>
      <TopBar title="TETRIX" showBack />
      <main className="main">
        <TetrixGame />
      </main>
      <BottomNav active="Accueil" />
    </>
  );
}
