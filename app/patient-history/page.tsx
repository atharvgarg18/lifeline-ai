import LifeLineNavbar from "@/components/navbar/LifelineNavbar";
import DashboardMiddleSection from "@/components/patient-history/DashboardMiddleSection";
import HealthAnalyticsSection from "@/components/patient-history/HealthAnalyticsSection";
import PatientProfileHeader from "@/components/patient-history/PatientProfileHeader";

export default function PatientHistoryPage() {
  return (
    <LifeLineNavbar>
      <div className="p-6 space-y-6">
        <PatientProfileHeader />
        <DashboardMiddleSection />
        <HealthAnalyticsSection />
      </div>
    </LifeLineNavbar>
  );
}