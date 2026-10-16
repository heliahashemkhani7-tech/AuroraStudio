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

  const isPersian = i18n.language.startsWith("fa");

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

  const menuButtonClassName =
    "w-full min-w-0 rounded-lg text-text transition-colors duration-200 hover:bg-sidebar-hover";

  const activeMenuButtonClassName =
    "bg-sidebar-active text-primary hover:bg-sidebar-active";

  const submenuClassName =
    "mt-1 ms-4 min-w-0 overflow-x-hidden border-s border-sidebar-border ps-2";

  const submenuAnimationClassName =
    "origin-top transition-[opacity,transform] duration-200 ease-in-out data-[starting-style]:-translate-y-1 data-[starting-style]:opacity-0 data-[ending-style]:-translate-y-1 data-[ending-style]:opacity-0";

  const getMenuButtonClassName = (isActive: boolean) =>
    `${menuButtonClassName} ${isActive ? activeMenuButtonClassName : ""}`;

  return (
    <Sidebar
      side={isPersian ? "right" : "left"}
      className="min-w-0 border-e border-sidebar-border"
    >
      <SidebarContent className="min-w-0 overflow-x-hidden bg-sidebar-bg backdrop-blur-xl">
        <SidebarGroup className="min-w-0 px-3 py-4">
          <SidebarGroupLabel className="mb-3 min-w-0 px-3 font-bold text-primary md:text-xl">
            <span className="truncate">{t("dashboard.admin")}</span>
          </SidebarGroupLabel>

          <SidebarGroupContent className="min-w-0">
            <SidebarMenu className="min-w-0">
              {/* Dashboard */}
              <SidebarMenuItem className="min-w-0">
                <SidebarMenuButton
                  isActive={location.pathname === "/dashboard"}
                  className={getMenuButtonClassName(
                    location.pathname === "/dashboard"
                  )}
                >
                  <Link
                    to="/dashboard"
                    onClick={handleNavigation}
                    className="flex min-w-0 items-center gap-2"
                  >
                    <LayoutDashboard className="shrink-0" />
                    <span className="truncate">{t("dashboard.dashboard")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Projects */}
              <Collapsible
                defaultOpen={isProjectsActive}
                className="group/projects min-w-0"
              >
                <SidebarMenuItem className="min-w-0">
                  <CollapsibleTrigger>
                    <SidebarMenuButton
                      isActive={isProjectsActive}
                      className={getMenuButtonClassName(isProjectsActive)}
                    >
                      <FolderKanban className="shrink-0" />
                      <span className="min-w-0 flex-1 truncate">
                        {t("dashboard.projects")}
                      </span>
                      <ChevronDown className="ms-auto shrink-0 transition-transform duration-200 group-data-[state=open]/projects:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent className={submenuAnimationClassName}>
                    <SidebarMenu className={submenuClassName}>
                      <SidebarMenuItem className="min-w-0">
                        <SidebarMenuButton
                          isActive={location.pathname === "/dashboard/projects"}
                          className={getMenuButtonClassName(
                            location.pathname === "/dashboard/projects"
                          )}
                        >
                          <Link
                            to="/dashboard/projects"
                            onClick={handleNavigation}
                            className="flex min-w-0 items-center gap-2"
                          >
                            <List className="shrink-0" />
                            <span className="truncate">
                              {t("dashboard.projectList")}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      <SidebarMenuItem className="min-w-0">
                        <SidebarMenuButton
                          isActive={
                            location.pathname === "/dashboard/projects/new"
                          }
                          className={getMenuButtonClassName(
                            location.pathname === "/dashboard/projects/new"
                          )}
                        >
                          <Link
                            to="/dashboard/projects/new"
                            onClick={handleNavigation}
                            className="flex min-w-0 items-center gap-2"
                          >
                            <Plus className="shrink-0" />
                            <span className="truncate">
                              {t("dashboard.newProject")}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      <SidebarMenuItem className="min-w-0">
                        <SidebarMenuButton
                          isActive={
                            location.pathname ===
                            "/dashboard/projects/categories"
                          }
                          className={getMenuButtonClassName(
                            location.pathname ===
                              "/dashboard/projects/categories"
                          )}
                        >
                          <Link
                            to="/dashboard/projects/categories"
                            onClick={handleNavigation}
                            className="flex min-w-0 items-center gap-2"
                          >
                            <Tags className="shrink-0" />
                            <span className="truncate">
                              {t("dashboard.projectCategories")}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>
                    </SidebarMenu>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>

              {/* Blog */}
              <Collapsible
                defaultOpen={isBlogActive}
                className="group/blog min-w-0"
              >
                <SidebarMenuItem className="min-w-0">
                  <CollapsibleTrigger>
                    <SidebarMenuButton
                      isActive={isBlogActive}
                      className={getMenuButtonClassName(isBlogActive)}
                    >
                      <FileText className="shrink-0" />
                      <span className="min-w-0 flex-1 truncate">
                        {t("dashboard.blog")}
                      </span>
                      <ChevronDown className="ms-auto shrink-0 transition-transform duration-200 group-data-[state=open]/blog:rotate-180" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>

                  <CollapsibleContent className={submenuAnimationClassName}>
                    <SidebarMenu className={submenuClassName}>
                      <SidebarMenuItem className="min-w-0">
                        <SidebarMenuButton
                          isActive={location.pathname === "/dashboard/blog"}
                          className={getMenuButtonClassName(
                            location.pathname === "/dashboard/blog"
                          )}
                        >
                          <Link
                            to="/dashboard/blog"
                            onClick={handleNavigation}
                            className="flex min-w-0 items-center gap-2"
                          >
                            <List className="shrink-0" />
                            <span className="truncate">
                              {t("dashboard.blogList")}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      <SidebarMenuItem className="min-w-0">
                        <SidebarMenuButton
                          isActive={location.pathname === "/dashboard/blog/new"}
                          className={getMenuButtonClassName(
                            location.pathname === "/dashboard/blog/new"
                          )}
                        >
                          <Link
                            to="/dashboard/blog/new"
                            onClick={handleNavigation}
                            className="flex min-w-0 items-center gap-2"
                          >
                            <Plus className="shrink-0" />
                            <span className="truncate">
                              {t("dashboard.newBlog")}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      <SidebarMenuItem className="min-w-0">
                        <SidebarMenuButton
                          isActive={
                            location.pathname === "/dashboard/blog/categories"
                          }
                          className={getMenuButtonClassName(
                            location.pathname === "/dashboard/blog/categories"
                          )}
                        >
                          <Link
                            to="/dashboard/blog/categories"
                            onClick={handleNavigation}
                            className="flex min-w-0 items-center gap-2"
                          >
                            <Tags className="shrink-0" />
                            <span className="truncate">
                              {t("dashboard.blogCategories")}
                            </span>
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

      {/* Logout */}
      <SidebarFooter className="min-w-0  bg-sidebar-bg p-3 backdrop-blur-xl">
        <SidebarMenu className="min-w-0">
          <SidebarMenuItem className="min-w-0">
            <SidebarMenuButton
              onClick={handleLogout}
              className="w-full min-w-0 rounded-lg text-red-500 transition-colors duration-200 hover:bg-red-500/10 hover:text-red-500"
            >
              <LogOut className="shrink-0" />
              <span className="truncate">{t("dashboard.logout")}</span>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
