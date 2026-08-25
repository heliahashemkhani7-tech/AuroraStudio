import ContactForm from "@/components/contact/ContactForm";
import ContactHero from "@/components/contact/ContactHero";

export default function Contact() {
  return (
    <main className="relative z-5 flex flex-col justify-center h-220 ltr:pl-10 rtl:pr-10 gap-10">
      <ContactHero />
      <ContactForm />
    </main>
  );
}
