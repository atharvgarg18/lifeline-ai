import EmergencySOSDashboard from "@/components/emergency/EmergencySOSDashboard";
import LifelineMedicalSections from "@/components/emergency/LifelineMedicalSections";
import LifelineDashboardSections from "@/components/emergency/LifelineDashboardSections";
import { HealthAnalytics } from "@/components/emergency/HealthAnalytics";

export default function Page() {
  return (
    <>
      <EmergencySOSDashboard />
      <LifelineDashboardSections />
      <LifelineMedicalSections />
      <HealthAnalytics />
    </>
  );
}