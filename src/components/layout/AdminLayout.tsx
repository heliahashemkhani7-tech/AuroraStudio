import { Outlet, Link } from "react-router-dom";

import AdminSidebar from "../admin/AdminSidebar";

import LanguageSwitcher from "@/features/language/languageSwitcher";
import ThemeToggle from "@/features/theme/ThemToggle";

import {
  SidebarInset,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar";

import { ExternalLink } from "lucide-react";
import { useTranslation } from "react-i18next";

export default function AdminLayout() {
  const { t } = useTranslation();

  return (
    <SidebarProvider>
      <div className="relative flex min-h-svh w-full min-w-0 overflow-x-clip bg-dashboard-bg text-text">
        {/* Sidebar */}
        <AdminSidebar />

        {/* Main content */}
        <SidebarInset className="relative min-h-svh min-w-0 flex-1 bg-transparent">
          {/* Header */}
          <header className="sticky top-0 z-20 flex h-16 min-w-0 items-center justify-between border-b border-border/30 bg-background/80 px-4 backdrop-blur-sm sm:px-6">
            <SidebarTrigger className="size-9 shrink-0 rounded-lg border border-border/30 bg-transparent text-text shadow-none transition-colors hover:bg-hover" />

            <div className="flex shrink-0 items-center gap-2">
              <Link
                to="/"
                className="inline-flex items-center gap-2 rounded-lg px-3 py-2 text-sm text-text transition-colors hover:bg-hover"
              >
                <ExternalLink className="size-4" />
                <span>{t("admin.backToSite")}</span>
              </Link>

              <LanguageSwitcher />
              <ThemeToggle />
            </div>
          </header>

          {/* Page content */}
          <main className="relative min-w-0 max-w-full p-4 sm:p-6">
            <Outlet />
          </main>
        </SidebarInset>
      </div>
    </SidebarProvider>
  );
}
