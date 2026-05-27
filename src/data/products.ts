import { load as parseYaml } from "js-yaml";

export interface Product {
  id: string;
  name: string;
  name_en?: string;
  description: string;
  description_en?: string;
  price: number;
  category: string;
  category_en?: string;
  image?: string;
  featured?: boolean;
}

// Static fallback products
const staticProducts: Product[] = [
  {
    id: "cloudos",
    name: "CloudOS",
    name_en: "CloudOS",
    description: "Хмарна операційна система для корпоративної інфраструктури",
    description_en: "Cloud operating system designed for enterprise infrastructure",
    price: 12500,
    category: "Операційні системи",
    category_en: "Operating Systems",
    image: "/images/product-cloudos.jpg",
    featured: true,
  },
  {
    id: "dataforge",
    name: "DataForge",
    name_en: "DataForge",
    description: "Платформа для аналізу та візуалізації великих даних",
    description_en: "Big data analytics and visualization platform",
    price: 8900,
    category: "Аналітика",
    category_en: "Analytics",
    featured: true,
  },
  {
    id: "securelink",
    name: "SecureLink",
    name_en: "SecureLink",
    description: "Корпоративний VPN з нульовим рівнем довіри",
    description_en: "Enterprise Zero Trust VPN solution",
    price: 4500,
    category: "Безпека",
    category_en: "Security",
    featured: true,
  },
  {
    id: "devpulse",
    name: "DevPulse",
    name_en: "DevPulse",
    description: "Система моніторингу CI/CD процесів у реальному часі",
    description_en: "Real-time CI/CD process monitoring system",
    price: 6200,
    category: "DevOps",
    category_en: "DevOps",
    featured: false,
  },
];

interface CMSProductRaw {
  name?: string;
  name_en?: string;
  price?: number;
  description?: string;
  description_en?: string;
  image?: string;
  category?: string;
  category_en?: string;
  featured?: boolean;
}

// Load YAML product files at build time
const productModules = import.meta.glob("/content/products/*.{yml,yaml}", {
  query: "raw",
  eager: true,
}) as Record<string, { default: string } | string>;

interface ProductGroup {
  ua?: string;
  en?: string;
  fallback?: string;
}

export function loadCMSProducts(lang: "ua" | "en" = "ua"): Product[] {
  const groups: Record<string, ProductGroup> = {};

  for (const [path, mod] of Object.entries(productModules)) {
    const raw: string = typeof mod === "string" ? mod : mod?.default ?? "";
    if (!raw.trim()) continue;

    const filename = path.split("/").pop() ?? "";
    let baseSlug = "";
    let fileLang: "ua" | "en" | "fallback" = "fallback";

    if (filename.endsWith(".ua.yaml") || filename.endsWith(".ua.yml")) {
      baseSlug = filename.replace(/\.ua\.(yaml|yml)$/i, "");
      fileLang = "ua";
    } else if (filename.endsWith(".en.yaml") || filename.endsWith(".en.yml")) {
      baseSlug = filename.replace(/\.en\.(yaml|yml)$/i, "");
      fileLang = "en";
    } else if (filename.endsWith(".yaml") || filename.endsWith(".yml")) {
      baseSlug = filename.replace(/\.(yaml|yml)$/i, "");
      fileLang = "fallback";
    } else {
      continue;
    }

    if (!groups[baseSlug]) {
      groups[baseSlug] = {};
    }
    groups[baseSlug][fileLang] = raw;
  }

  const result: Product[] = [];

  for (const [slug, files] of Object.entries(groups)) {
    let rawContent = "";
    if (lang === "en") {
      rawContent = files.en || files.fallback || files.ua || "";
    } else {
      rawContent = files.ua || files.fallback || files.en || "";
    }

    if (!rawContent) continue;

    try {
      const data = parseYaml(rawContent) as CMSProductRaw;
      if (!data || typeof data !== "object") continue;

      result.push({
        id: slug,
        name: data.name?.trim() || "Без назви",
        price: typeof data.price === "number" ? data.price : 0,
        description: data.description?.trim() || "",
        image: data.image?.trim() || "",
        category: data.category?.trim() || "Інше",
        featured: data.featured ?? false,
        name_en: data.name_en?.trim() || data.name?.trim(),
        description_en: data.description_en?.trim() || data.description?.trim(),
        category_en: data.category_en?.trim() || data.category?.trim(),
      });
    } catch (err) {
      console.error(`Failed to parse product with slug ${slug}:`, err);
    }
  }

  if (result.length === 0) {
    return staticProducts.map(p => ({
      ...p,
      name: lang === "en" ? (p.name_en || p.name) : p.name,
      description: lang === "en" ? (p.description_en || p.description) : p.description,
      category: lang === "en" ? (p.category_en || p.category) : p.category,
    }));
  }

  // Featured first, then by name
  return result.sort((a, b) => {
    const aFeat = a.featured ? 1 : 0;
    const bFeat = b.featured ? 1 : 0;
    if (bFeat !== aFeat) return bFeat - aFeat;
    return a.name.localeCompare(b.name, lang === "en" ? "en" : "uk");
  });
}

export const products = loadCMSProducts("ua");
