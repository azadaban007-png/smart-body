import { Link } from "react-router-dom";

export default function NotFoundPage() {
  return (
    <div data-testid="not-found-page" className="sb-container flex min-h-[75vh] flex-col items-center justify-center pt-24 text-center">
      <p className="text-7xl font-black text-sb-primary/30">۴۰۴</p>
      <h1 className="mt-4 text-2xl font-black text-sb-text">صفحه موردنظر پیدا نشد</h1>
      <Link to="/" className="sb-btn-primary mt-6 h-12 px-6">بازگشت به صفحه اصلی</Link>
    </div>
  );
}
