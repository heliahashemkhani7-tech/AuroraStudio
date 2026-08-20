import { useTranslation } from "react-i18next";

export default function PortfolioHero() {
  const { t } = useTranslation();
  return (
    <section className="flex flex-col justify-center rtl:pr-5 ltr:pl-5 gap-10 h-100">
      <h1 className="text-5xl text-span">{t("portfolio.header.title")}</h1>
      <p className="text-xl text-text max-w-3xl">{t("portfolio.header.description")}</p>
    </section>
  );
}
