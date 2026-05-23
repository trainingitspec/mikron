import { useEffect, useState } from "react";
import fm from "front-matter";

// ─── Types ───────────────────────────────────────────────────────────────────
interface PostAttributes {
  title?: string;
  date?: string;
  author?: string;
  excerpt?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string;
  author: string;
  excerpt: string;
  content: string;
}

// ─── Load markdown files at build time ───────────────────────────────────────
// Path MUST be absolute from Vite root (starts with /).
// `eager: true` means all files are bundled synchronously.
// `{ query: "raw" }` means each value is the raw file string.
const markdownModules = import.meta.glob("/content/blog/*.md", {
  query: "raw",
  eager: true,
}) as Record<string, { default: string }>;

// ─── Blog Page Component ─────────────────────────────────────────────────────
export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [empty, setEmpty] = useState(false);

  useEffect(() => {
    const result: BlogPost[] = [];

    for (const [path, mod] of Object.entries(markdownModules)) {
      // When using `query: "raw"` + `eager: true`, Vite wraps the string
      // in a module object — the actual content is in `.default`.
      const raw: string = typeof mod === "string" ? mod : mod?.default ?? "";

      if (!raw.trim()) continue;

      try {
        const { attributes, body } = fm<PostAttributes>(raw);
        const slug =
          path.split("/").pop()?.replace(/\.md$/i, "") ?? "unknown";

        result.push({
          slug,
          title: attributes.title ?? "Без назви",
          date: attributes.date ?? "1970-01-01",
          author: attributes.author ?? "Автор",
          excerpt: attributes.excerpt ?? "",
          content: body,
        });
      } catch (err) {
        console.warn(`Не вдалося розпарсити файл: ${path}`, err);
      }
    }

    // newest → oldest
    result.sort((a, b) => (a.date < b.date ? 1 : -1));
    setPosts(result);
    if (result.length === 0) setEmpty(true);
  }, []);

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <main
      className="min-h-screen bg-deep-black"
      style={{ paddingTop: "120px", paddingBottom: "80px" }}
    >
      <div className="max-w-[1200px] mx-auto px-6">
        {/* Header */}
        <span className="text-gold uppercase tracking-[1.5px] font-sans text-[11px] font-medium">
          БЛОГ
        </span>
        <h1
          className="font-heading text-white uppercase mt-2 mb-12"
          style={{
            fontSize: "clamp(32px, 4vw, 52px)",
            fontWeight: 400,
            letterSpacing: "-0.5px",
          }}
        >
          Всі публікації
        </h1>

        {/* Empty state */}
        {empty && (
          <p className="text-soft font-sans text-[16px]">
            Публікацій поки немає. Додайте першу статтю в адмінці.
          </p>
        )}

        {/* Posts grid */}
        {posts.length > 0 && (
          <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <article
                key={post.slug}
                className="group cursor-pointer rounded-xl border border-white/5 bg-white/3 p-6 transition-all duration-300 hover:border-gold/30 hover:bg-white/5"
              >
                {/* Date + author */}
                <p className="text-muted-foreground font-sans text-[11px] uppercase tracking-[1.5px] mb-3">
                  {new Date(post.date).toLocaleDateString("uk-UA", {
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                  })}{" "}
                  — {post.author}
                </p>

                {/* Title */}
                <h2
                  className="font-heading text-white group-hover:text-gold transition-colors duration-300 mb-3"
                  style={{ fontSize: "22px", fontWeight: 400, lineHeight: 1.3 }}
                >
                  {post.title}
                </h2>

                {/* Excerpt */}
                {post.excerpt && (
                  <p
                    className="text-soft font-sans line-clamp-3 mb-4"
                    style={{ fontSize: "14px", lineHeight: 1.7 }}
                  >
                    {post.excerpt}
                  </p>
                )}

                <span className="text-gold font-sans text-[13px] uppercase tracking-[1px] group-hover:text-white transition-colors duration-300">
                  Читати далі →
                </span>
              </article>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}
