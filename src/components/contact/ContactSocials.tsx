import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";

const socials = [
  {
    key: "instagram",
    icon: "mdi:instagram",
    href: "#",
  },
  {
    key: "linkedin",
    icon: "mdi:linkedin",
    href: "#",
  },
  {
    key: "telegram",
    icon: "mdi:telegram",
    href: "https://t.me/helia_hk3",
  },
  {
    key: "twitter",
    icon: "mdi:twitter",
    href: "#",
  },
];

export default function ContactSocials() {
  const { t } = useTranslation();

  return (
    <Card className="border-2 border-border">
      <CardContent>
        <h2 className="mb-8 text-2xl font-semibold text-text">
          {t("contact.connect.title")}
        </h2>

        <div className="grid grid-cols-2 gap-x-10 gap-y-5">
          {socials.map((social) => (
            <a
              key={social.key}
              href={social.href}
              className="flex items-center gap-3 text-text transition-colors"
            >
              <span className="flex size-11  items-center justify-center rounded-full text-text text-2xl bg-glass-bg">
                <Icon icon={social.icon} className="" />
              </span>

              <span className="text-lg text-muted-foreground">
                {t(`contact.connect.socials.${social.key}`)}
              </span>
            </a>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
