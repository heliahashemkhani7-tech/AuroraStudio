import { Card, CardContent } from "@/components/ui/card";
import { Icon } from "@iconify/react";
import { useTranslation } from "react-i18next";

export default function ContactInfo() {
  const { t } = useTranslation();

  return (
    <Card className="border-2 border-border">
      <CardContent>
        <h2 className="mb-7 text-2xl font-semibold text-text">
          {t("contact.form.title")}
        </h2>

        <div className="flex flex-col gap-7 text-text">
          <div className="flex items-start gap-4">
            <Icon
              icon="mdi:email-outline"
              className="mt-0.5 shrink-0 text-2xl text-primary"
            />

            <div className="flex flex-col gap-1 text-text">
              <span className="text-sm tracking-wider text-muted-foreground">
                {t("contact.info.email.label")}
              </span>

              <span className="text-lg">{t("contact.info.email.value")}</span>
            </div>
          </div>

          <div className="flex items-start gap-4">
            <Icon
              icon="mdi:map-marker-outline"
              className="mt-0.5 shrink-0 text-2xl text-primary"
            />

            <div className="flex flex-col gap-1">
              <span className="text-sm tracking-wider text-muted-foreground">
                {t("contact.info.studio.label")}
              </span>

              <span className="text-lg">
                {t("contact.info.studio.address.line1")}
              </span>

              <span className="text-hambur md:text-lg">
                {t("contact.info.studio.address.line2")}
              </span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
