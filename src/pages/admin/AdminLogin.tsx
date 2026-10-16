import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Eye, EyeOff } from "lucide-react";
import { supabase } from "@/hooks/lib/supabace";
import { toast } from "sonner";

export default function AdminLogin() {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleLogin = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (loading) return;

    setLoading(true);

    try {
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        toast.error(t("admin.login.invalidCredentials"));
        return;
      }

      window.location.href = "/dashboard";
    } catch {
      toast.error(t("admin.login.invalidCredentials"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="z-5 flex min-h-screen items-center justify-center p-4">
      <Card className="w-full max-w-md border-2 border-border bg-glass-bg text-text">
        <CardContent className="flex flex-col items-center gap-6 p-6">
          <h1 className="text-2xl font-semibold">{t("admin.login.title")}</h1>

          <form onSubmit={handleLogin} className="flex w-full flex-col gap-4">
            <input
              type="email"
              placeholder={t("admin.login.emailPlaceholder")}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="username"
              required
              className="w-full rounded-md border border-border px-3 py-2"
            />

            <div className="relative w-full">
              <input
                type={showPassword ? "text" : "password"}
                placeholder={t("admin.login.passwordPlaceholder")}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete="current-password"
                required
                className="w-full rounded-md border border-border px-3 py-2 pe-10"
              />

              <button
                type="button"
                onClick={() => setShowPassword((previous) => !previous)}
                className="absolute inset-y-0 end-0 flex items-center px-3 text-muted-foreground transition-colors hover:text-text"
                aria-label={showPassword ? "Hide password" : "Show password"}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>

            <Button type="submit" disabled={loading}>
              {loading
                ? t("admin.login.loggingIn")
                : t("admin.login.loginButton")}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
