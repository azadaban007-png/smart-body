import { useState } from "react";
import { Check } from "lucide-react";
import { OWNER_CTA } from "@/config/site";
import { RegisterForm } from "@/components/register/RegisterForm";
import { RegisterSuccess } from "@/components/register/RegisterSuccess";

const Intro = () => (
  <aside className="relative isolate h-fit overflow-hidden rounded-[2rem] bg-sb-ink p-7 text-white sm:p-9 lg:sticky lg:top-28">
    <img src={OWNER_CTA.image} alt="" className="absolute inset-0 -z-20 h-full w-full object-cover opacity-60" />
    <div className="absolute inset-0 -z-10 bg-gradient-to-t from-sb-ink via-sb-ink/80 to-sb-ink/40" />
    <p className="text-sm font-bold text-sb-cyan">ثبت باشگاه</p>
    <h1 className="mt-4 text-3xl font-black leading-[1.45] sm:text-4xl" data-testid="register-title">باشگاهت را در بدن هوشمند ثبت کن</h1>
    <p className="mt-4 leading-8 text-white/75">با تکمیل این فرم، باشگاه شما پس از بررسی در جستجوی شهر و محله به ورزشکاران نمایش داده می‌شود.</p>
    <ul className="mt-8 space-y-3">
      {OWNER_CTA.points.map((p) => (
        <li key={p} className="flex items-center gap-3 text-sm text-white/85">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-sb-cyan/20 text-sb-cyan"><Check className="h-3.5 w-3.5" /></span>
          {p}
        </li>
      ))}
    </ul>
  </aside>
);

export default function RegisterGymPage() {
  const [saved, setSaved] = useState(null);
  return (
    <div data-testid="register-page" className="sb-container grid gap-8 pb-24 pt-28 sm:pt-32 lg:grid-cols-[0.85fr_1.4fr] lg:gap-10">
      <Intro />
      <div>{saved ? <RegisterSuccess registration={saved} onReset={() => setSaved(null)} /> : <RegisterForm onSuccess={setSaved} />}</div>
    </div>
  );
}
