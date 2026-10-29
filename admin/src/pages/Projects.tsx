import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Star, Eye, EyeOff } from 'lucide-react';
import { api } from '../api';
import { Button, Card, Badge, Input } from '../components/ui';

type Project = {
  id: string;
  titleEn: string;
  titleFa: string;
  slug: string;
  categoryEn: string | null;
  year: number | null;
  isFeatured: boolean;
  isPublished: boolean;
  displayOrder: number;
  featuredImage: string | null;
};

export default function Projects() {
  const [items, setItems] = useState<Project[]>([]);
  const [q, setQ] = useState('');
  const [loading, setLoading] = useState(true);

  const load = () => {
    setLoading(true);
    api.get('/admin/projects', { params: q ? { q } : {} }).then((r) => setItems(r.data)).finally(() => setLoading(false));
  };

  useEffect(load, [q]);

  const togglePublish = async (p: Project) => {
    await api.post(`/admin/projects/${p.id}/publish`);
    load();
  };
  const feature = async (p: Project) => {
    await api.post(`/admin/projects/${p.id}/feature`);
    load();
  };
  const remove = async (p: Project) => {
    if (!confirm(`Delete "${p.titleEn}"? This cannot be undone.`)) return;
    await api.delete(`/admin/projects/${p.id}`);
    load();
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-semibold text-ink-900">Projects</h1>
        <Link to="/projects/new">
          <Button><Plus size={16} /> New Project</Button>
        </Link>
      </div>

      <Input placeholder="Search by title or slug…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-sm" />

      <Card className="overflow-hidden">
        <table className="w-full text-sm">
          <thead className="border-b border-ink-200 bg-ink-50 text-left text-xs uppercase text-ink-400">
            <tr>
              <th className="px-4 py-3">Project</th>
              <th className="px-4 py-3">Category</th>
              <th className="px-4 py-3">Year</th>
              <th className="px-4 py-3">Order</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-ink-100">
            {loading && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-ink-400">Loading…</td></tr>
            )}
            {!loading && items.length === 0 && (
              <tr><td colSpan={6} className="px-4 py-6 text-center text-ink-400">No projects found.</td></tr>
            )}
            {items.map((p) => (
              <tr key={p.id} className="hover:bg-ink-50">
                <td className="px-4 py-3">
                  <div className="flex items-center gap-3">
                    {p.featuredImage && <img src={p.featuredImage} alt="" className="h-10 w-14 rounded object-cover" />}
                    <div>
                      <Link to={`/projects/${p.id}`} className="font-medium text-ink-800 hover:underline">{p.titleEn}</Link>
                      <div className="text-xs text-ink-400">{p.titleFa} · /{p.slug}</div>
                    </div>
                  </div>
                </td>
                <td className="px-4 py-3 text-ink-600">{p.categoryEn || '—'}</td>
                <td className="px-4 py-3 text-ink-600">{p.year || '—'}</td>
                <td className="px-4 py-3 text-ink-600">{p.displayOrder}</td>
                <td className="px-4 py-3">
                  <div className="flex gap-1.5">
                    {p.isFeatured && <Badge tone="amber">Featured</Badge>}
                    <Badge tone={p.isPublished ? 'green' : 'neutral'}>{p.isPublished ? 'Published' : 'Draft'}</Badge>
                  </div>
                </td>
                <td className="px-4 py-3">
                  <div className="flex justify-end gap-1">
                    <Button variant="ghost" size="sm" onClick={() => feature(p)} title="Set featured">
                      <Star size={14} className={p.isFeatured ? 'fill-amber-400 text-amber-400' : ''} />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => togglePublish(p)} title="Toggle publish">
                      {p.isPublished ? <Eye size={14} /> : <EyeOff size={14} />}
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => remove(p)} className="text-red-600">Delete</Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </Card>
    </div>
  );
}
