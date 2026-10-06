import { LayoutDashboard, FolderKanban, LogOut } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";

import { supabase } from "@/lib/supabace";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from "@/components/ui/sidebar";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();

  const { isMobile, setOpenMobile } = useSidebar();

  const isPersian = i18n.language === "fa";

  const handleNavigation = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();

    if (isMobile) {
      setOpenMobile(false);
    }

    navigate("/account/auth");
  };

  return (
    <Sidebar side={isPersian ? "right" : "left"}>
      <SidebarContent className="bg-glass-bg md:bg-transparent">
        <SidebarGroup >
          <SidebarGroupLabel className="text-primary md:text-xl font-bold">
            {t("dashboard.admin")}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  className="text-text"
                  onClick={handleNavigation}
                >
                  <Link to="/dashboard" className="flex gap-2">
                    <LayoutDashboard />
                    <span>{t("dashboard.dashboard")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <SidebarMenuItem>
                <SidebarMenuButton
                  onClick={handleNavigation}
                  className="text-text"
                >
                  <Link to="/dashboard/projects" className="flex gap-2">
                    <FolderKanban />
                    <span>{t("dashboard.projects")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              onClick={handleLogout}
              className="text-red-600"
            >
              <LogOut />
              <span>{t("dashboard.logout")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
