import { Outlet } from "react-router-dom";

import AdminSidebar from "../admin/AdminSidebar";
import GrainientBg from "../ui/GrainientBg";

import LanguageSwitcher from "@/features/language/languageSwitcher";
import ThemeToggle from "@/features/theme/ThemToggle";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

export default function AdminLayout() {
  return (
    <SidebarProvider>
      <div className="relative flex min-h-screen w-full overflow-hidden text-text">
        <GrainientBg />

        <AdminSidebar />

        <SidebarInset className="relative z-10">
          <header className="flex h-16 items-center justify-between border-b px-6">
            <SidebarTrigger />

            <div className="flex items-center gap-3">
              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </header>

          <main className="p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
