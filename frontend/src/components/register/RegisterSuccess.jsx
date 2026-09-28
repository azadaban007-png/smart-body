import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle2 } from "lucide-react";

export const RegisterSuccess = ({ registration, onReset }) => (
  <motion.div
    initial={{ opacity: 0, scale: 0.97 }}
    animate={{ opacity: 1, scale: 1 }}
    transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
    data-testid="register-success"
    className="flex flex-col items-center rounded-[2rem] border border-sb-border bg-sb-surface px-6 py-14 text-center sm:px-12"
  >
    <span className="grid h-20 w-20 place-items-center rounded-full bg-emerald-500/10 text-emerald-500"><CheckCircle2 className="h-10 w-10" /></span>
    <h2 className="mt-6 text-2xl font-black text-sb-text sm:text-3xl">اطلاعات «{registration.gymName}» با موفقیت ثبت شد</h2>
    <p className="mt-4 max-w-md leading-8 text-sb-muted">پس از بررسی توسط تیم بدن هوشمند، باشگاه شما در فهرست باشگاه‌ها نمایش داده می‌شود.</p>
    {registration.landingPageRequested && (
      <p className="mt-4 rounded-2xl bg-sb-primary/10 px-5 py-3 text-sm font-semibold text-sb-deep dark:text-sb-cyan" data-testid="register-success-landing-note">
        درخواست لندینگ پیج اختصاصی ثبت شد؛ به‌زودی با شما تماس می‌گیریم.
      </p>
    )}
    <div className="mt-8 flex flex-wrap justify-center gap-3">
      <Link to="/" data-testid="register-success-home" className="sb-btn-primary h-12 px-6">بازگشت به صفحه اصلی</Link>
      <button type="button" onClick={onReset} data-testid="register-success-again" className="inline-flex h-12 items-center rounded-full border border-sb-border px-6 font-bold text-sb-text transition-colors hover:border-sb-primary">
        ثبت باشگاه دیگر
      </button>
    </div>
  </motion.div>
);
