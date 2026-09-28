import { useRef, useState } from "react";
import { toast } from "sonner";
import { ImagePlus, Loader2, RefreshCw, Trash2 } from "lucide-react";
import { uploadImage } from "@/services/api";

const MAX_BYTES = 5 * 1024 * 1024;

export const ImageDropzone = ({ value, onChange, invalid }) => {
  const inputRef = useRef(null);
  const [uploading, setUploading] = useState(false);
  const [drag, setDrag] = useState(false);

  const handleFile = async (file) => {
    if (!file) return;
    if (!/^image\/(jpeg|png|webp|gif)$/.test(file.type)) return toast.error("فرمت تصویر باید JPG، PNG یا WEBP باشد.");
    if (file.size > MAX_BYTES) return toast.error("حجم تصویر باید کمتر از ۵ مگابایت باشد.");
    setUploading(true);
    try {
      const res = await uploadImage(file);
      onChange({ path: res.path, previewUrl: URL.createObjectURL(file), name: file.name });
      toast.success("تصویر باشگاه بارگذاری شد.");
    } catch {
      toast.error("بارگذاری تصویر ناموفق بود. دوباره تلاش کنید.");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
    return undefined;
  };

  const onDrop = (e) => {
    e.preventDefault();
    setDrag(false);
    handleFile(e.dataTransfer.files?.[0]);
  };

  return (
    <div onDragOver={(e) => { e.preventDefault(); setDrag(true); }} onDragLeave={() => setDrag(false)} onDrop={onDrop}>
      {value ? (
        <div className="relative overflow-hidden rounded-2xl border border-sb-border" data-testid="register-image-preview">
          <img src={value.previewUrl} alt="پیش‌نمایش تصویر باشگاه" className="h-56 w-full object-cover" />
          <div className="absolute bottom-3 left-3 flex gap-2">
            <button type="button" onClick={() => inputRef.current?.click()} data-testid="register-image-replace" className="sb-glass inline-flex h-10 items-center gap-1.5 rounded-full px-4 text-sm font-semibold text-sb-text"><RefreshCw className="h-4 w-4" />تغییر</button>
            <button type="button" onClick={() => onChange(null)} data-testid="register-image-remove" aria-label="حذف تصویر" className="sb-glass grid h-10 w-10 place-items-center rounded-full text-rose-500"><Trash2 className="h-4 w-4" /></button>
          </div>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={uploading}
          aria-invalid={invalid}
          data-testid="register-image-dropzone"
          className={`flex h-56 w-full flex-col items-center justify-center gap-3 rounded-2xl border-2 border-dashed text-center transition-colors duration-300 ${
            drag ? "border-sb-primary bg-sb-primary/5" : invalid ? "border-rose-400" : "border-sb-border hover:border-sb-primary/60"
          } bg-sb-bg`}
        >
          <span className="grid h-14 w-14 place-items-center rounded-2xl bg-sb-primary/10 text-sb-primary">
            {uploading ? <Loader2 className="h-6 w-6 animate-spin" /> : <ImagePlus className="h-6 w-6" />}
          </span>
          <span className="font-semibold text-sb-text">{uploading ? "در حال بارگذاری..." : "تصویر اصلی باشگاه را انتخاب یا اینجا رها کنید"}</span>
          <span className="text-xs text-sb-muted">JPG، PNG یا WEBP — حداکثر ۵ مگابایت</span>
        </button>
      )}
      <input ref={inputRef} id="gym-image" type="file" accept="image/jpeg,image/png,image/webp,image/gif" className="sr-only" data-testid="register-image-input" onChange={(e) => handleFile(e.target.files?.[0])} />
    </div>
  );
};
