import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  UserRound,
  Mail,
  Save,
  LoaderCircle,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { toast } from "sonner";

import { supabase } from "@/hooks/lib/supabace";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export default function AdminProfile() {
  const { i18n } = useTranslation();
  const isPersian = i18n.language.startsWith("fa");
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadProfile = async () => {
      try {
        const { data, error } = await supabase.auth.getUser();

        if (error) throw error;

        if (!data.user) {
          throw new Error("No authenticated user found.");
        }

        if (isMounted) {
          setEmail(data.user.email ?? "");
          setDisplayName(
            typeof data.user.user_metadata?.display_name === "string"
              ? data.user.user_metadata.display_name
              : ""
          );
        }
      } catch (error) {
        console.error("Load profile error:", error);

        if (isMounted) {
          toast.error(
            isPersian
              ? "دریافت اطلاعات حساب کاربری ناموفق بود."
              : "Failed to load account information."
          );
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    void loadProfile();

    return () => {
      isMounted = false;
    };
  }, [isPersian]);

  const handleSave = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (saving) return;

    const normalizedName = displayName.trim();

    if (!normalizedName) {
      toast.error(
        isPersian ? "نام نمایشی را وارد کن." : "Please enter a display name."
      );
      return;
    }

    setSaving(true);

    try {
      const { data, error: updateError } = await supabase.auth.updateUser({
        data: {
          display_name: normalizedName,
        },
      });

      if (updateError) throw updateError;

      setDisplayName(
        typeof data.user.user_metadata?.display_name === "string"
          ? data.user.user_metadata.display_name
          : normalizedName
      );

      toast.success(
        isPersian
          ? "پروفایل ذخیره شد. لطفاً دوباره وارد حساب شو."
          : "Profile updated. Please sign in again."
      );

      const { error: logoutError } = await supabase.auth.signOut();

      if (logoutError) {
        console.error("Sign out after profile update failed:", logoutError);

        toast.error(
          isPersian
            ? "پروفایل تغییر کرد، اما خروج از حساب انجام نشد. لطفاً دوباره تلاش کن."
            : "Profile updated, but sign-out failed. Please try again."
        );
        return;
      }

      navigate("/account/auth", { replace: true });
    } catch (error) {
      console.error("Update profile error:", error);

      toast.error(
        isPersian
          ? "ذخیره اطلاعات پروفایل ناموفق بود."
          : "Failed to update profile."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold text-text">
          {isPersian ? "پروفایل کاربری" : "User Profile"}
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          {isPersian
            ? "اطلاعات حساب کاربری خود را مشاهده و ویرایش کن."
            : "View and update your account information."}
        </p>
      </div>

      <Card className="border-border/30 bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <UserRound className="size-5 text-primary" />
            {isPersian ? "اطلاعات حساب" : "Account Information"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          {loading ? (
            <div className="flex min-h-40 items-center justify-center">
              <LoaderCircle className="size-6 animate-spin text-primary" />
            </div>
          ) : (
            <form onSubmit={handleSave} className="space-y-5">
              <div className="space-y-2">
                <Label htmlFor="profile-email">
                  {isPersian ? "ایمیل حساب" : "Account Email"}
                </Label>

                <div className="relative">
                  <Mail
                    className={`absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground ${
                      isPersian ? "right-3" : "left-3"
                    }`}
                  />

                  <Input
                    id="profile-email"
                    type="email"
                    value={email}
                    readOnly
                    disabled
                    dir="ltr"
                    className={`border-border/30 bg-muted/30 ${
                      isPersian ? "pr-10 text-left" : "pl-10 text-left"
                    }`}
                  />
                </div>

                <p className="text-xs text-muted-foreground">
                  {isPersian
                    ? "ایمیل حساب در این صفحه قابل تغییر نیست."
                    : "Email cannot be changed on this page."}
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="profile-name">
                  {isPersian ? "نام نمایشی" : "Display Name"}
                </Label>

                <Input
                  id="profile-name"
                  value={displayName}
                  onChange={(event) => setDisplayName(event.target.value)}
                  placeholder={
                    isPersian
                      ? "نام نمایشی خود را وارد کن"
                      : "Your display name"
                  }
                  maxLength={80}
                  autoComplete="nickname"
                  required
                  className="border-border/30 bg-background"
                />
              </div>

              <div className="flex justify-end">
                <Button type="submit" disabled={saving} className="bg-glass-bg">
                  {saving ? (
                    <LoaderCircle className="me-2 size-4 animate-spin" />
                  ) : (
                    <Save className="me-2 size-4" />
                  )}

                  {isPersian ? "ذخیره تغییرات" : "Save Changes"}
                </Button>
              </div>
            </form>
          )}
        </CardContent>
      </Card>
    </div>
  );
}