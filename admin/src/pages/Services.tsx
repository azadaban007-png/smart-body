import { useEffect, useState } from 'react';
import { Plus, Trash2, ArrowUp, ArrowDown } from 'lucide-react';
import { api } from '../api';
import { Button, Card, Field, Input, Textarea, Badge } from '../components/ui';

type Service = {
  id: string; titleEn: string; titleFa: string; descriptionEn: string | null; descriptionFa: string | null;
  icon: string | null; displayOrder: number; isActive: boolean;
};

export default function Services() {
  const [items, setItems] = useState<Service[]>([]);
  const [draft, setDraft] = useState<Omit<Service, 'id'>>({ titleEn: '', titleFa: '', descriptionEn: '', descriptionFa: '', icon: '', displayOrder: 0, isActive: true });

  const load = () => api.get('/admin/services').then((r) => setItems(r.data));
  useEffect(load, []);

  const add = async () => {
    if (!draft.titleEn || !draft.titleFa) return;
    await api.post('/admin/services', { ...draft, displayOrder: items.length + 1 });
    setDraft({ titleEn: '', titleFa: '', descriptionEn: '', descriptionFa: '', icon: '', displayOrder: 0, isActive: true });
    load();
  };

  const update = async (s: Service, patch: Partial<Service>) => {
    setItems((arr) => arr.map((x) => (x.id === s.id ? { ...x, ...patch } : x)));
    await api.put(`/admin/services/${s.id}`, patch);
  };

  const remove = async (s: Service) => {
    if (!confirm(`Delete service "${s.titleEn}"?`)) return;
    await api.delete(`/admin/services/${s.id}`);
    load();
  };

  const move = async (s: Service, dir: -1 | 1) => {
    const idx = items.findIndex((x) => x.id === s.id);
    const target = idx + dir;
    if (target < 0 || target >= items.length) return;
    await update(s, { displayOrder: items[target].displayOrder });
    await update(items[target], { displayOrder: s.displayOrder });
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-ink-900">Services</h1>

      <Card className="p-5">
        <h2 className="mb-3 text-sm font-semibold text-ink-800">Add Service</h2>
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
          <Field label="Title (EN)"><Input value={draft.titleEn} onChange={(e) => setDraft({ ...draft, titleEn: e.target.value })} /></Field>
          <Field label="Title (FA)"><Input value={draft.titleFa} onChange={(e) => setDraft({ ...draft, titleFa: e.target.value })} dir="rtl" /></Field>
          <Field label="Icon (name)"><Input value={draft.icon || ''} onChange={(e) => setDraft({ ...draft, icon: e.target.value })} /></Field>
          <div className="flex items-end"><Button onClick={add}><Plus size={16} /> Add</Button></div>
        </div>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          <Field label="Description (EN)"><Textarea rows={2} value={draft.descriptionEn || ''} onChange={(e) => setDraft({ ...draft, descriptionEn: e.target.value })} /></Field>
          <Field label="Description (FA)"><Textarea rows={2} value={draft.descriptionFa || ''} onChange={(e) => setDraft({ ...draft, descriptionFa: e.target.value })} dir="rtl" /></Field>
        </div>
      </Card>

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-ink-200 bg-ink-50 text-left text-xs uppercase text-ink-400">
            <tr><th className="px-4 py-3">#</th><th className="px-4 py-3">Service</th><th className="px-4 py-3">Icon</th><th className="px-4 py-3">Active</th><th className="px-4 py-3 text-right">Actions</th></tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {items.map((s, i) => (
              <tr key={s.id} className="hover:bg-ink-50">
                <td className="px-4 py-3 text-ink-400">{i + 1}</td>
                <td className="px-4 py-3">
                  <Input className="mb-1" value={s.titleEn} onChange={(e) => update(s, { titleEn: e.target.value })} />
                  <Input value={s.titleFa} dir="rtl" onChange={(e) => update(s, { titleFa: e.target.value })} />
                </td>
                <td className="px-4 py-3"><Input value={s.icon || ''} onChange={(e) => update(s, { icon: e.target.value })} /></td>
                <td className="px-4 py-3">
                  <button onClick={() => update(s, { isActive: !s.isActive })}>
                    <Badge tone={s.isActive ? 'green' : 'neutral'}>{s.isActive ? 'Active' : 'Off'}</Badge>
                  </button>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => move(s, -1)}><ArrowUp size={14} /></Button>
                    <Button variant="ghost" size="sm" onClick={() => move(s, 1)}><ArrowDown size={14} /></Button>
                    <Button variant="ghost" size="sm" className="text-red-600" onClick={() => remove(s)}><Trash2 size={14} /></Button>
                  </div>
                </td>
              </tr>
            ))}
            {items.length === 0 && <tr><td colSpan={5} className="px-4 py-6 text-center text-ink-400">No services yet.</td></tr>}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
