import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { supabase } from "@/lib/supabace";
import { useState } from "react";
import { useTranslation } from "react-i18next";

export default function AdminLogin() {
  const { t } = useTranslation();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    setError("");
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    setLoading(false);

    if (error) {
      setError("admin.login.invalidCredentials");
      return;
    }

    window.location.href = "/dashboard";
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
              className="w-full rounded-md border border-border px-3 py-2"
            />

            <input
              type="password"
              placeholder={t("admin.login.passwordPlaceholder")}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full rounded-md border border-border px-3 py-2"
            />

            {error && <p className="text-sm text-red-500">{t(error)}</p>}

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
