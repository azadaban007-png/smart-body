import { AlertTriangle, CheckCircle2, Database } from "lucide-react";

const TONES = {
  wordpress: { icon: CheckCircle2, cls: "border-emerald-500/30 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400" },
  fallback: { icon: AlertTriangle, cls: "border-amber-500/30 bg-amber-500/10 text-amber-700 dark:text-amber-400" },
  sample: { icon: Database, cls: "border-sb-border bg-sb-surface text-sb-muted" },
};

const describe = (s) => {
  if (s.reachable) return { tone: "wordpress", title: "متصل به وردپرس", text: `داده باشگاه‌ها از ${s.baseUrl} خوانده می‌شود${s.pluginVersion ? ` (افزونه نسخه ${s.pluginVersion})` : ""}.` };
  if (s.configured) return { tone: "fallback", title: "وردپرس در دسترس نیست", text: "موقتاً از داده نمونه استفاده می‌شود. ثبت‌نام‌ها ذخیره شده و بعداً قابل ارسال هستند." };
  return { tone: "sample", title: "منبع داده: نمونه داخلی", text: "آدرس وردپرس هنوز تنظیم نشده است (WP_BASE_URL)." };
};

export const WordPressStatus = ({ status }) => {
  if (!status) return null;
  const d = describe(status);
  const { icon: Icon, cls } = TONES[d.tone];
  return (
    <div data-testid="wp-status-banner" data-source={status.activeSource} className={`mt-6 flex items-start gap-3 rounded-2xl border px-4 py-3.5 ${cls}`}>
      <Icon className="mt-0.5 h-5 w-5 shrink-0" />
      <div>
        <p className="text-sm font-bold" data-testid="wp-status-title">{d.title}</p>
        <p className="mt-0.5 text-xs leading-6 opacity-90">{d.text}</p>
        {status.configured && !status.canWrite && (
          <p className="mt-0.5 text-xs opacity-90">برای ارسال ثبت‌نام‌ها، WP_USERNAME و WP_APP_PASSWORD را تنظیم کنید.</p>
        )}
      </div>
    </div>
  );
};
