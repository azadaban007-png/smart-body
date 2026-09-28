import { useState } from "react";
import { toast } from "sonner";
import { ExternalLink, Loader2, RefreshCw } from "lucide-react";
import { syncRegistration } from "@/services/api";

const LABELS = {
  synced: { text: "ارسال‌شده به وردپرس", cls: "bg-emerald-500/15 text-emerald-600 dark:text-emerald-400" },
  pending: { text: "در صف ارسال", cls: "bg-sb-primary/15 text-sb-deep dark:text-sb-cyan" },
  failed: { text: "ارسال ناموفق", cls: "bg-rose-500/15 text-rose-600 dark:text-rose-400" },
  not_configured: { text: "وردپرس تنظیم نشده", cls: "bg-sb-surface2 text-sb-muted" },
};

export const SyncStatus = ({ reg, onSynced }) => {
  const [busy, setBusy] = useState(false);
  const sync = reg.wpSync || { status: "not_configured" };
  const label = LABELS[sync.status] || LABELS.not_configured;

  const retry = async () => {
    setBusy(true);
    try {
      const updated = await syncRegistration(reg.id);
      if (updated.wpSync?.status === "synced") toast.success("در وردپرس ثبت شد.");
      else toast.error("ارسال به وردپرس انجام نشد.");
      onSynced(updated);
    } catch {
      toast.error("ارسال به وردپرس انجام نشد.");
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${label.cls}`} data-testid="registration-wp-sync-badge" title={sync.error || ""}>
        {label.text}
      </span>
      {sync.status === "synced" && sync.editLink && (
        <a href={sync.editLink} target="_blank" rel="noopener noreferrer" data-testid="registration-wp-edit-link" className="inline-flex items-center gap-1 text-[11px] font-semibold text-sb-primary">
          ویرایش در وردپرس <ExternalLink className="h-3 w-3" />
        </a>
      )}
      {sync.status !== "synced" && (
        <button type="button" onClick={retry} disabled={busy} data-testid="registration-wp-sync-retry" className="inline-flex items-center gap-1 text-[11px] font-semibold text-sb-primary disabled:opacity-50">
          {busy ? <Loader2 className="h-3 w-3 animate-spin" /> : <RefreshCw className="h-3 w-3" />}
          ارسال مجدد
        </button>
      )}
    </div>
  );
};
