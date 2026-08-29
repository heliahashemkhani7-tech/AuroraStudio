import { Icon } from "@iconify/react";
import { footerData } from "@/data/footer";
import Container from "./Container";

export default function Footer() {
  return (
    <footer
      className="relative z-[100] border-t border-border py-10 text-text"
      dir="ltr"
    >
      <Container>
        <div className="flex flex-col items-center justify-between gap-5 px-4 md:flex-row">
          <h1>{footerData.brand}</h1>

          <div className="flex gap-5">
            <Icon icon="mdi:instagram" className="cursor-pointer" width="24" />
            <Icon icon="mdi:linkedin" className="cursor-pointer" width="24" />
            <Icon icon="mdi:telegram" className="cursor-pointer" width="24" />
            <Icon icon="mdi:twitter" className="cursor-pointer" width="24" />
          </div>

          <p className="text-xs">{footerData.copyright}</p>
        </div>
      </Container>
    </footer>
  );
}
