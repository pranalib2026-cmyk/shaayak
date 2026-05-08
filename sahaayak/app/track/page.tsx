import TrackingExperience from "../../features/tracking/TrackingExperience";
import BackButton from "../../components/ui/BackButton";

export const metadata = {
  title: "Track Complaint | Sahaayak",
  description: "Monitor your civic complaint status with real-time AI-assisted tracking.",
};

export default function TrackPage() {
  return (
    <main className="w-full min-h-screen">
      <BackButton />
      <TrackingExperience />
    </main>
  );
}
