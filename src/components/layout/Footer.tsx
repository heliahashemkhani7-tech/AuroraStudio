import { Icon } from "@iconify/react";
import { footerData } from "@/data/footer";

export default function Footer() {
  return (
    <footer
      className="relative z-[100] text-text text-xl flex flex-col md:flex-row ltr:pl-5 rtl:pr-5 justify-around py-10 border-t-1 border-border items-center"
      dir="ltr"
    >
      <h1>{footerData.brand}</h1>

      <div className="flex gap-5 mt-4">
        <Icon icon="mdi:instagram" className="cursor-pointer" width="24" />
        <Icon icon="mdi:linkedin" className="cursor-pointer" width="24" />
        <Icon icon="mdi:telegram" className="cursor-pointer" width="24" />
        <Icon icon="mdi:twitter" className="cursor-pointer" width="24" />
      </div>

      <p className="mt-5 text-xs sm:text-xl">{footerData.copyright}</p>
    </footer>
  );
}
