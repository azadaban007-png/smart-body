import { Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { PageHeader } from "@/components/PageHeader";
import { useStore } from "@/lib/store";

export function SignIn() {
  const { setUser } = useStore();
  const navigate = useNavigate();
  const [mode, setMode] = useState<"signin" | "register">("signin");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    setUser({ name: name || email.split("@")[0] || "کاربر", email });
    navigate({ to: "/account" });
  };

  return (
    <div className="pb-20">
      <PageHeader title={mode === "signin" ? "ورود" : "ساخت حساب"} crumbs={[mode === "signin" ? "ورود" : "ثبت‌نام"]} />
      <div className="mx-auto mt-8 max-w-md px-4 md:px-8">
        <div className="card-lux p-8">
          <div className="mb-6 flex rounded-full border border-border p-1 text-sm">
            <button onClick={() => setMode("signin")} className={`flex-1 rounded-full py-2 transition ${mode === "signin" ? "bg-gold text-primary-foreground" : "text-muted-foreground"}`}>ورود</button>
            <button onClick={() => setMode("register")} className={`flex-1 rounded-full py-2 transition ${mode === "register" ? "bg-gold text-primary-foreground" : "text-muted-foreground"}`}>ثبت‌نام</button>
          </div>
          <form onSubmit={submit} className="space-y-4">
            {mode === "register" && (
              <label className="block"><span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">نام</span><input className="field" value={name} onChange={(e) => setName(e.target.value)} /></label>
            )}
            <label className="block"><span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">ایمیل</span><input type="email" className="field" required value={email} onChange={(e) => setEmail(e.target.value)} /></label>
            <label className="block"><span className="mb-1 block text-xs uppercase tracking-widest text-muted-foreground">رمز عبور</span><input type="password" className="field" required value={password} onChange={(e) => setPassword(e.target.value)} /></label>
            <button type="submit" className="btn-gold w-full">{mode === "signin" ? "ورود" : "ساخت حساب"}</button>
          </form>
          <p className="mt-4 text-center text-xs text-muted-foreground">احراز هویت نمایشی — هیچ اطلاعات واقعی ذخیره نمی‌شود.</p>
        </div>
        <p className="mt-6 text-center text-sm text-muted-foreground">
          <Link to="/shop" className="hover:text-gold">ادامه مرور</Link>
        </p>
      </div>
    </div>
  );
}
