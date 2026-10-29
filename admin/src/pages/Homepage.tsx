import { useEffect, useState } from 'react';
import { api } from '../api';
import { Button, Card, Field, Input, Textarea } from '../components/ui';

type H = any;
const empty: H = {
  heroEyebrowEn: '', heroEyebrowFa: '', heroTitleEn: '', heroTitleFa: '', heroDescriptionEn: '', heroDescriptionFa: '',
  heroImage: '', ctaTextEn: '', ctaTextFa: '', ctaUrl: '', featuredProjectId: '',
  projectsSectionTitleEn: '', projectsSectionTitleFa: '', projectsSectionDescriptionEn: '', projectsSectionDescriptionFa: '',
  ctaTitleEn: '', ctaTitleFa: '', ctaDescriptionEn: '', ctaDescriptionFa: '',
  ctaButtonTextEn: '', ctaButtonTextFa: '', ctaButtonUrl: '', ctaBackgroundImage: '',
};

export default function Homepage() {
  const [h, setH] = useState<H>(empty);
  const [projects, setProjects] = useState<any[]>([]);
  const [msg, setMsg] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    api.get('/admin/homepage').then((r) => setH({ ...empty, ...r.data }));
    api.get('/admin/projects').then((r) => setProjects(r.data));
  }, []);
  const set = (k: string, v: any) => setH((p) => ({ ...p, [k]: v }));

  const save = async () => {
    setSaving(true); setMsg('');
    try { await api.put('/admin/homepage', h); setMsg('Saved.'); } catch { setMsg('Save failed.'); } finally { setSaving(false); }
  };

  return (
    <div className="mx-auto max-w-3xl space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink-900">Homepage Settings</h1>
        <div className="flex items-center gap-3">
          {msg && <span className="text-sm text-ink-500">{msg}</span>}
          <Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
        </div>
      </div>

      <Card className="space-y-4 p-5">
        <h2 className="text-sm font-semibold text-ink-800">Hero</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Eyebrow (EN)"><Input value={h.heroEyebrowEn || ''} onChange={(e) => set('heroEyebrowEn', e.target.value)} /></Field>
          <Field label="Eyebrow (FA)"><Input value={h.heroEyebrowFa || ''} onChange={(e) => set('heroEyebrowFa', e.target.value)} dir="rtl" /></Field>
          <Field label="Title (EN)"><Input value={h.heroTitleEn || ''} onChange={(e) => set('heroTitleEn', e.target.value)} /></Field>
          <Field label="Title (FA)"><Input value={h.heroTitleFa || ''} onChange={(e) => set('heroTitleFa', e.target.value)} dir="rtl" /></Field>
        </div>
        <Field label="Description (EN)"><Textarea rows={2} value={h.heroDescriptionEn || ''} onChange={(e) => set('heroDescriptionEn', e.target.value)} /></Field>
        <Field label="Description (FA)"><Textarea rows={2} value={h.heroDescriptionFa || ''} onChange={(e) => set('heroDescriptionFa', e.target.value)} dir="rtl" /></Field>
        <Field label="Hero Image URL"><Input value={h.heroImage || ''} onChange={(e) => set('heroImage', e.target.value)} /></Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="CTA Text (EN)"><Input value={h.ctaTextEn || ''} onChange={(e) => set('ctaTextEn', e.target.value)} /></Field>
          <Field label="CTA Text (FA)"><Input value={h.ctaTextFa || ''} onChange={(e) => set('ctaTextFa', e.target.value)} dir="rtl" /></Field>
        </div>
        <Field label="CTA URL"><Input value={h.ctaUrl || ''} onChange={(e) => set('ctaUrl', e.target.value)} /></Field>
      </Card>

      <Card className="space-y-4 p-5">
        <h2 className="text-sm font-semibold text-ink-800">Featured Project</h2>
        <Field label="Featured Project">
          <select value={h.featuredProjectId || ''} onChange={(e) => set('featuredProjectId', e.target.value)} className="w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-sm">
            <option value="">— None —</option>
            {projects.map((p) => <option key={p.id} value={p.id}>{p.titleEn}</option>)}
          </select>
        </Field>
      </Card>

      <Card className="space-y-4 p-5">
        <h2 className="text-sm font-semibold text-ink-800">Projects Section</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Section Title (EN)"><Input value={h.projectsSectionTitleEn || ''} onChange={(e) => set('projectsSectionTitleEn', e.target.value)} /></Field>
          <Field label="Section Title (FA)"><Input value={h.projectsSectionTitleFa || ''} onChange={(e) => set('projectsSectionTitleFa', e.target.value)} dir="rtl" /></Field>
        </div>
        <Field label="Section Description (EN)"><Textarea rows={2} value={h.projectsSectionDescriptionEn || ''} onChange={(e) => set('projectsSectionDescriptionEn', e.target.value)} /></Field>
        <Field label="Section Description (FA)"><Textarea rows={2} value={h.projectsSectionDescriptionFa || ''} onChange={(e) => set('projectsSectionDescriptionFa', e.target.value)} dir="rtl" /></Field>
      </Card>

      <Card className="space-y-4 p-5">
        <h2 className="text-sm font-semibold text-ink-800">Bottom CTA</h2>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Title (EN)"><Input value={h.ctaTitleEn || ''} onChange={(e) => set('ctaTitleEn', e.target.value)} /></Field>
          <Field label="Title (FA)"><Input value={h.ctaTitleFa || ''} onChange={(e) => set('ctaTitleFa', e.target.value)} dir="rtl" /></Field>
        </div>
        <Field label="Description (EN)"><Textarea rows={2} value={h.ctaDescriptionEn || ''} onChange={(e) => set('ctaDescriptionEn', e.target.value)} /></Field>
        <Field label="Description (FA)"><Textarea rows={2} value={h.ctaDescriptionFa || ''} onChange={(e) => set('ctaDescriptionFa', e.target.value)} dir="rtl" /></Field>
        <div className="grid gap-3 sm:grid-cols-2">
          <Field label="Button Text (EN)"><Input value={h.ctaButtonTextEn || ''} onChange={(e) => set('ctaButtonTextEn', e.target.value)} /></Field>
          <Field label="Button Text (FA)"><Input value={h.ctaButtonTextFa || ''} onChange={(e) => set('ctaButtonTextFa', e.target.value)} dir="rtl" /></Field>
        </div>
        <Field label="Button URL"><Input value={h.ctaButtonUrl || ''} onChange={(e) => set('ctaButtonUrl', e.target.value)} /></Field>
        <Field label="Background Image URL"><Input value={h.ctaBackgroundImage || ''} onChange={(e) => set('ctaBackgroundImage', e.target.value)} /></Field>
      </Card>
    </div>
  );
}
