
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const newLang = i18n.language.startsWith("en") ? "fa" : "en";

    i18n.changeLanguage(newLang);
    localStorage.setItem("language", newLang);
  };

  return (
    <div className="flex gap-2 text-text hover:bg-hover hover:rounded-lg border-span">
      <Button onClick={toggleLanguage} variant="outline">
        {i18n.language.startsWith("en") ? "FA" : "EN"}
      </Button>
    </div>
  );
}
