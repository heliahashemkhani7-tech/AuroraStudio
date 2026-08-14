import { Button } from "@/components/ui/button";
import i18n from "@/i18n";

export default function LanguageSwitcher() {
  const changeLanguage = (lang: "en" | "fa") => {
    i18n.changeLanguage(lang);
  };

  return (
    <div className="flex gap-2 text-hero-background">
      <Button onClick={() => changeLanguage("en")}>EN</Button>

      <Button onClick={() => changeLanguage("fa")}>FA</Button>
    </div>
  );
}
