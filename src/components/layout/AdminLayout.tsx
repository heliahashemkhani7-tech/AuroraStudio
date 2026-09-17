import { Outlet } from "react-router-dom";
import AdminSidebar from "../admin/AdminSidebar";
import GrainientBg from "../ui/GrainientBg";
import LanguageSwitcher from "@/features/language/languageSwitcher";
import ThemeToggle from "@/features/theme/ThemToggle";

export default function AdminLayout() {
  return (
    <div className="min-h-screen flex ">
      <AdminSidebar />

      <GrainientBg />
      <main className="flex-1 p-8 text-text z-5">
        <LanguageSwitcher />
        <ThemeToggle />
        <Outlet />
      </main>
    </div>
  );
}
