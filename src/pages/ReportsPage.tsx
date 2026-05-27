import { useEffect, useMemo } from "react";
import { load as parseYaml } from "js-yaml";
import { FileText, Download, Calendar, Shield } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { useSEO } from "@/hooks/useSEO";

export interface ReportDocument {
  doc_title: string;
  pdf_file: string;
  date?: string;
}

export interface ReportYearData {
  title: string; // The year, e.g., "2025"
  documents: ReportDocument[];
}

// ─── Load YAML files in content/reports/ dynamically at build time ──────────
const reportModules = import.meta.glob("/content/reports/*.{yml,yaml}", {
  query: "raw",
  eager: true,
}) as Record<string, { default: string } | string>;

export default function ReportsPage() {
  const { lang } = useLanguage();

  // Scroll to top when page loads
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  // Set page meta-tags via custom useSEO hook
  useSEO({
    title: lang === "en" ? "Annual Reports | Mikron" : "Річна звітність | Mikron",
    description: lang === "en"
      ? "Official annual reports, corporate audits, and public information for the Mikron ecosystem."
      : "Офіційні річні звіти, аудити безпеки та публічна інформація екосистеми Mikron.",
  });

  // Load, parse, filter, and sort YAML reports
  const sortedReports = useMemo(() => {
    const parsedData: ReportYearData[] = [];

    for (const [path, mod] of Object.entries(reportModules)) {
      const filename = path.split("/").pop() ?? "";
      
      // Filter out files that do not match the current language suffix
      const targetSuffix = `.${lang}.yaml`;
      const targetSuffixYml = `.${lang}.yml`;
      
      if (!filename.endsWith(targetSuffix) && !filename.endsWith(targetSuffixYml)) {
        continue;
      }

      const rawContent: string = typeof mod === "string" ? mod : mod?.default ?? "";
      if (!rawContent.trim()) continue;

      try {
        const data = parseYaml(rawContent) as Partial<ReportYearData>;
        if (data && typeof data === "object" && data.title && Array.isArray(data.documents)) {
          parsedData.push({
            title: data.title,
            documents: data.documents,
          });
        }
      } catch (err) {
        console.error(`Failed to parse report file ${filename}:`, err);
      }
    }

    // Sort by year descending (e.g., 2025, 2024)
    return parsedData.sort((a, b) => b.title.localeCompare(a.title));
  }, [lang]);

  return (
    <main
      className="min-h-screen bg-deep-black text-white"
      style={{ paddingTop: "120px", paddingBottom: "100px" }}
    >
      <div className="max-w-[1000px] mx-auto px-6">
        
        {/* ── Header Section ─────────────────────────────────────────────── */}
        <div className="flex flex-col gap-2 mb-12">
          <span className="text-gold uppercase tracking-[2px] font-sans text-[11px] font-semibold">
            {lang === "en" ? "Transparency & Compliance" : "Прозорість та Звітність"}
          </span>
          <h1
            className="font-heading text-white uppercase leading-tight"
            style={{
              fontSize: "clamp(32px, 4vw, 52px)",
              fontWeight: 400,
              letterSpacing: "-0.5px",
            }}
          >
            {lang === "en" ? "Annual Reports" : "Річна звітність"}
          </h1>
          <p className="text-soft font-sans text-sm max-w-xl mt-2 leading-relaxed">
            {lang === "en"
              ? "Access public financial reviews, compliance documents, and operational reports of Mikron. Transparent reporting updated by our managers."
              : "Ознайомтеся з офіційними фінансовими звітами, результатами аудитів та іншими матеріалами проекту Mikron. Актуальні дані завантажуються контент-менеджерами."}
          </p>
          <div className="h-px w-full bg-gradient-to-r from-gold/40 via-gold/10 to-transparent mt-6" />
        </div>

        {/* ── Reports Grid (Sorted by Year) ────────────────────────────────── */}
        {sortedReports.length === 0 ? (
          <div className="text-center py-20 border border-white/5 bg-white/3 rounded-2xl">
            <Shield className="mx-auto text-gold opacity-50 mb-4" size={32} />
            <h3 className="font-heading text-lg uppercase mb-1">
              {lang === "en" ? "No reports found" : "Звітів не знайдено"}
            </h3>
            <p className="text-soft font-sans text-sm">
              {lang === "en"
                ? "Reports are being uploaded. Check back soon."
                : "Звіти завантажуються в систему. Будь ласка, завітайте пізніше."}
            </p>
          </div>
        ) : (
          <div className="space-y-12">
            {sortedReports.map((yearBlock) => (
              <section
                key={yearBlock.title}
                className="bg-[#0c0c0e] border border-white/5 rounded-2xl p-6 md:p-8 hover:border-gold/25 transition-all duration-300 relative overflow-hidden"
              >
                {/* Year Accent Banner */}
                <div className="absolute top-0 right-0 w-32 h-32 bg-gold/5 blur-[40px] pointer-events-none rounded-full" />

                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-6 pb-4 border-b border-white/5">
                  <div className="flex items-center gap-3">
                    <span className="w-2.5 h-2.5 rounded-full bg-gold shadow-[0_0_8px_#ffc447]" />
                    <h2 className="font-heading text-white uppercase text-2xl tracking-[0.5px]">
                      {lang === "en" ? `${yearBlock.title} Fiscal Year` : `${yearBlock.title} Рік`}
                    </h2>
                  </div>
                  <span className="text-soft font-sans text-xs uppercase tracking-[1px] bg-white/5 border border-white/10 px-3 py-1 rounded-full">
                    {yearBlock.documents.length}{" "}
                    {lang === "en"
                      ? (yearBlock.documents.length === 1 ? "document" : "documents")
                      : (yearBlock.documents.length === 1 ? "документ" : "документи")}
                  </span>
                </div>

                {/* Documents Table List */}
                <div className="divide-y divide-white/5">
                  {yearBlock.documents.map((doc, idx) => (
                    <div
                      key={idx}
                      className="group flex flex-col sm:flex-row sm:items-center justify-between py-4 first:pt-0 last:pb-0 gap-4"
                    >
                      <div className="flex items-start gap-3">
                        <FileText
                          className="text-gold shrink-0 mt-0.5 group-hover:scale-110 transition-transform duration-200"
                          size={18}
                        />
                        <div className="flex flex-col gap-1">
                          <span className="text-[15px] font-sans font-medium text-white group-hover:text-gold transition-colors duration-200">
                            {doc.doc_title}
                          </span>
                          
                          {/* Optional Date display */}
                          {doc.date && (
                            <span className="flex items-center gap-1 text-[11px] text-soft font-sans">
                              <Calendar size={11} className="opacity-70" />
                              {new Date(doc.date).toLocaleDateString(
                                lang === "en" ? "en-US" : "uk-UA",
                                { year: "numeric", month: "short", day: "numeric" }
                              )}
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Download Link */}
                      <a
                        href={doc.pdf_file}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center justify-center gap-2 h-9 px-4 rounded-lg bg-white/5 border border-white/10 text-soft group-hover:bg-gold group-hover:border-gold group-hover:text-deep-black font-sans text-xs font-semibold tracking-[0.5px] transition-all duration-300 shrink-0 self-start sm:self-center"
                      >
                        <Download size={13} />
                        {lang === "en" ? "Download PDF" : "Завантажити PDF"}
                      </a>
                    </div>
                  ))}
                </div>
              </section>
            ))}
          </div>
        )}
      </div>
    </main>
  );
}
