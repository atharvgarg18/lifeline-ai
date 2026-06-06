import EmergencySOSDashboard from "@/components/emergency/EmergencyDashboard";
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
    {/* <EmergencySOSSection1 />
    <EmergencySOSSection2 />
    <EmergencySOSSection3 />
    <EmergencySOSSection4 /> */}
      <EmergencySOSDashboard />
      <LifelineDashboardSections />
      <LifelineMedicalSections />
      <HealthAnalytics />
    </>
  );
}