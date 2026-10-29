import { useEffect, useRef, useState } from 'react';
import { Upload, Trash2 } from 'lucide-react';
import { api } from '../api';
import { Button, Card, Input } from '../components/ui';

type Media = { id: string; url: string; filename: string; altEn: string | null; altFa: string | null; createdAt: string };

export default function MediaPage() {
  const [items, setItems] = useState<Media[]>([]);
  const fileRef = useRef<HTMLInputElement>(null);

  const load = () => api.get('/admin/media').then((r) => setItems(r.data));
  useEffect(load, []);

  const upload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    await api.post('/admin/media', fd);
    load();
    e.target.value = '';
  };

  const updateAlt = async (m: Media, altEn: string, altFa: string) => {
    await api.put(`/admin/media/${m.id}`, { altEn, altFa });
  };

  const remove = async (m: Media) => {
    if (!confirm('Delete this media file?')) return;
    await api.delete(`/admin/media/${m.id}`);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink-900">Media Library</h1>
        <Button onClick={() => fileRef.current?.click()}><Upload size={16} /> Upload</Button>
        <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={upload} />
      </div>

      {items.length === 0 ? (
        <Card className="p-10 text-center text-sm text-ink-400">No media uploaded yet. JPG, PNG or WEBP only.</Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((m) => (
            <Card key={m.id} className="space-y-2 p-3">
              <img src={m.url} alt={m.altEn || ''} className="h-32 w-full rounded object-cover" />
              <div className="truncate text-xs text-ink-400">{m.filename}</div>
              <Input placeholder="Alt (EN)" defaultValue={m.altEn || ''} onBlur={(e) => updateAlt(m, e.target.value, m.altFa || '')} />
              <Input placeholder="Alt (FA)" dir="rtl" defaultValue={m.altFa || ''} onBlur={(e) => updateAlt(m, m.altEn || '', e.target.value)} />
              <Button variant="ghost" size="sm" className="w-full text-red-600" onClick={() => remove(m)}><Trash2 size={14} /> Delete</Button>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
