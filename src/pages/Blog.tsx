import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import fm from "front-matter";

// ─── Types ───────────────────────────────────────────────────────────────────
interface PostAttributes {
  title?: string;
  date?: string | Date; // Can be parsed as Date object by front-matter
  author?: string;
  excerpt?: string;
  featured_image?: string;
}

export interface BlogPost {
  slug: string;
  title: string;
  date: string; // Guaranteed ISO string YYYY-MM-DD
  author: string;
  excerpt: string;
  content: string;
  featuredImage?: string;
}

// ─── Load markdown files at build time ───────────────────────────────────────
const markdownModules = import.meta.glob("/content/blog/*.md", {
  query: "raw",
  eager: true,
}) as Record<string, { default: string } | string>;

// ─── Blog Page Component ─────────────────────────────────────────────────────
export default function BlogPage() {
  const [posts, setPosts] = useState<BlogPost[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const result: BlogPost[] = [];

      for (const [path, mod] of Object.entries(markdownModules)) {
        // Safe check for string/module structure
        const raw: string = typeof mod === "string" ? mod : mod?.default ?? "";

        if (!raw.trim()) continue;

        try {
          const { attributes, body } = fm<PostAttributes>(raw);
          const slug = path.split("/").pop()?.replace(/\.md$/i, "") ?? "unknown";

          // Safe Date Normalization
          let dateStr = "1970-01-01";
          if (attributes.date) {
            if (attributes.date instanceof Date) {
              dateStr = attributes.date.toISOString().split("T")[0];
            } else if (typeof attributes.date === "string") {
              const parsed = new Date(attributes.date);
              if (!isNaN(parsed.getTime())) {
                dateStr = parsed.toISOString().split("T")[0];
              }
            }
          }

          result.push({
            slug,
            title: attributes.title?.trim() || "Без назви",
            date: dateStr,
            author: attributes.author?.trim() || "Автор",
            excerpt: attributes.excerpt?.trim() || "",
            content: body,
            featuredImage: attributes.featured_image,
          });
        } catch (err) {
          console.error(`Не вдалося розпарсити файл ${path}:`, err);
        }
      }

      // Sort newest to oldest: ISO date string comparison is perfectly safe and fast
      result.sort((a, b) => b.date.localeCompare(a.date));
      setPosts(result);
    } catch (err) {
      console.error("Помилка ініціалізації блогу:", err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Safe Date Formatting helper
  const formatDate = (dateStr: string) => {
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return "Невідома дата";
    return d.toLocaleDateString("uk-UA", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

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

        {/* Loading state */}
        {isLoading && (
          <p className="text-soft font-sans text-[16px] animate-pulse">
            Завантаження публікацій...
          </p>
        )}

        {/* Empty state */}
        {!isLoading && posts.length === 0 && (
          <p className="text-soft font-sans text-[16px]">
            Публікацій поки немає. Додайте першу статтю в адмінці.
          </p>
        )}

        {/* Posts grid */}
        {!isLoading && posts.length > 0 && (
          <section className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {posts.map((post) => (
              <Link
                key={post.slug}
                to={`/blog/${post.slug}`}
                className="group cursor-pointer rounded-xl border border-white/5 bg-white/3 p-6 transition-all duration-300 hover:border-gold/30 hover:bg-white/5 flex flex-col justify-between"
              >
                <div>
                  {/* Image (if exists) */}
                  {post.featuredImage && (
                    <div className="w-full h-48 rounded-lg overflow-hidden mb-4 border border-white/5">
                      <img
                        src={post.featuredImage}
                        alt={post.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                        loading="lazy"
                      />
                    </div>
                  )}

                  {/* Date + author */}
                  <p className="text-muted-foreground font-sans text-[11px] uppercase tracking-[1.5px] mb-3">
                    {formatDate(post.date)} — {post.author}
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
                </div>

                <div className="mt-4">
                  <span className="text-gold font-sans text-[13px] uppercase tracking-[1px] group-hover:text-white transition-colors duration-300">
                    Читати далі →
                  </span>
                </div>
              </Link>
            ))}
          </section>
        )}
      </div>
    </main>
  );
}

