import { Link } from "@tanstack/react-router";
import { ArrowLeft } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

const POSTS = [
  { title: "هنر سلایت", excerpt: "چگونه یک سنگ منفرد به یک عمر نور تبدیل می‌شود.", tag: "صنعت", img: "/ring.jpg" },
  { title: "انتخاب داستان عروس شما", excerpt: "راهنمایی برای ساختن یک ست که کاملاً مال شما باشد.", tag: "عروس", img: "/bridal.jpg" },
  { title: "مراقبت از جواهرات فاخر", excerpt: "آیین‌های ساده برای درخشش هر تکه در دهه‌ها.", tag: "مراقبت", img: "/hoops.jpg" },
  { title: "کالکشن آرورا", excerpt: "در الهام‌بخشی آویزهای پاوه ما.", tag: "کالکشن", img: "/aurora-necklace.jpg" },
];

export function Journal() {
  return (
    <div className="pb-20">
      <PageHeader title="ژورنال" crumbs={["ژورنال"]} />
      <div className="mx-auto mt-8 max-w-7xl px-4 md:px-8">
        <div className="grid gap-8 md:grid-cols-2">
          {POSTS.map((post) => (
            <article key={post.title} className="card-lux group overflow-hidden">
              <div className="aspect-[16/10] overflow-hidden">
                <img src={post.img} alt={post.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" />
              </div>
              <div className="p-6">
                <span className="eyebrow">{post.tag}</span>
                <h2 className="mt-2 font-serif text-2xl">{post.title}</h2>
                <p className="mt-2 text-sm text-muted-foreground">{post.excerpt}</p>
                <a href="#" className="mt-4 inline-flex items-center gap-1 text-xs uppercase tracking-widest text-gold hover:underline">ادامه مطلب <ArrowLeft className="h-3 w-3" /></a>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/" className="btn-ghost">بازگشت به خانه</Link>
        </div>
      </div>
    </div>
  );
}
