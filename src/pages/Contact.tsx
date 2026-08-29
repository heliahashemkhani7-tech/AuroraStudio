import ContactForm from "@/components/contact/ContactForm";
import ContactHero from "@/components/contact/ContactHero";
import ContactInfo from "@/components/contact/ContactInfo";
import ContactMap from "@/components/contact/ContactMap";
import ContactSocials from "@/components/contact/ContactSocials";
import Container from "@/components/layout/Container";

export default function Contact() {
  return (
    <Container className="relative z-5 flex flex-col justify-center mt-30 ltr:pl-10 rtl:pr-10 gap-10">
      <ContactHero />
      <div className="grid grid-cols-1 md:grid-cols-2 md:grid-cols-[2fr_1fr] gap-4">
        <ContactForm />
        <div className="flex flex-col gap-4">
          <ContactInfo />
          <ContactSocials />
        </div>
      </div>
      <ContactMap />
    </Container>
  );
}
