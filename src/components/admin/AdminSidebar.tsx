import { useState } from "react";
import {
  LayoutDashboard,
  FolderKanban,
  FileText,
  LogOut,
  List,
  Plus,
  Tags,
  ChevronDown,
  Inbox,
  UserRound,
  KeyRound,
  ChevronUp,
} from "lucide-react";

import { Link, useLocation, useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

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

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";

import ConfirmDialog from "../ui/ConfirmDialog";
import { supabase } from "@/hooks/lib/supabace";

export default function AdminSidebar() {
  const navigate = useNavigate();
  const location = useLocation();
  const { t, i18n } = useTranslation();
  const { isMobile, setOpenMobile } = useSidebar();

  const isPersian = i18n.language.startsWith("fa");

  const [logoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const [loggingOut, setLoggingOut] = useState(false);

  const isProjectsActive = location.pathname.startsWith("/dashboard/projects");
  const isBlogActive = location.pathname.startsWith("/dashboard/blog");
  const isInboxActive = location.pathname === "/dashboard/inbox";

  const handleNavigation = () => {
    if (isMobile) {
      setOpenMobile(false);
    }
  };

  const goTo = (path: string) => {
    handleNavigation();
    navigate(path);
  };

  const handleLogout = async () => {
    if (loggingOut) return;

    setLoggingOut(true);

    try {
      const { error } = await supabase.auth.signOut();

      if (error) {
        throw error;
      }

      setLogoutDialogOpen(false);

      toast.success(
        isPersian
          ? "با موفقیت از حساب کاربری خارج شدی."
          : "Logged out successfully."
      );

      handleNavigation();
      navigate("/account/auth");
    } catch (error) {
      console.error("Logout error:", error);

      toast.error(
        isPersian
          ? "خروج از حساب کاربری با خطا مواجه شد."
          : "Failed to log out. Please try again."
      );
    } finally {
      setLoggingOut(false);
    }
  };

  const menuButtonClassName =
    "w-full min-w-0 max-w-full rounded-lg text-text transition-colors duration-200 hover:bg-sidebar-hover";

  const activeMenuButtonClassName =
    "bg-sidebar-active text-primary hover:bg-sidebar-active";

  const submenuClassName =
    "mt-1 ms-4 min-w-0 max-w-[calc(100%-1rem)] overflow-x-hidden border-s border-sidebar-border ps-2";

  const submenuAnimationClassName =
    "origin-top min-w-0 max-w-full overflow-x-hidden transition-[opacity,transform] duration-200 ease-in-out data-[starting-style]:-translate-y-1 data-[starting-style]:opacity-0 data-[ending-style]:-translate-y-1 data-[ending-style]:opacity-0";

  const getMenuButtonClassName = (isActive: boolean) =>
    `${menuButtonClassName} ${isActive ? activeMenuButtonClassName : ""}`;

  const linkClassName =
    "flex h-full w-full min-w-0 flex-1 items-center gap-2 overflow-hidden";

  return (
    <Sidebar
      side={isPersian ? "right" : "left"}
      className="min-w-0 max-w-full overflow-x-hidden border-e border-border"
    >
      <SidebarContent className="min-w-0 max-w-full overflow-x-hidden bg-sidebar-bg backdrop-blur-xl">
        <SidebarGroup className="min-w-0 max-w-full px-3 py-4">
          <SidebarGroupLabel className="mb-3 min-w-0 max-w-full px-3 font-bold text-primary md:text-xl">
            <span className="truncate">{t("dashboard.admin")}</span>
          </SidebarGroupLabel>

          <SidebarGroupContent className="min-w-0 max-w-full">
            <SidebarMenu className="min-w-0 max-w-full">
              {/* Dashboard */}
              <SidebarMenuItem className="min-w-0 max-w-full">
                <SidebarMenuButton
                  
                  isActive={location.pathname === "/dashboard"}
                  className={getMenuButtonClassName(
                    location.pathname === "/dashboard"
                  )}
                >
                  <Link
                    to="/dashboard"
                    onClick={handleNavigation}
                    className={linkClassName}
                  >
                    <LayoutDashboard className="shrink-0" />
                    <span className="truncate">{t("dashboard.dashboard")}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>

              {/* Projects */}
              <Collapsible
                defaultOpen={isProjectsActive}
                className="group/projects min-w-0 max-w-full"
              >
                <SidebarMenuItem className="min-w-0 max-w-full">
                  <CollapsibleTrigger className="w-full min-w-0 max-w-full">
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
                      {/* Project List */}
                      <SidebarMenuItem className="min-w-0 max-w-full">
                        <SidebarMenuButton
                          
                          isActive={location.pathname === "/dashboard/projects"}
                          className={getMenuButtonClassName(
                            location.pathname === "/dashboard/projects"
                          )}
                        >
                          <Link
                            to="/dashboard/projects"
                            onClick={handleNavigation}
                            className={linkClassName}
                          >
                            <List className="shrink-0" />
                            <span className="truncate">
                              {t("dashboard.projectList")}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      {/* New Project */}
                      <SidebarMenuItem className="min-w-0 max-w-full">
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
                            className={linkClassName}
                          >
                            <Plus className="shrink-0" />
                            <span className="truncate">
                              {t("dashboard.newProject")}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      {/* Project Categories */}
                      <SidebarMenuItem className="min-w-0 max-w-full">
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
                            className={linkClassName}
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
                className="group/blog min-w-0 max-w-full"
              >
                <SidebarMenuItem className="min-w-0 max-w-full">
                  <CollapsibleTrigger className="w-full min-w-0 max-w-full">
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
                      {/* Blog List */}
                      <SidebarMenuItem className="min-w-0 max-w-full">
                        <SidebarMenuButton
                          
                          isActive={location.pathname === "/dashboard/blog"}
                          className={getMenuButtonClassName(
                            location.pathname === "/dashboard/blog"
                          )}
                        >
                          <Link
                            to="/dashboard/blog"
                            onClick={handleNavigation}
                            className={linkClassName}
                          >
                            <List className="shrink-0" />
                            <span className="truncate">
                              {t("dashboard.blogList")}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      {/* New Blog */}
                      <SidebarMenuItem className="min-w-0 max-w-full">
                        <SidebarMenuButton
                          
                          isActive={location.pathname === "/dashboard/blog/new"}
                          className={getMenuButtonClassName(
                            location.pathname === "/dashboard/blog/new"
                          )}
                        >
                          <Link
                            to="/dashboard/blog/new"
                            onClick={handleNavigation}
                            className={linkClassName}
                          >
                            <Plus className="shrink-0" />
                            <span className="truncate">
                              {t("dashboard.newBlog")}
                            </span>
                          </Link>
                        </SidebarMenuButton>
                      </SidebarMenuItem>

                      {/* Blog Categories */}
                      <SidebarMenuItem className="min-w-0 max-w-full">
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
                            className={linkClassName}
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

              {/* Inbox */}
              <SidebarMenuItem className="min-w-0 max-w-full">
                <SidebarMenuButton
                  
                  isActive={isInboxActive}
                  className={getMenuButtonClassName(isInboxActive)}
                >
                  <Link
                    to="/dashboard/inbox"
                    onClick={handleNavigation}
                    className={linkClassName}
                  >
                    <Inbox className="shrink-0" />
                    <span className="truncate">
                      {isPersian ? "صندوق پیام‌ها" : "Inbox"}
                    </span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      {/* User menu */}
      <SidebarFooter className="min-w-0 max-w-full overflow-x-hidden bg-sidebar-bg p-3 backdrop-blur-xl">
        <SidebarMenu className="min-w-0 max-w-full">
          <SidebarMenuItem className="min-w-0 max-w-full">
            <DropdownMenu>
              <DropdownMenuTrigger className="w-full min-w-0 max-w-full rounded-xl outline-none">
                <div className="flex h-auto w-full min-w-0 items-center rounded-xl border-0 bg-transparent p-3 text-text shadow-none outline-none ring-0 transition-colors hover:bg-sidebar-hover focus-visible:ring-0">
                  <div className="flex min-w-0 flex-1 items-center gap-3">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                      <UserRound size={20} />
                    </div>

                    <div className="flex min-w-0 flex-1 flex-col items-start gap-1">
                      <span className="truncate text-sm font-semibold">
                        {isPersian ? "حساب کاربری من" : "My Account"}
                      </span>

                      <span className="truncate text-xs text-muted-foreground">
                        {isPersian ? "مدیریت حساب" : "Account settings"}
                      </span>
                    </div>

                    <ChevronUp className="size-4 shrink-0 text-muted-foreground" />
                  </div>
                </div>
              </DropdownMenuTrigger>

              <DropdownMenuContent
                side="top"
                align={isPersian ? "end" : "start"}
                sideOffset={8}
                className="z-50 w-56 max-w-[calc(100vw-2rem)] border-0 bg-sidebar-bg text-text shadow-none ring-0"
              >
                <DropdownMenuItem
                  onClick={() => goTo("/dashboard/profile")}
                  className="cursor-pointer gap-2"
                >
                  <UserRound className="size-4" />
                  <span>{isPersian ? "پروفایل" : "Profile"}</span>
                </DropdownMenuItem>

                <DropdownMenuItem
                  onClick={() => goTo("/dashboard/reset-password")}
                  className="cursor-pointer gap-2"
                >
                  <KeyRound className="size-4" />
                  <span>{isPersian ? "تغییر رمز عبور" : "Reset Password"}</span>
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuItem
                  onClick={() => setLogoutDialogOpen(true)}
                  className="cursor-pointer gap-2 text-red-500 focus:bg-red-500/10 focus:text-red-500"
                >
                  <LogOut className="size-4" />
                  <span>{t("dashboard.logout")}</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>

      {/* Logout confirmation */}
      <ConfirmDialog
        open={logoutDialogOpen}
        title={isPersian ? "خروج از حساب کاربری" : "Log out"}
        description={
          isPersian
            ? "مطمئنی می‌خوای از حساب کاربری خارج بشی؟"
            : "Are you sure you want to log out?"
        }
        confirmText={isPersian ? "بله، خارج شو" : "Yes, log out"}
        cancelText={isPersian ? "نه، بمان" : "No, stay"}
        loading={loggingOut}
        onConfirm={() => {
          void handleLogout();
        }}
        onCancel={() => {
          if (!loggingOut) {
            setLogoutDialogOpen(false);
          }
        }}
      />
    </Sidebar>
  );
}
