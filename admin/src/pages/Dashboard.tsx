import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../api';
import { Card, Badge } from '../components/ui';

type Stats = {
  total: number;
  published: number;
  drafts: number;
  featured: number;
  services: number;
  newInquiries: number;
  recentInquiries: any[];
  recentProjects: any[];
};

export default function Dashboard() {
  const [data, setData] = useState<Stats | null>(null);

  useEffect(() => {
    api.get('/admin/dashboard').then((r) => setData(r.data));
  }, []);

  if (!data) return <div>Loading…</div>;

  const cards = [
    { label: 'Total Projects', value: data.total },
    { label: 'Published', value: data.published },
    { label: 'Drafts', value: data.drafts },
    { label: 'Featured', value: data.featured },
    { label: 'Active Services', value: data.services },
    { label: 'New Inquiries', value: data.newInquiries },
  ];

  return (
    <div className="space-y-8">
      <h1 className="text-xl font-semibold text-ink-900">Dashboard</h1>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
        {cards.map((c) => (
          <Card key={c.label} className="p-4">
            <div className="text-2xl font-semibold text-ink-900">{c.value}</div>
            <div className="text-xs text-ink-400">{c.label}</div>
          </Card>
        ))}
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink-800">Recent Projects</h2>
            <Link to="/projects" className="text-xs text-ink-500 hover:text-ink-900">View all</Link>
          </div>
          <ul className="space-y-2">
            {data.recentProjects.map((p) => (
              <li key={p.id} className="flex items-center justify-between text-sm">
                <Link to={`/projects/${p.id}`} className="text-ink-700 hover:underline">{p.titleEn}</Link>
                <div className="flex gap-2">
                  {p.isFeatured && <Badge tone="amber">Featured</Badge>}
                  <Badge tone={p.isPublished ? 'green' : 'neutral'}>{p.isPublished ? 'Published' : 'Draft'}</Badge>
                </div>
              </li>
            ))}
            {data.recentProjects.length === 0 && <li className="text-sm text-ink-400">No projects yet.</li>}
          </ul>
        </Card>

        <Card className="p-5">
          <div className="mb-3 flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink-800">Recent Inquiries</h2>
            <Link to="/inquiries" className="text-xs text-ink-500 hover:text-ink-900">View all</Link>
          </div>
          <ul className="space-y-2">
            {data.recentInquiries.map((i) => (
              <li key={i.id} className="flex items-center justify-between text-sm">
                <span className="text-ink-700">{i.name} <span className="text-ink-400">· {i.email}</span></span>
                <Badge tone={i.status === 'new' ? 'blue' : 'neutral'}>{i.status}</Badge>
              </li>
            ))}
            {data.recentInquiries.length === 0 && <li className="text-sm text-ink-400">No inquiries yet.</li>}
          </ul>
        </Card>
      </div>
    </div>
  );
}
