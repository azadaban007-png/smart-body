import { useEffect, useState } from 'react';
import { api } from '../api';
import { Button, Card, Field, Input, Textarea } from '../components/ui';

type P = any;
const empty: P = { titleEn: '', titleFa: '', descriptionEn: '', descriptionFa: '', image: '', buttonTextEn: '', buttonTextFa: '', buttonUrl: '' };

export default function Philosophy() {
  const [p, setP] = useState<P>(empty);
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => { api.get('/admin/philosophy').then((r) => setP({ ...empty, ...r.data })); }, []);
  const set = (k: string, v: any) => setP((prev) => ({ ...prev, [k]: v }));

  const save = async () => {
    setSaving(true); setMsg('');
    try { await api.put('/admin/philosophy', p); setMsg('Saved.'); } catch { setMsg('Save failed.'); } finally { setSaving(false); }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink-900">Philosophy / About</h1>
        <div className="flex items-center gap-3">
          {msg && <span className="text-sm text-ink-500">{msg}</span>}
          <Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
        </div>
      </div>

      <Card className="space-y-4 p-5">
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Title (EN)"><Input value={p.titleEn || ''} onChange={(e) => set('titleEn', e.target.value)} /></Field>
          <Field label="Title (FA)"><Input value={p.titleFa || ''} onChange={(e) => set('titleFa', e.target.value)} dir="rtl" /></Field>
        </div>
        <Field label="Description (EN)"><Textarea rows={4} value={p.descriptionEn || ''} onChange={(e) => set('descriptionEn', e.target.value)} /></Field>
        <Field label="Description (FA)"><Textarea rows={4} value={p.descriptionFa || ''} onChange={(e) => set('descriptionFa', e.target.value)} dir="rtl" /></Field>
        <Field label="Image URL"><Input value={p.image || ''} onChange={(e) => set('image', e.target.value)} /></Field>
        {p.image && <img src={p.image} alt="" className="h-40 w-full rounded-lg object-cover" />}
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Button Text (EN)"><Input value={p.buttonTextEn || ''} onChange={(e) => set('buttonTextEn', e.target.value)} /></Field>
          <Field label="Button Text (FA)"><Input value={p.buttonTextFa || ''} onChange={(e) => set('buttonTextFa', e.target.value)} dir="rtl" /></Field>
        </div>
        <Field label="Button URL"><Input value={p.buttonUrl || ''} onChange={(e) => set('buttonUrl', e.target.value)} /></Field>
      </Card>
    </div>
  );
}
