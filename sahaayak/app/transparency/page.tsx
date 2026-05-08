import TransparencyDashboard from "../../features/analytics/TransparencyDashboard";

export const metadata = {
  title: "Civic Transparency Dashboard | Sahaayak",
  description: "Explore real-time civic health, department efficiency, and resource accountability across Karnataka.",
};

export default function TransparencyPage() {
  return (
    <main className="w-full min-h-screen">
      <TransparencyDashboard />
    </main>
  );
}
