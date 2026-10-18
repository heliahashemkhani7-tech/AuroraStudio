import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  KeyRound,
  Eye,
  EyeOff,
  LoaderCircle,
  LockKeyhole,
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

export default function AdminResetPassword() {
  const { i18n } = useTranslation();
  const isPersian = i18n.language.startsWith("fa");
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [saving, setSaving] = useState(false);

  const handleSubmit = async (
    event: React.FormEvent<HTMLFormElement>
  ) => {
    event.preventDefault();

    if (saving) return;

    if (password.length < 8) {
      toast.error(
        isPersian
          ? "رمز عبور باید حداقل ۸ کاراکتر داشته باشد."
          : "Password must be at least 8 characters long."
      );
      return;
    }

    if (password !== confirmPassword) {
      toast.error(
        isPersian
          ? "رمز عبور و تکرار آن یکسان نیستند."
          : "Passwords do not match."
      );
      return;
    }

    setSaving(true);

    try {
      const { data: sessionData, error: sessionError } =
        await supabase.auth.getSession();

      if (sessionError) throw sessionError;

      if (!sessionData.session) {
        throw new Error("No active session.");
      }

      const { error: updateError } = await supabase.auth.updateUser({
        password,
      });

      if (updateError) throw updateError;

      setPassword("");
      setConfirmPassword("");

      toast.success(
        isPersian
          ? "رمز عبور تغییر کرد. لطفاً دوباره وارد حساب شو."
          : "Password changed. Please sign in again."
      );

      const { error: logoutError } = await supabase.auth.signOut();

      if (logoutError) {
        console.error("Sign out after password update failed:", logoutError);

        toast.error(
          isPersian
            ? "رمز تغییر کرد، اما خروج از حساب انجام نشد. لطفاً دوباره تلاش کن."
            : "Password changed, but sign-out failed. Please try again."
        );
        return;
      }

      navigate("/account/auth", { replace: true });
    } catch (error) {
      console.error("Change password error:", error);

      toast.error(
        isPersian
          ? "تغییر رمز عبور ناموفق بود. دوباره تلاش کن."
          : "Failed to change password. Please try again."
      );
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="mx-auto w-full max-w-3xl space-y-6 p-4 md:p-6">
      <div>
        <h1 className="text-2xl font-bold text-text">
          {isPersian ? "تغییر رمز عبور" : "Change Password"}
        </h1>

        <p className="mt-2 text-sm text-muted-foreground">
          {isPersian
            ? "برای امنیت حساب خود، یک رمز عبور جدید انتخاب کن."
            : "Choose a new password to keep your account secure."}
        </p>
      </div>

      <Card className="border-border/30 bg-card">
        <CardHeader>
          <CardTitle className="flex items-center gap-2 text-lg">
            <KeyRound className="size-5 text-primary" />
            {isPersian ? "رمز عبور جدید" : "New Password"}
          </CardTitle>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="new-password">
                {isPersian ? "رمز عبور جدید" : "New Password"}
              </Label>

              <div className="relative">
                <LockKeyhole
                  className={`absolute top-1/2 size-4 -translate-y-1/2 text-muted-foreground ${
                    isPersian ? "right-3" : "left-3"
                  }`}
                />

                <Input
                  id="new-password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(event) => setPassword(event.target.value)}
                  placeholder={
                    isPersian ? "حداقل ۸ کاراکتر" : "At least 8 characters"
                  }
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={128}
                  required
                  className={`border-border/30 bg-background ${
                    isPersian ? "pr-10 pl-11" : "pl-10 pr-11"
                  }`}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword((current) => !current)}
                  aria-label={
                    showPassword
                      ? isPersian
                        ? "پنهان کردن رمز عبور"
                        : "Hide password"
                      : isPersian
                        ? "نمایش رمز عبور"
                        : "Show password"
                  }
                  className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground ${
                    isPersian ? "left-3" : "right-3"
                  }`}
                >
                  {showPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="confirm-password">
                {isPersian
                  ? "تکرار رمز عبور جدید"
                  : "Confirm New Password"}
              </Label>

              <div className="relative">
                <Input
                  id="confirm-password"
                  type={showConfirmPassword ? "text" : "password"}
                  value={confirmPassword}
                  onChange={(event) =>
                    setConfirmPassword(event.target.value)
                  }
                  placeholder={
                    isPersian
                      ? "رمز عبور جدید را دوباره وارد کن"
                      : "Enter your new password again"
                  }
                  autoComplete="new-password"
                  minLength={8}
                  maxLength={128}
                  required
                  className={`border-border/30 bg-background ${
                    isPersian ? "pl-11" : "pr-11"
                  }`}
                />

                <button
                  type="button"
                  onClick={() =>
                    setShowConfirmPassword((current) => !current)
                  }
                  aria-label={
                    showConfirmPassword
                      ? isPersian
                        ? "پنهان کردن رمز عبور"
                        : "Hide password"
                      : isPersian
                        ? "نمایش رمز عبور"
                        : "Show password"
                  }
                  className={`absolute top-1/2 -translate-y-1/2 text-muted-foreground transition-colors hover:text-foreground ${
                    isPersian ? "left-3" : "right-3"
                  }`}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-4" />
                  ) : (
                    <Eye className="size-4" />
                  )}
                </button>
              </div>
            </div>

            <p className="text-xs leading-6 text-muted-foreground">
              {isPersian
                ? "از رمز عبوری قوی استفاده کن که قبلاً برای حساب دیگری استفاده نکرده باشی."
                : "Choose a strong password that you do not use for another account."}
            </p>

            <div className="flex justify-end">
              <Button type="submit" disabled={saving}>
                {saving ? (
                  <LoaderCircle className="me-2 size-4 animate-spin" />
                ) : (
                  <KeyRound className="me-2 size-4" />
                )}

                {isPersian ? "ثبت رمز جدید" : "Update Password"}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}