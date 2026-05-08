import HeatmapDashboard from "../../features/dashboard/HeatmapDashboard";
import BackButton from "../../components/ui/BackButton";

export const metadata = {
  title: "Karnataka Live Heatmap | Sahaayak",
  description: "Real-time civic complaint monitoring and analysis across Karnataka.",
};

export default function DashboardPage() {
  return (
    <main className="w-full h-screen">
      <BackButton />
      <HeatmapDashboard />
    </main>
  );
}