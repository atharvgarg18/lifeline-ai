
import PharmacySection1 from '@/components/pharmacy/PharmacySection1';
import PharmacySection2 from '@/components/pharmacy/PharmacySection2';
import PharmacySection3 from '@/components/pharmacy/PharmacySection3';

export default function PharmacyPage() {
  return (
    <div className="space-y-6 p-6">
      <PharmacySection1 />
      <PharmacySection2 />
      <PharmacySection3 />
    </div>
  );
}
