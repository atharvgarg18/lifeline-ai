import EmergencySOSDashboard from "@/components/emergency/EmergencySOSDashboard";
import SOSQuickRequest from "@/components/emergency/SOSQuickRequest";
import LifelineMedicalSections from "@/components/emergency/LifelineMedicalSections";
import LifelineDashboardSections from "@/components/emergency/LifelineDashboardSections";
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