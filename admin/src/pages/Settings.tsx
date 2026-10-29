import { useEffect, useState } from 'react';
import { api } from '../api';
import { Button, Card, Field, Input } from '../components/ui';

type S = any;
const empty: S = {
  studioName: '', email: '', phone: '', addressEn: '', addressFa: '',
  instagramUrl: '', whatsappUrl: '', telegramUrl: '', websiteUrl: '', logo: '', footerLogo: '', favicon: '',
};

export default function Settings() {
  const [s, setS] = useState<S>(empty);
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { api.get('/admin/settings').then((r) => setS({ ...empty, ...r.data })); }, []);
  const set = (k: string, v: any) => setS((p) => ({ ...p, [k]: v }));

  const save = async () => {
    setSaving(true); setMsg('');
    try { await api.put('/admin/settings', s); setMsg('Saved.'); } catch { setMsg('Save failed.'); } finally { setSaving(false); }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink-900">Website Settings</h1>
        <div className="flex items-center gap-3">
          {msg && <span className="text-sm text-ink-500">{msg}</span>}
          <Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
        </div>
      </div>

      <Card className="space-y-4 p-5">
        <Field label="Studio Name"><Input value={s.studioName || ''} onChange={(e) => set('studioName', e.target.value)} /></Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Email"><Input value={s.email || ''} onChange={(e) => set('email', e.target.value)} /></Field>
          <Field label="Phone"><Input value={s.phone || ''} onChange={(e) => set('phone', e.target.value)} /></Field>
        </div>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Address (EN)"><Input value={s.addressEn || ''} onChange={(e) => set('addressEn', e.target.value)} /></Field>
          <Field label="Address (FA)"><Input value={s.addressFa || ''} onChange={(e) => set('addressFa', e.target.value)} dir="rtl" /></Field>
        </div>
      </Card>

      <Card className="space-y-4 p-5">
        <h2 className="text-sm font-semibold text-ink-800">Social Links</h2>
        <Field label="Instagram URL"><Input value={s.instagramUrl || ''} onChange={(e) => set('instagramUrl', e.target.value)} /></Field>
        <Field label="WhatsApp URL"><Input value={s.whatsappUrl || ''} onChange={(e) => set('whatsappUrl', e.target.value)} /></Field>
        <Field label="Telegram URL"><Input value={s.telegramUrl || ''} onChange={(e) => set('telegramUrl', e.target.value)} /></Field>
        <Field label="Website URL"><Input value={s.websiteUrl || ''} onChange={(e) => set('websiteUrl', e.target.value)} /></Field>
      </Card>

      <Card className="space-y-4 p-5">
        <h2 className="text-sm font-semibold text-ink-800">Brand Assets</h2>
        <Field label="Logo URL"><Input value={s.logo || ''} onChange={(e) => set('logo', e.target.value)} /></Field>
        {s.logo && <img src={s.logo} alt="logo" className="h-16 rounded bg-ink-50 p-2 object-contain" />}
        <Field label="Footer Logo URL"><Input value={s.footerLogo || ''} onChange={(e) => set('footerLogo', e.target.value)} /></Field>
        <Field label="Favicon URL"><Input value={s.favicon || ''} onChange={(e) => set('favicon', e.target.value)} /></Field>
      </Card>
    </div>
  );
}
