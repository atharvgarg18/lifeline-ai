// import HeroDashboard from "@/components/dashboard/HeroDashboard";
import LifeLineNavbar from "@/components/navbar/LifeLineNavbar";

export default function Home() {
  return (
    <main
  className="min-h-screen"
  style={{
    background:
      "radial-gradient(circle at top left, rgba(0,217,255,.06), transparent 20%), radial-gradient(circle at top right, rgba(255,59,92,.05), transparent 20%), linear-gradient(180deg, #030712 0%, #020617 100%)",
  }}
>
      <LifeLineNavbar />
      {/* <HeroDashboard /> */}
    </main>
  );
}