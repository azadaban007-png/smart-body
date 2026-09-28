import { useEffect, useMemo, useState } from "react";
import { Phone } from "lucide-react";
import { fileUrl, getRegistrations, getWordPressStatus } from "@/services/api";
import { useAsync } from "@/hooks/useAsync";
import { useCatalog } from "@/context/CatalogContext";
import { formatDateFa, joinFa, toFa } from "@/lib/format";
import { WordPressStatus } from "@/components/admin/WordPressStatus";
import { SyncStatus } from "@/components/admin/SyncStatus";

const TABS = [
  { id: "all", label: "همه" },
  { id: "requested", label: "درخواست لندینگ پیج" },
  { id: "not_requested", label: "بدون لندینگ" },
];

const Stat = ({ label, value, testId }) => (
  <div className="rounded-2xl border border-sb-border bg-sb-surface px-5 py-4" data-testid={testId}>
    <p className="text-xs text-sb-muted">{label}</p>
    <p className="mt-1 text-2xl font-black text-sb-text">{toFa(value)}</p>
  </div>
);

const RegistrationRow = ({ reg, sportName, onSynced }) => (
  <li data-testid={`registration-${reg.id}`} className="flex flex-col gap-4 rounded-[1.5rem] border border-sb-border bg-sb-surface p-4 sm:flex-row sm:items-center">
    <img src={fileUrl(reg.imagePath)} alt={reg.gymName} className="h-24 w-full rounded-xl object-cover sm:w-32" />
    <div className="min-w-0 flex-1">
      <div className="flex flex-wrap items-center gap-2">
        <h3 className="font-bold text-sb-text">{reg.gymName}</h3>
        <span className={`rounded-full px-2.5 py-0.5 text-[11px] font-bold ${reg.landingPageRequested ? "bg-sb-primary/15 text-sb-deep dark:text-sb-cyan" : "bg-sb-surface2 text-sb-muted"}`} data-testid="registration-landing-badge">
          {reg.landingPageRequested ? "لندینگ پیج: بله" : "لندینگ پیج: خیر"}
        </span>
        <span className="rounded-full bg-amber-500/15 px-2.5 py-0.5 text-[11px] font-bold text-amber-600">در انتظار بررسی</span>
      </div>
      <p className="mt-1 text-sm text-sb-muted">مدیر: {reg.managerName} — {reg.city}، {reg.neighborhood}</p>
      <p className="mt-1 truncate text-xs text-sb-muted">{reg.address}</p>
      <p className="mt-1 text-xs font-medium text-sb-text">{joinFa(reg.sports.map(sportName))}</p>
      <div className="mt-2"><SyncStatus reg={reg} onSynced={onSynced} /></div>
    </div>
    <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
      <a href={`tel:${reg.phone}`} className="inline-flex items-center gap-1.5 text-sm font-semibold text-sb-primary" dir="ltr"><Phone className="h-4 w-4" />{toFa(reg.phone)}</a>
      <span className="text-xs text-sb-muted">{formatDateFa(reg.createdAt)}</span>
    </div>
  </li>
);

export default function AdminPage() {
  const { data, loading, error } = useAsync(getRegistrations, []);
  const { data: wpStatus } = useAsync(getWordPressStatus, []);
  const [items, setItems] = useState([]);
  useEffect(() => setItems(data || []), [data]);
  const replaceItem = (updated) => setItems((list) => list.map((r) => (r.id === updated.id ? updated : r)));
  const { sports } = useCatalog();
  const [tab, setTab] = useState("all");
  const [query, setQuery] = useState("");
  const sportName = (slug) => sports.find((s) => s.slug === slug)?.name || slug;

  const list = useMemo(() => items.filter((r) => (tab === "all" || r.landingPageStatus === tab) && `${r.gymName} ${r.managerName} ${r.city}`.includes(query.trim())), [items, tab, query]);
  const requested = items.filter((r) => r.landingPageRequested).length;

  return (
    <div data-testid="admin-page" className="sb-container pb-24 pt-28 sm:pt-32">
      <p className="sb-eyebrow mb-3">پنل مدیریت</p>
      <h1 className="text-3xl font-black text-sb-text">درخواست‌های ثبت باشگاه</h1>
      <WordPressStatus status={wpStatus} />
      <div className="mt-8 grid grid-cols-2 gap-3 sm:max-w-md">
        <Stat label="کل درخواست‌ها" value={items.length} testId="admin-stat-total" />
        <Stat label="درخواست لندینگ پیج" value={requested} testId="admin-stat-landing" />
      </div>
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div className="no-scrollbar flex gap-2 overflow-x-auto">
          {TABS.map((t) => (
            <button key={t.id} type="button" onClick={() => setTab(t.id)} aria-pressed={tab === t.id} data-testid={`admin-tab-${t.id}`} className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${tab === t.id ? "bg-sb-primary text-white" : "border border-sb-border text-sb-muted hover:text-sb-text"}`}>
              {t.label}
            </button>
          ))}
        </div>
        <input value={query} onChange={(e) => setQuery(e.target.value)} placeholder="جستجو در نام باشگاه، مدیر یا شهر" className="sb-input sm:max-w-xs" data-testid="admin-search-input" />
      </div>
      {loading && <p className="mt-8 text-sb-muted">در حال بارگذاری...</p>}
      {error && <p className="mt-8 text-rose-500">دریافت اطلاعات ناموفق بود.</p>}
      {!loading && !error && (list.length ? (
        <ul className="mt-6 space-y-3" data-testid="admin-registrations-list">{list.map((r) => <RegistrationRow key={r.id} reg={r} sportName={sportName} onSynced={replaceItem} />)}</ul>
      ) : (
        <p className="mt-10 rounded-2xl border border-dashed border-sb-border p-10 text-center text-sb-muted" data-testid="admin-empty">درخواستی یافت نشد.</p>
      ))}
    </div>
  );
}
