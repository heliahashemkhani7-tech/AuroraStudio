import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  LogOut,
  List,
  Plus,
  Tags,
  ChevronDown,
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";
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
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { isMobile, setOpenMobile } = useSidebar();

  const isPersian = i18n.language === "fa";

  const isProjectsActive = location.pathname.startsWith("/dashboard/projects");

  const isBlogActive = location.pathname.startsWith("/dashboard/blog");

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
        <SidebarGroup>
          <SidebarGroupLabel className="text-primary md:text-xl font-bold">
            {t("dashboard.admin")}
          </SidebarGroupLabel>

          <SidebarGroupContent>
            <SidebarMenu>
              <SidebarMenuItem>
                <SidebarMenuButton
                  isActive={location.pathname === "/dashboard"}
                  className="text-text"
                >
                  <Link
                    to="/dashboard"
                    onClick={handleNavigation}
                    className="flex gap-1"
                  >
                    <LayoutDashboard />
                    <span>{t("dashboard.dashboard")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              <Collapsible
                defaultOpen={isProjectsActive}
                className="group/projects"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger>
                    <SidebarMenuButton
                      isActive={isProjectsActive}
                      className="text-text"
                    >
                      <FolderKanban />
                      <span>{t("dashboard.projects")}</span>

                      <ChevronDown className="ms-auto transition-transform duration-300 ease-in-out [[data-panel-open]_&]:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent
                    className="
    origin-top
    transition-[opacity,transform]
    duration-300
    ease-in-out
    data-[starting-style]:-translate-y-2
    data-[starting-style]:opacity-0
    data-[ending-style]:-translate-y-2
    data-[ending-style]:opacity-0
  "
                  >
                    {" "}
                    <SidebarMenu className="mt-1">
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          isActive={location.pathname === "/dashboard/projects"}
                          className="text-text"
                        >
                          <Link
                            to="/dashboard/projects"
                            onClick={handleNavigation}
                            className="flex gap-1"
                          >
                            <List />
                            <span>{t("dashboard.projectList")}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      <SidebarMenuItem>
                        <SidebarMenuButton
                          isActive={
                            location.pathname === "/dashboard/projects/new"
                          }
                          className="text-text"
                        >
                          <Link
                            to="/dashboard/projects/new"
                            onClick={handleNavigation}
                            className="flex gap-1"
                          >
                            <Plus />
                            <span>{t("dashboard.newProject")}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      <SidebarMenuItem>
                        <SidebarMenuButton
                          isActive={
                            location.pathname ===
                            "/dashboard/projects/categories"
                          }
                          className="text-text"
                        >
                          <Link
                            to="/dashboard/projects/categories"
                            className="flex gap-1"
                            onClick={handleNavigation}
                          >
                            <Tags />
                            <span>{t("dashboard.projectCategories")}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              <Collapsible defaultOpen={isBlogActive} className="group/blog">
                <SidebarMenuItem>
                  <CollapsibleTrigger>
                    <SidebarMenuButton
                      isActive={isBlogActive}
                      className="text-text"
                    >
                      <FileText />
                      <span>{t("dashboard.blog")}</span>

                      <ChevronDown className="ms-auto transition-transform duration-300 ease-in-out [[data-panel-open]_&]:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent
                    className="
    origin-top
    transition-[opacity,transform]
    duration-300
    ease-in-out
    data-[starting-style]:-translate-y-2
    data-[starting-style]:opacity-0
    data-[ending-style]:-translate-y-2
    data-[ending-style]:opacity-0
  "
                  >
                    {" "}
                    <SidebarMenu className="mt-1">
                      <SidebarMenuItem>
                        <SidebarMenuButton
                          isActive={location.pathname === "/dashboard/blog"}
                          className="text-text"
                        >
                          <Link
                            to="/dashboard/blog"
                            onClick={handleNavigation}
                            className="flex gap-1"
                          >
                            <List />
                            <span>{t("dashboard.blogList")}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      <SidebarMenuItem>
                        <SidebarMenuButton
                          isActive={location.pathname === "/dashboard/blog/new"}
                          className="text-text"
                        >
                          <Link
                            to="/dashboard/blog/new"
                            onClick={handleNavigation}
                            className="flex gap-1"
                          >
                            <Plus />
                            <span>{t("dashboard.newBlog")}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      <SidebarMenuItem>
                        <SidebarMenuButton
                          isActive={
                            location.pathname === "/dashboard/blog/categories"
                          }
                          className="text-text"
                        >
                          <Link
                            to="/dashboard/blog/categories"
                            onClick={handleNavigation}
                            className="flex gap-1"
                          >
                            <Tags />
                            <span>{t("dashboard.blogCategories")}</span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton onClick={handleLogout} className="text-red-600">
              <LogOut />
              <span>{t("dashboard.logout")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
