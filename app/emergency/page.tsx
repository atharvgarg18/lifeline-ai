import EmergencySOSDashboard from "@/components/emergency/EmergencyDashboard";
import SOSQuickRequest from "@/components/emergency/SOSQuickRequest";
import LifelineMedicalSections from "@/components/emergency/MedicalStatusSection";
import LifelineDashboardSections from "@/components/emergency/EmergencyResponseSections";
import { HealthAnalytics } from "@/components/emergency/HealthAnalytics";

export default function Page() {
  return (
    <>
      <SOSQuickRequest />
      <EmergencySOSDashboard />
      <LifelineDashboardSections />
      <LifelineMedicalSections />
      <HealthAnalytics />
    </>
  );
}