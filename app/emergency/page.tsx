import EmergencySOSDashboard from "@/components/emergency/EmergencyDashboard";
import LifelineMedicalSections from "@/components/emergency/MedicalStatusSection";
import LifelineDashboardSections from "@/components/emergency/EmergencyResponseSections";
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