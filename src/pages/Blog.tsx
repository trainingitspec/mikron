import { useMemo } from "react";
import fm from "front-matter";

// -----------------------------------------------------------------
// Types
// -----------------------------------------------------------------
type BlogPost = {
  /** URL‑friendly slug, e.g. "2026-05-22‑my‑title" */
  slug: string;
  /** Human‑readable title */
  title: string;
  /** ISO date string (YYYY‑MM‑DD) */
  date: string;
  /** Author name */
  author: string;
  /** Short description shown on the card */
  excerpt: string;
  /** Full markdown content – you may render it later with a markdown lib */
  content: string;
};

// -----------------------------------------------------------------
// Load all markdown files at build time
// -----------------------------------------------------------------
// Vite’s glob returns an object where the key is the absolute path
// and the value is the raw file contents (because of `query: "raw"` & `eager: true`).
const markdownModules = import.meta.glob("/content/blog/*.md", {
  query: "raw",
  eager: true,
}) as Record<string, string>;

// -----------------------------------------------------------------
// Helper – transform raw files into typed BlogPost objects
// -----------------------------------------------------------------
function parsePosts(): BlogPost[] {
  return Object.entries(markdownModules).map(([path, raw]) => {
    // `front-matter` returns { attributes, body }
    const { attributes, body } = fm<any>(raw);

    // Derive a slug from the filename (everything after the last `/`)
    const slug = path.split("/").pop()?.replace(/\.md$/i, "") ?? "unknown";

    return {
      slug,
      title: attributes.title ?? "Untitled",
      date: attributes.date ?? "1970-01-01",
      author: attributes.author ?? "Anonymous",
      excerpt: attributes.excerpt ?? "",
      content: body,
    };
  });
}

// -----------------------------------------------------------------
// Component
// -----------------------------------------------------------------
export default function Blog() {
  // `useMemo` guarantees parsing only once (at mount)
  const posts = useMemo(() => {
    const parsed = parsePosts();

    // Sort newest → oldest by ISO date string (lexicographic works)
    return parsed.sort((a, b) => (a.date < b.date ? 1 : -1));
  }, []);

  return (
    <main className="mx-auto max-w-5xl p-6">
      <h1 className="mb-8 text-4xl font-bold text-gray-800">📰 Blog</h1>

      <section className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((post) => (
          <article
            key={post.slug}
            className="rounded-xl bg-white/90 shadow-lg backdrop-blur-sm transition-transform hover:scale-[1.02] hover:shadow-xl"
          >
            <div className="p-5">
              <h2 className="mb-2 text-2xl font-semibold text-gray-900">
                {post.title}
              </h2>

              <p className="mb-3 text-sm text-gray-500">
                {new Date(post.date).toLocaleDateString(undefined, {
                  year: "numeric",
                  month: "short",
                  day: "numeric",
                })}{" "}— {post.author}
              </p>

              <p className="mb-4 line-clamp-3 text-gray-700">{post.excerpt}</p>

              {/* Link to the full article – you can create a dynamic route later */}
              <a
                href={`/blog/${post.slug}`}
                className="inline-block rounded bg-indigo-600 px-3 py-1.5 text-sm font-medium text-white transition-colors hover:bg-indigo-700"
              >
                Read more→
              </a>
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}
