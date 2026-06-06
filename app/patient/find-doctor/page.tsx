import AISpecialistRecommendation from "@/components/find-doctor/AISpecialistRecommendation_1";
import DoctorProfileBooking from "@/components/find-doctor/DoctorProfileBooking_1";
import FindDoctorHero from "@/components/find-doctor/FindDoctorHero";
import TopDoctorsSection from "@/components/find-doctor/TopDoctorsSection";

export default function FindDoctorPage() {
  return (
    <div className="space-y-6">
      <FindDoctorHero />
      <TopDoctorsSection />
      <AISpecialistRecommendation />
      <DoctorProfileBooking />
    </div>
  );
}