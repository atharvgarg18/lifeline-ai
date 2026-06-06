
import SettingsAIPreferences from "@/components/settings/SettingsAIPreferences";
import SettingsHero from "@/components/settings/SettingsHero";
import SettingsSecurity from "@/components/settings/SettingsSecurity";


export default function Page() {
  return (
    <>
      <SettingsHero />
      <SettingsSecurity />
      <SettingsAIPreferences />
      
    </>
  );
}