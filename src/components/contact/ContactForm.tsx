import { useTranslation } from "react-i18next";
import { ArrowRight } from "lucide-react";
import { useState } from "react";

import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import ElectricBorder from "../animiations/ElectricBorder";

export default function ContactForm() {
  const { t } = useTranslation();
  const [projectType, setProjectType] = useState("");

  const projectTypeLabels = {
    "web-design": t("contact.form.projectType.options.webDesign"),
    "web-development": t("contact.form.projectType.options.webDevelopment"),
    branding: t("contact.form.projectType.options.branding"),
    "ui-ux": t("contact.form.projectType.options.uiUx"),
    other: t("contact.form.projectType.options.other"),
  };

  return (
    <ElectricBorder className="bg-glass-bg " chaos={0.02}>
      <div className="p-6 md:p-7">
        <form className="space-y-5">
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="name"
                className="block text-xs tracking-wider text-text"
              >
                {t("contact.form.name.label")}
              </label>

              <Input
                id="name"
                type="text"
                placeholder={t("contact.form.name.placeholder")}
                className="h-10 border-primary border-2 bg-background text-text placeholder:text-muted-foreground"
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="email"
                className="block text-xs tracking-wider text-text"
              >
                {t("contact.form.email.label")}
              </label>

              <Input
                id="email"
                type="email"
                placeholder={t("contact.form.email.placeholder")}
                className="h-10 border-primary border-2 bg-background text-text placeholder:text-muted-foreground"
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="projectType"
              className="block text-xs tracking-wider text-text"
            >
              {t("contact.form.projectType.label")}
            </label>

            <Select
              value={projectType}
              onValueChange={(value) => setProjectType(value ?? "")}
            >
              <SelectTrigger
                id="projectType"
                className="h-10 w-full border-primary border-2 bg-background text-text"
              >
                {projectType
                  ? projectTypeLabels[
                      projectType as keyof typeof projectTypeLabels
                    ]
                  : t("contact.form.projectType.placeholder")}
              </SelectTrigger>

              <SelectContent className="bg-primary text-white">
                <SelectItem value="web-design">
                  {t("contact.form.projectType.options.webDesign")}
                </SelectItem>

                <SelectItem value="web-development">
                  {t("contact.form.projectType.options.webDevelopment")}
                </SelectItem>

                <SelectItem value="branding">
                  {t("contact.form.projectType.options.branding")}
                </SelectItem>

                <SelectItem value="ui-ux">
                  {t("contact.form.projectType.options.uiUx")}
                </SelectItem>

                <SelectItem value="other">
                  {t("contact.form.projectType.options.other")}
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="message"
              className="block text-xs tracking-wider text-text"
            >
              {t("contact.form.message.label")}
            </label>

            <Textarea
              id="message"
              placeholder={t("contact.form.message.placeholder")}
              className="min-h-[101px] resize-none border-primary border-2 bg-background text-text placeholder:text-muted-foreground"
            />
          </div>

          <Button
            type="submit"
            className="mt-2 h-10 rounded-md border-2 border-primary bg-transparent px-7 text-xs tracking-wider text-text shadow-[0_0_18px_rgba(139,92,246,0.2)] transition-all hover:bg-primary/30"
          >
            {t("contact.form.submit")}
            <ArrowRight className="ml-2 size-3.5" />
          </Button>
        </form>
      </div>
    </ElectricBorder>
  );
}
