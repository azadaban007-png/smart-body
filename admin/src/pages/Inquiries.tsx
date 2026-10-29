import { useEffect, useState } from 'react';
import { api } from '../api';
import { Card, Badge, Input, Button } from '../components/ui';

type Inquiry = {
  id: string; name: string; email: string; phone: string | null; projectType: string | null;
  budget: string | null; message: string; language: string; status: string; createdAt: string;
};

const STATUSES = ['new', 'contacted', 'in_progress', 'completed', 'archived'];
const tone = (s: string) => ({ new: 'blue', contacted: 'amber', in_progress: 'amber', completed: 'green', archived: 'neutral' }[s] || 'neutral');

export default function Inquiries() {
  const [items, setItems] = useState<Inquiry[]>([]);
  const [q, setQ] = useState('');
  const [status, setStatus] = useState('');
  const [sort, setSort] = useState('desc');
  const [active, setActive] = useState<Inquiry | null>(null);

  const load = () => {
    const params: any = { sort };
    if (q) params.q = q;
    if (status) params.status = status;
    api.get('/admin/inquiries', { params }).then((r) => setItems(r.data));
  };
  useEffect(load, [q, status, sort]);

  const changeStatus = async (inq: Inquiry, s: string) => {
    await api.put(`/admin/inquiries/${inq.id}`, { status: s });
    setActive({ ...inq, status: s });
    load();
  };

  const remove = async (inq: Inquiry) => {
    if (!confirm('Delete this inquiry?')) return;
    await api.delete(`/admin/inquiries/${inq.id}`);
    setActive(null);
    load();
  };

  return (
    <div className="space-y-6">
      <h1 className="text-xl font-semibold text-ink-900">Inquiries</h1>

      <div className="flex flex-wrap gap-3">
        <Input placeholder="Search name / email…" value={q} onChange={(e) => setQ(e.target.value)} className="max-w-xs" />
        <select value={status} onChange={(e) => setStatus(e.target.value)} className="rounded-md border border-ink-200 bg-white px-3 py-2 text-sm">
          <option value="">All statuses</option>
          {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <select value={sort} onChange={(e) => setSort(e.target.value)} className="rounded-md border border-ink-200 bg-white px-3 py-2 text-sm">
          <option value="desc">Newest first</option>
          <option value="asc">Oldest first</option>
        </select>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        <Card className="overflow-hidden lg:col-span-2">
          <table className="w-full text-sm">
            <thead className="border-b border-ink-200 bg-ink-50 text-left text-xs uppercase text-ink-400">
              <tr><th className="px-4 py-3">Name</th><th className="px-4 py-3">Project Type</th><th className="px-4 py-3">Date</th><th className="px-4 py-3">Status</th></tr>
            </thead>
            <tbody className="divide-y divide-ink-100">
              {items.map((i) => (
                <tr key={i.id} className={`cursor-pointer hover:bg-ink-50 ${active?.id === i.id ? 'bg-ink-100' : ''}`} onClick={() => setActive(i)}>
                  <td className="px-4 py-3">
                    <div className="font-medium text-ink-800">{i.name}</div>
                    <div className="text-xs text-ink-400">{i.email}</div>
                  </td>
                  <td className="px-4 py-3 text-ink-600">{i.projectType || '—'}</td>
                  <td className="px-4 py-3 text-ink-500">{new Date(i.createdAt).toLocaleDateString()}</td>
                  <td className="px-4 py-3"><Badge tone={tone(i.status) as any}>{i.status}</Badge></td>
                </tr>
              ))}
              {items.length === 0 && <tr><td colSpan={4} className="px-4 py-6 text-center text-ink-400">No inquiries.</td></tr>}
            </tbody>
          </table>
        </Card>

        <Card className="p-5">
          {!active ? (
            <p className="text-sm text-ink-400">Select an inquiry to view details.</p>
          ) : (
            <div className="space-y-3">
              <h2 className="text-sm font-semibold text-ink-800">{active.name}</h2>
              <div className="text-sm text-ink-600"><a href={`mailto:${active.email}`} className="text-blue-600 hover:underline">{active.email}</a></div>
              {active.phone && <div className="text-sm text-ink-600">{active.phone}</div>}
              <div className="grid grid-cols-2 gap-2 text-sm">
                <div><span className="text-ink-400">Type:</span> {active.projectType || '—'}</div>
                <div><span className="text-ink-400">Budget:</span> {active.budget || '—'}</div>
                <div><span className="text-ink-400">Lang:</span> {active.language}</div>
                <div><span className="text-ink-400">Date:</span> {new Date(active.createdAt).toLocaleString()}</div>
              </div>
              <div className="rounded-md bg-ink-50 p-3 text-sm text-ink-700">{active.message}</div>
              <div>
                <span className="text-xs font-medium uppercase text-ink-400">Status</span>
                <select value={active.status} onChange={(e) => changeStatus(active, e.target.value)} className="mt-1 w-full rounded-md border border-ink-200 bg-white px-3 py-2 text-sm">
                  {STATUSES.map((s) => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
              <Button variant="danger" size="sm" onClick={() => remove(active)}>Delete inquiry</Button>
            </div>
          )}
        </Card>
      </div>
    </div>
  );
}
