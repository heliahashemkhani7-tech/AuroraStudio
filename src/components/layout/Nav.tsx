import PillNav from "../animiations/PillNav";
import { useLocation } from "react-router-dom";
import { useTranslation } from "react-i18next";

export default function Nav() {
  const location = useLocation();
  const { t } = useTranslation();

  return (
    
    <PillNav
    className="text-xl"
      logo="/imgs/aurora_logo.png"
      logoAlt="Aurora Studio"
      items={[
        { label: t("nav.home"), href: "/" },
        { label: t("nav.about"), href: "/about" },
        { label: t("nav.portfolio"), href: "/portfolio" },
        { label: t("nav.contact"), href: "/contact" },
      ]}
      activeHref={location.pathname}
    />
  );
}
