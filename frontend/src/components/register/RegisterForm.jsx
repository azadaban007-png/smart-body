import { useState } from "react";
import { toast } from "sonner";
import { Loader2, Send } from "lucide-react";
import { createRegistration } from "@/services/api";
import { normalizeDigits } from "@/lib/format";
import { FormField } from "@/components/register/FormField";
import { ImageDropzone } from "@/components/register/ImageDropzone";
import { SportsPicker } from "@/components/register/SportsPicker";
import { LandingChoice } from "@/components/register/LandingChoice";
import { CityCombobox } from "@/components/common/CityCombobox";

const EMPTY = { gymName: "", managerName: "", phone: "", city: "", neighborhood: "", address: "", image: null, sports: [], landingPageRequested: null };

const validate = (f) => {
  const e = {};
  if (f.gymName.trim().length < 2) e.gymName = "نام باشگاه را وارد کنید.";
  if (f.managerName.trim().length < 2) e.managerName = "نام مدیر یا مسئول را وارد کنید.";
  if (!/^0\d{10}$/.test(normalizeDigits(f.phone).replace(/[\s-]/g, ""))) e.phone = "شماره تماس معتبر نیست (مثال: ۰۹۱۲۳۴۵۶۷۸۹).";
  if (!f.city) e.city = "شهر را انتخاب کنید.";
  if (f.neighborhood.trim().length < 2) e.neighborhood = "محله را وارد کنید.";
  if (f.address.trim().length < 5) e.address = "آدرس کامل را وارد کنید.";
  if (!f.image) e.image = "تصویر اصلی باشگاه را بارگذاری کنید.";
  if (!f.sports.length) e.sports = "حداقل یک رشته ورزشی انتخاب کنید.";
  if (f.landingPageRequested === null) e.landing = "لطفاً یکی از گزینه‌ها را انتخاب کنید.";
  return e;
};

export const RegisterForm = ({ onSuccess }) => {
  const [form, setForm] = useState(EMPTY);
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const set = (key) => (value) => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key === "landingPageRequested" ? "landing" : key]: undefined }));
  };
  const text = (key) => ({ value: form[key], onChange: (e) => set(key)(e.target.value), "aria-invalid": Boolean(errors[key]) });

  const submit = async (e) => {
    e.preventDefault();
    const found = validate(form);
    setErrors(found);
    if (Object.keys(found).length) {
      toast.error("لطفاً موارد مشخص‌شده را تکمیل کنید.");
      return;
    }
    setSubmitting(true);
    try {
      const { image, ...rest } = form;
      const saved = await createRegistration({ ...rest, phone: normalizeDigits(form.phone).replace(/[\s-]/g, ""), imagePath: image.path });
      onSuccess(saved);
    } catch {
      toast.error("ثبت اطلاعات با خطا مواجه شد. دوباره تلاش کنید.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={submit} noValidate data-testid="register-form" className="space-y-7 rounded-[2rem] border border-sb-border bg-sb-surface p-5 sm:p-9">
      <div className="grid gap-6 sm:grid-cols-2">
        <FormField label="نام باشگاه" htmlFor="gymName" required error={errors.gymName}>
          <input id="gymName" className="sb-input" placeholder="مثلاً باشگاه انرژی" data-testid="register-gym-name" {...text("gymName")} />
        </FormField>
        <FormField label="نام مدیر / مسئول" htmlFor="managerName" required error={errors.managerName}>
          <input id="managerName" className="sb-input" placeholder="نام و نام خانوادگی" data-testid="register-manager-name" {...text("managerName")} />
        </FormField>
        <FormField label="شماره تماس" htmlFor="phone" required error={errors.phone}>
          <input id="phone" type="tel" inputMode="tel" dir="ltr" className="sb-input text-right" placeholder="۰۹۱۲۳۴۵۶۷۸۹" data-testid="register-phone" {...text("phone")} />
        </FormField>
        <FormField label="شهر" labelId="city-label" required error={errors.city}>
          <CityCombobox value={form.city} onChange={set("city")} labelId="city-label" invalid={Boolean(errors.city)} testId="register-city-select" className="sb-input" />
        </FormField>
        <FormField label="محله" htmlFor="neighborhood" required error={errors.neighborhood} className="sm:col-span-2">
          <input id="neighborhood" className="sb-input" placeholder="مثلاً شهرک مدنی" data-testid="register-neighborhood" {...text("neighborhood")} />
        </FormField>
        <FormField label="آدرس کامل" htmlFor="address" required error={errors.address} className="sm:col-span-2">
          <textarea id="address" rows={3} className="sb-input resize-none leading-7" placeholder="خیابان، کوچه، پلاک" data-testid="register-address" {...text("address")} />
        </FormField>
      </div>
      <FormField label="تصویر اصلی باشگاه" htmlFor="gym-image" required error={errors.image}>
        <ImageDropzone value={form.image} onChange={set("image")} invalid={Boolean(errors.image)} />
      </FormField>
      <FormField label="رشته‌های ورزشی باشگاه" labelId="sports-label" required error={errors.sports} hint="می‌توانید چند رشته را انتخاب کنید.">
        <SportsPicker value={form.sports} onChange={set("sports")} labelId="sports-label" />
      </FormField>
      <FormField label="آیا لندینگ پیج اختصاصی باشگاه خود را می‌خواهید؟" labelId="landing-label" required error={errors.landing}>
        <LandingChoice value={form.landingPageRequested} onChange={set("landingPageRequested")} labelId="landing-label" invalid={Boolean(errors.landing)} />
      </FormField>
      <button type="submit" disabled={submitting} data-testid="register-submit-button" className="sb-btn-primary h-14 w-full text-base">
        {submitting ? <Loader2 className="h-5 w-5 animate-spin" /> : <Send className="h-5 w-5 -scale-x-100" />}
        {submitting ? "در حال ثبت..." : "ثبت اطلاعات باشگاه"}
      </button>
    </form>
  );
};
