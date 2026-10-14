import { useState, type FormEvent } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";
import { ArrowRight, LoaderCircle } from "lucide-react";

import { submitContactMessage } from "@/features/api";
import { Input } from "../ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger } from "../ui/select";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import ElectricBorder from "../animiations/ElectricBorder";

export default function ContactForm() {
  const { t } = useTranslation();

  const [projectType, setProjectType] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const projectTypeLabels = {
    "web-design": t("contact.form.projectType.options.webDesign"),
    "web-development": t("contact.form.projectType.options.webDevelopment"),
    branding: t("contact.form.projectType.options.branding"),
    "ui-ux": t("contact.form.projectType.options.uiUx"),
    other: t("contact.form.projectType.options.other"),
  };

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) return;

    setIsSubmitting(true);

    try {
      await submitContactMessage({
        name,
        email,
        project_type: projectType,
        message,
      });

      setName("");
      setEmail("");
      setProjectType("");
      setMessage("");

      toast.success(t("contact.form.success"));
    } catch (error) {
      console.error("Contact form submission failed:", error);
      toast.error(t("contact.form.error"));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <ElectricBorder className="bg-glass-bg" chaos={0.02}>
      <div className="p-6 md:p-7">
        <form className="space-y-5" onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
            <div className="space-y-2">
              <label
                htmlFor="contact-name"
                className="block text-xs tracking-wider text-text"
              >
                {t("contact.form.name.label")}
              </label>

              <Input
                id="contact-name"
                type="text"
                autoComplete="name"
                value={name}
                onChange={(event) => setName(event.target.value)}
                placeholder={t("contact.form.name.placeholder")}
                className="h-10 border-primary border-2 bg-background text-text placeholder:text-muted-foreground"
                required
                maxLength={100}
              />
            </div>

            <div className="space-y-2">
              <label
                htmlFor="contact-email"
                className="block text-xs tracking-wider text-text"
              >
                {t("contact.form.email.label")}
              </label>

              <Input
                id="contact-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                placeholder={t("contact.form.email.placeholder")}
                className="h-10 border-primary border-2 bg-background text-text placeholder:text-muted-foreground"
                required
                maxLength={254}
              />
            </div>
          </div>

          <div className="space-y-2">
            <label
              htmlFor="contact-project-type"
              className="block text-xs tracking-wider text-text"
            >
              {t("contact.form.projectType.label")}
            </label>

            <Select
              value={projectType}
              onValueChange={(value) => setProjectType(value ?? "")}
              required
            >
              <SelectTrigger
                id="contact-project-type"
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
              htmlFor="contact-message"
              className="block text-xs tracking-wider text-text"
            >
              {t("contact.form.message.label")}
            </label>

            <Textarea
              id="contact-message"
              value={message}
              onChange={(event) => setMessage(event.target.value)}
              placeholder={t("contact.form.message.placeholder")}
              className="min-h-[101px] resize-none border-primary border-2 bg-background text-text placeholder:text-muted-foreground"
              required
              maxLength={5000}
            />
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="mt-2 h-10 rounded-md border-2 border-primary bg-transparent px-7 text-xs tracking-wider text-text shadow-[0_0_18px_rgba(139,92,246,0.2)] transition-all hover:bg-primary/30"
          >
            {isSubmitting
              ? t("contact.form.submitting")
              : t("contact.form.submit")}

            {isSubmitting ? (
              <LoaderCircle className="ml-2 size-3.5 animate-spin" />
            ) : (
              <ArrowRight className="ml-2 size-3.5" />
            )}
          </Button>
        </form>
      </div>
    </ElectricBorder>
  );
}
