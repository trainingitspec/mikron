import { useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import fm from "front-matter";
import ReactMarkdown from "react-markdown";
import { ArrowLeft, Calendar, User } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useSEO, type SEOSettings } from "@/hooks/useSEO";

interface PostAttributes {
  title?: string;
  date?: string | Date;
  author?: string;
  excerpt?: string;
  featured_image?: string;
  seo_settings?: SEOSettings;
}

// ─── Load markdown files at build time ───────────────────────────────────────
const markdownModules = import.meta.glob("/content/blog/*.md", {
  query: "raw",
  eager: true,
}) as Record<string, { default: string } | string>;

export default function BlogPost() {
  const { lang, t } = useLanguage();
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();

  // Scroll to top when post loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  // Find the matching markdown file
  const matchedEntry = Object.entries(markdownModules).find(([path]) => {
    const filename = path.split("/").pop() ?? "";
    return filename === `${slug}.${lang}.md`;
  }) || Object.entries(markdownModules).find(([path]) => {
    const filename = path.split("/").pop() ?? "";
    if (filename === `${slug}.md`) return true;
    if (lang === "en" && filename === `${slug}.ua.md`) return true;
    if (lang === "ua" && filename === `${slug}.en.md`) return true;
    return false;
  });

  // Extract raw content unconditionally
  const raw: string = matchedEntry
    ? (typeof matchedEntry[1] === "string" ? matchedEntry[1] : matchedEntry[1]?.default ?? "")
    : "";

  let title = lang === "en" ? "Untitled" : "Без назви";
  let dateStr = "";
  let author = lang === "en" ? "Author" : "Автор";
  let featuredImage = "";
  let bodyContent = "";
  let excerpt = "";
  let seoSettings: SEOSettings | undefined = undefined;

  if (matchedEntry) {
    try {
      const { attributes, body } = fm<PostAttributes>(raw);
      title = attributes.title?.trim() || (lang === "en" ? "Untitled" : "Без назви");
      author = attributes.author?.trim() || (lang === "en" ? "Author" : "Автор");
      featuredImage = attributes.featured_image || "";
      bodyContent = body;
      excerpt = attributes.excerpt || "";
      seoSettings = attributes.seo_settings;

      // Parse date
      if (attributes.date) {
        const d = attributes.date instanceof Date ? attributes.date : new Date(attributes.date);
        if (!isNaN(d.getTime())) {
          dateStr = d.toLocaleDateString(lang === "en" ? "en-US" : "uk-UA", {
            year: "numeric",
            month: "long",
            day: "numeric",
          });
        }
      }
    } catch (err) {
      console.error("Помилка парсингу статті:", err);
    }
  }

  // Hook call to dynamically inject SEO tags into document head (unconditional)
  useSEO({
    title: matchedEntry ? title : (lang === "en" ? "Post Not Found" : "Статтю не знайдено"),
    description: excerpt,
    image: featuredImage,
    seoSettings,
  });

  if (!matchedEntry) {
    return (
      <main className="min-h-screen bg-deep-black flex flex-col items-center justify-center text-center px-6">
        <h1 className="font-heading text-white text-3xl uppercase mb-4">
          {t("blog.post.not_found")}
        </h1>
        <p className="text-soft font-sans mb-8">
          {t("blog.post.not_found_desc")}
        </p>
        <Link
          to="/blog"
          className="inline-flex items-center gap-2 px-6 py-2.5 rounded-lg border border-gold/30 text-gold hover:bg-gold/10 font-sans text-sm uppercase tracking-[1px] transition-all duration-300"
        >
          <ArrowLeft size={16} />
          {t("blog.post.back")}
        </Link>
      </main>
    );
  }

  return (
    <main
      className="min-h-screen bg-deep-black text-white"
      style={{ paddingTop: "120px", paddingBottom: "100px" }}
    >
      <div className="max-w-[800px] mx-auto px-6">
        {/* Back Link */}
        <button
          onClick={() => navigate("/blog")}
          className="inline-flex items-center gap-2 text-soft hover:text-gold font-sans text-[12px] uppercase tracking-[1.5px] mb-8 transition-colors duration-200"
        >
          <ArrowLeft size={14} />
          {t("blog.post.back")}
        </button>

        {/* Article Meta */}
        <div className="flex flex-wrap items-center gap-6 text-soft font-sans text-[13px] mb-6">
          {dateStr && (
            <span className="flex items-center gap-1.5">
              <Calendar size={14} className="text-gold" />
              {dateStr}
            </span>
          )}
          <span className="flex items-center gap-1.5">
            <User size={14} className="text-gold" />
            {t("blog.post.author")}: {author}
          </span>
        </div>

        {/* Title */}
        <h1
          className="font-heading text-white uppercase mb-8 leading-tight"
          style={{
            fontSize: "clamp(28px, 4.5vw, 48px)",
            fontWeight: 400,
            letterSpacing: "-0.5px",
          }}
        >
          {title}
        </h1>

        {/* Featured Image */}
        {featuredImage && (
          <div className="w-full aspect-[16/9] rounded-2xl overflow-hidden mb-10 border border-white/5 shadow-deep">
            <img
              src={featuredImage}
              alt={title}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        {/* Article Body */}
        <article className="prose prose-invert max-w-none font-sans leading-relaxed text-[16px] text-soft space-y-6">
          <ReactMarkdown
            components={{
              h2: ({ ...props }) => (
                <h2
                  className="font-heading text-white uppercase text-xl mt-10 mb-4 border-b border-white/5 pb-2"
                  {...props}
                />
              ),
              h3: ({ ...props }) => (
                <h3 className="font-heading text-white uppercase text-lg mt-8 mb-3" {...props} />
              ),
              p: ({ ...props }) => <p className="mb-6 leading-relaxed" {...props} />,
              ul: ({ ...props }) => <ul className="list-disc list-inside space-y-2 mb-6 text-soft pl-4" {...props} />,
              ol: ({ ...props }) => <ol className="list-decimal list-inside space-y-2 mb-6 text-soft pl-4" {...props} />,
              li: ({ ...props }) => <li className="marker:text-gold" {...props} />,
              a: ({ ...props }) => (
                <a
                  className="text-gold hover:text-white underline transition-colors duration-200"
                  {...props}
                />
              ),
              blockquote: ({ ...props }) => (
                <blockquote
                  className="border-l-2 border-gold pl-4 italic my-6 text-white/80 bg-white/3 py-2 pr-2 rounded-r-lg"
                  {...props}
                />
              ),
              code: ({ ...props }) => (
                <code className="bg-white/5 px-1.5 py-0.5 rounded font-mono text-[14px]" {...props} />
              ),
            }}
          >
            {bodyContent}
          </ReactMarkdown>
        </article>
      </div>
    </main>
  );
}
