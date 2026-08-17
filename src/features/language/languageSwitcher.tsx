import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";

export default function LanguageSwitcher() {
  const { i18n } = useTranslation();

  const toggleLanguage = () => {
    const currentLang = i18n.language;
    const newLang = currentLang === "en" ? "fa" : "en";
    i18n.changeLanguage(newLang);
  };

  return (
    <div className="flex gap-2 text-white hover:bg-hover hover:rounded-lg  border-span ">
      <Button onClick={toggleLanguage} variant="outline">
        {i18n.language === "en" ? "FA" : "EN"}
      </Button>
    </div>
  );
}
