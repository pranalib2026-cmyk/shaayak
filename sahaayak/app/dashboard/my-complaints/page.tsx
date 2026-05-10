import Navbar from "../../../components/ui/Navbar";
import BackButton from "../../../components/ui/BackButton";
import MyComplaintsPage from "../../../features/dashboard/MyComplaintsPage";

export const metadata = {
  title: "My Complaints | Sahaayak",
  description: "Track your submitted complaints on Sahaayak.",
};

export default function Page() {
  return (
    <main className="w-full min-h-screen bg-[#0a0a0c]">
      <Navbar />
      <div className="relative pt-20 px-4 max-w-7xl mx-auto">
        <BackButton />
        <MyComplaintsPage />
      </div>
      
      {/* Background decorations */}
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-cyan-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-fuchsia-500/10 rounded-full blur-[120px] pointer-events-none -z-10" />
    </main>
  );
}
