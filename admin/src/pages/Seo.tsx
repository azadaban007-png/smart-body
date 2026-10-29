import { useEffect, useState } from 'react';
import { api } from '../api';
import { Button, Card, Field, Input, Textarea } from '../components/ui';

type Seo = {
  id: string; pageKey: string; seoTitleEn: string | null; seoTitleFa: string | null;
  seoDescriptionEn: string | null; seoDescriptionFa: string | null; ogImage: string | null; canonicalUrl: string | null;
};

export default function Seo() {
  const [items, setItems] = useState<Seo[]>([]);
  const [active, setActive] = useState<Seo | null>(null);
  const [msg, setMsg] = useState('');

  const load = () => api.get('/admin/seo').then((r) => { setItems(r.data); if (!active && r.data[0]) setActive(r.data[0]); });
  useEffect(load, []);

  const save = async () => {
    if (!active) return;
    setMsg('');
    try {
      await api.put(`/admin/seo/${active.pageKey}`, {
        seoTitleEn: active.seoTitleEn, seoTitleFa: active.seoTitleFa,
        seoDescriptionEn: active.seoDescriptionEn, seoDescriptionFa: active.seoDescriptionFa,
        ogImage: active.ogImage, canonicalUrl: active.canonicalUrl,
      });
      setMsg('Saved.');
    } catch { setMsg('Save failed.'); }
  };

  const set = (k: string, v: any) => setActive((p) => (p ? { ...p, [k]: v } : p));

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-ink-900">SEO Settings</h1>
      <div className="flex flex-wrap gap-2">
        {items.map((s) => (
          <button key={s.id} onClick={() => { setActive(s); setMsg(''); }} className={`rounded-md px-3 py-1.5 text-sm capitalize ${active?.pageKey === s.pageKey ? 'bg-ink-900 text-white' : 'bg-white border border-ink-200 text-ink-600'}`}>
            {s.pageKey}
          </button>
        ))}
      </div>

      {active && (
        <Card className="max-w-2xl space-y-4 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink-800 capitalize">{active.pageKey} page</h2>
            <div className="flex items-center gap-3">
              {msg && <span className="text-sm text-ink-500">{msg}</span>}
              <Button onClick={save}>Save</Button>
            </div>
          </div>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="SEO Title (EN)"><Input value={active.seoTitleEn || ''} onChange={(e) => set('seoTitleEn', e.target.value)} /></Field>
            <Field label="SEO Title (FA)"><Input value={active.seoTitleFa || ''} onChange={(e) => set('seoTitleFa', e.target.value)} dir="rtl" /></Field>
          </div>
          <Field label="SEO Description (EN)"><Textarea rows={2} value={active.seoDescriptionEn || ''} onChange={(e) => set('seoDescriptionEn', e.target.value)} /></Field>
          <Field label="SEO Description (FA)"><Textarea rows={2} value={active.seoDescriptionFa || ''} onChange={(e) => set('seoDescriptionFa', e.target.value)} dir="rtl" /></Field>
          <Field label="OG Image URL"><Input value={active.ogImage || ''} onChange={(e) => set('ogImage', e.target.value)} /></Field>
          <Field label="Canonical URL"><Input value={active.canonicalUrl || ''} onChange={(e) => set('canonicalUrl', e.target.value)} /></Field>
        </Card>
      )}
    </div>
  );
}
