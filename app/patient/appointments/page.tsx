import AppointmentDetailsSection from "@/components/appointments/AppointmentDetailsSection";
import AppointmentsHero from "@/components/appointments/AppointmentsHero";
import AppointmentsSection2 from "@/components/appointments/AppointmentsSection2";
import AppointmentsSection4 from "@/components/appointments/AppointmentsSection4";


export default function HospitalsPage() {
  return (
    <>
      <AppointmentsHero />
      <AppointmentsSection2 />
      <AppointmentDetailsSection />
      <AppointmentsSection4 />
      
    </>
  );
}