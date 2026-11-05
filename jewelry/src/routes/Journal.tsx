import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/PageHeader";

const POSTS = [
  { title: "The Art of the Solitaire", excerpt: "How a single stone becomes a lifetime of light.", tag: "Craft", img: "/ring.jpg" },
  { title: "Choosing Your Bridal Story", excerpt: "A guide to building a set that feels entirely yours.", tag: "Bridal", img: "/bridal.jpg" },
  { title: "Caring for Fine Jewellery", excerpt: "Simple rituals to keep every piece brilliant for decades.", tag: "Care", img: "/hoops.jpg" },
  { title: "The Aurora Collection", excerpt: "Inside the inspiration behind our pavé pendants.", tag: "Collection", img: "/aurora-necklace.jpg" },
];

export function Journal() {
  return (
    <div className="pb-20">
      <PageHeader title="The Journal" crumbs={["Journal"]} />
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
                <a href="#" className="mt-4 inline-flex items-center gap-1 text-xs uppercase tracking-widest text-gold hover:underline">Read more <ArrowRight className="h-3 w-3" /></a>
              </div>
            </article>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link to="/" className="btn-ghost">Back to home</Link>
        </div>
      </div>
    </div>
  );
}
