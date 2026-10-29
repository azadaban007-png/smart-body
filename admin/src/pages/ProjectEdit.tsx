import { useEffect, useRef, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Trash2, Star, Upload } from 'lucide-react';
import { api } from '../api';
import { Button, Card, Field, Input, Textarea, Badge } from '../components/ui';

type Project = any;
type GalleryImage = { id: string; url: string; altEn: string | null; altFa: string | null; displayOrder: number };

const empty: Project = {
  titleEn: '', titleFa: '', slug: '', categoryEn: '', categoryFa: '', locationEn: '', locationFa: '',
  year: '', descriptionEn: '', descriptionFa: '', shortDescriptionEn: '', shortDescriptionFa: '',
  featuredImage: '', projectTypeEn: '', projectTypeFa: '', isFeatured: false, isPublished: false, displayOrder: 0,
  seoTitleEn: '', seoTitleFa: '', seoDescriptionEn: '', seoDescriptionFa: '', ogImage: '', canonicalUrl: '',
};

export default function ProjectEdit() {
  const { id } = useParams();
  const isNew = !id || id === 'new';
  const navigate = useNavigate();
  const [p, setP] = useState<Project>(empty);
  const [gallery, setGallery] = useState<GalleryImage[]>([]);
  const [saving, setSaving] = useState(false);
  const [msg, setMsg] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isNew) return;
    api.get(`/admin/projects/${id}`).then((r) => {
      setP({ ...empty, ...r.data });
      setGallery(r.data.gallery || []);
    });
  }, [id]);

  const set = (k: string, v: any) => setP((prev) => ({ ...prev, [k]: v }));

  const save = async () => {
    setSaving(true);
    setMsg('');
    try {
      const body = { ...p, year: p.year ? Number(p.year) : null };
      if (isNew) {
        const r = await api.post('/admin/projects', body);
        navigate(`/projects/${r.data.id}`, { replace: true });
      } else {
        const r = await api.put(`/admin/projects/${id}`, body);
        setP({ ...empty, ...r.data });
        setGallery(r.data.gallery || []);
        setMsg('Saved.');
      }
    } catch (e: any) {
      setMsg(e.response?.data?.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const onUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const fd = new FormData();
    fd.append('file', file);
    const r = await api.post(`/admin/projects/${id}/gallery`, fd);
    setGallery((g) => [...g, r.data]);
    e.target.value = '';
  };

  const updateImage = async (img: GalleryImage, patch: Partial<GalleryImage>) => {
    await api.put(`/admin/projects/${id}/gallery/${img.id}`, patch);
    setGallery((g) => g.map((x) => (x.id === img.id ? { ...x, ...patch } : x)));
  };

  const removeImage = async (img: GalleryImage) => {
    await api.delete(`/admin/projects/${id}/gallery/${img.id}`);
    setGallery((g) => g.filter((x) => x.id !== img.id));
  };

  const feature = async () => {
    await api.post(`/admin/projects/${id}/feature`);
    setP((prev) => ({ ...prev, isFeatured: true }));
  };

  return (
    <div className="mx-auto max-w-4xl space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="ghost" size="sm" onClick={() => navigate('/projects')}><ArrowLeft size={16} /> Back</Button>
          <h1 className="text-xl font-semibold text-ink-900">{isNew ? 'New Project' : p.titleEn || 'Project'}</h1>
        </div>
        <div className="flex items-center gap-2">
          {msg && <span className="text-sm text-ink-500">{msg}</span>}
          {!isNew && p.isFeatured && <Badge tone="amber">Featured</Badge>}
          {!isNew && !p.isFeatured && (
            <Button variant="outline" size="sm" onClick={feature}><Star size={14} /> Set Featured</Button>
          )}
          <Button onClick={save} disabled={saving}>{saving ? 'Saving…' : 'Save'}</Button>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card className="space-y-4 p-5">
          <h2 className="text-sm font-semibold text-ink-800">Content</h2>
          <Field label="Title (EN)"><Input value={p.titleEn} onChange={(e) => set('titleEn', e.target.value)} /></Field>
          <Field label="Title (FA)"><Input value={p.titleFa} onChange={(e) => set('titleFa', e.target.value)} dir="rtl" /></Field>
          <Field label="Slug" hint="URL: /projects/<slug>"><Input value={p.slug} onChange={(e) => set('slug', e.target.value.toLowerCase())} /></Field>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Category (EN)"><Input value={p.categoryEn || ''} onChange={(e) => set('categoryEn', e.target.value)} /></Field>
            <Field label="Category (FA)"><Input value={p.categoryFa || ''} onChange={(e) => set('categoryFa', e.target.value)} dir="rtl" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Location (EN)"><Input value={p.locationEn || ''} onChange={(e) => set('locationEn', e.target.value)} /></Field>
            <Field label="Location (FA)"><Input value={p.locationFa || ''} onChange={(e) => set('locationFa', e.target.value)} dir="rtl" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Project Type (EN)"><Input value={p.projectTypeEn || ''} onChange={(e) => set('projectTypeEn', e.target.value)} /></Field>
            <Field label="Project Type (FA)"><Input value={p.projectTypeFa || ''} onChange={(e) => set('projectTypeFa', e.target.value)} dir="rtl" /></Field>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <Field label="Year"><Input type="number" value={p.year || ''} onChange={(e) => set('year', e.target.value)} /></Field>
            <Field label="Display Order"><Input type="number" value={p.displayOrder || 0} onChange={(e) => set('displayOrder', Number(e.target.value))} /></Field>
          </div>
          <Field label="Short Description (EN)"><Textarea rows={2} value={p.shortDescriptionEn || ''} onChange={(e) => set('shortDescriptionEn', e.target.value)} /></Field>
          <Field label="Short Description (FA)"><Textarea rows={2} value={p.shortDescriptionFa || ''} onChange={(e) => set('shortDescriptionFa', e.target.value)} dir="rtl" /></Field>
          <Field label="Description (EN)"><Textarea rows={5} value={p.descriptionEn || ''} onChange={(e) => set('descriptionEn', e.target.value)} /></Field>
          <Field label="Description (FA)"><Textarea rows={5} value={p.descriptionFa || ''} onChange={(e) => set('descriptionFa', e.target.value)} dir="rtl" /></Field>
        </Card>

        <div className="space-y-6">
          <Card className="space-y-4 p-5">
            <h2 className="text-sm font-semibold text-ink-800">Featured Image & Status</h2>
            <Field label="Featured Image URL"><Input value={p.featuredImage || ''} onChange={(e) => set('featuredImage', e.target.value)} /></Field>
            {p.featuredImage && <img src={p.featuredImage} alt="" className="h-40 w-full rounded-lg object-cover" />}
            <div className="flex gap-6 pt-1">
              <label className="flex items-center gap-2 text-sm text-ink-700">
                <input type="checkbox" checked={!!p.isPublished} onChange={(e) => set('isPublished', e.target.checked)} /> Published
              </label>
              <label className="flex items-center gap-2 text-sm text-ink-700">
                <input type="checkbox" checked={!!p.isFeatured} onChange={(e) => set('isFeatured', e.target.checked)} /> Featured
              </label>
            </div>
          </Card>

          <Card className="space-y-4 p-5">
            <h2 className="text-sm font-semibold text-ink-800">SEO</h2>
            <Field label="SEO Title (EN)"><Input value={p.seoTitleEn || ''} onChange={(e) => set('seoTitleEn', e.target.value)} /></Field>
            <Field label="SEO Title (FA)"><Input value={p.seoTitleFa || ''} onChange={(e) => set('seoTitleFa', e.target.value)} dir="rtl" /></Field>
            <Field label="SEO Description (EN)"><Textarea rows={2} value={p.seoDescriptionEn || ''} onChange={(e) => set('seoDescriptionEn', e.target.value)} /></Field>
            <Field label="SEO Description (FA)"><Textarea rows={2} value={p.seoDescriptionFa || ''} onChange={(e) => set('seoDescriptionFa', e.target.value)} dir="rtl" /></Field>
            <Field label="OG Image URL"><Input value={p.ogImage || ''} onChange={(e) => set('ogImage', e.target.value)} /></Field>
            <Field label="Canonical URL"><Input value={p.canonicalUrl || ''} onChange={(e) => set('canonicalUrl', e.target.value)} /></Field>
          </Card>
        </div>
      </div>

      {!isNew && (
        <Card className="space-y-4 p-5">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-semibold text-ink-800">Gallery</h2>
            <Button variant="outline" size="sm" onClick={() => fileRef.current?.click()}>
              <Upload size={14} /> Add Image
            </Button>
            <input ref={fileRef} type="file" accept="image/jpeg,image/png,image/webp" hidden onChange={onUpload} />
          </div>
          {gallery.length === 0 && <p className="text-sm text-ink-400">No gallery images yet.</p>}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {gallery.map((img) => (
              <div key={img.id} className="space-y-2 rounded-lg border border-ink-200 p-3">
                <img src={img.url} alt={img.altEn || ''} className="h-32 w-full rounded object-cover" />
                <Input placeholder="Alt (EN)" value={img.altEn || ''} onChange={(e) => updateImage(img, { altEn: e.target.value })} />
                <Input placeholder="Alt (FA)" dir="rtl" value={img.altFa || ''} onChange={(e) => updateImage(img, { altFa: e.target.value })} />
                <div className="flex items-center justify-between">
                  <Input type="number" className="w-24" value={img.displayOrder} onChange={(e) => updateImage(img, { displayOrder: Number(e.target.value) })} />
                  <Button variant="ghost" size="sm" className="text-red-600" onClick={() => removeImage(img)}><Trash2 size={14} /></Button>
                </div>
              </div>
            ))}
          </div>
        </Card>
      )}
    </div>
  );
}
