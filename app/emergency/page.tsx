import EmergencySOSDashboard from "@/components/emergency/EmergencyDashboard";
import SOSQuickRequest from "@/components/emergency/SOSQuickRequest";
import LifelineMedicalSections from "@/components/emergency/MedicalStatusSection";
import LifelineDashboardSections from "@/components/emergency/EmergencyResponseSections";
import { HealthAnalytics } from "@/components/emergency/HealthAnalytics";
// import EmergencySOSSection1 from "@/components/emergency/EmergencySOSSection1";
// import EmergencySOSSection2 from "@/components/emergency/EmergencySOSSection2";
// import EmergencySOSSection3 from "@/components/emergency/EmergencySOSSection3";
// import EmergencySOSSection4 from "@/components/emergency/EmergencySOSSection4";

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