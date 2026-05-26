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
const productModules = import.meta.glob("/content/products/*.yml", {
  query: "raw",
  eager: true,
}) as Record<string, { default: string } | string>;

export function loadCMSProducts(): Product[] {
  const result: Product[] = [];

  for (const [path, mod] of Object.entries(productModules)) {
    const raw: string = typeof mod === "string" ? mod : mod?.default ?? "";
    if (!raw.trim()) continue;

    try {
      const data = parseYaml(raw) as CMSProductRaw;
      if (!data || typeof data !== "object") continue;

      const slug = path.split("/").pop()?.replace(/\.ya?ml$/i, "") ?? "unknown";

      result.push({
        id: slug,
        name: data.name?.trim() || "Без назви",
        name_en: data.name_en?.trim(),
        price: typeof data.price === "number" ? data.price : 0,
        description: data.description?.trim() || "",
        description_en: data.description_en?.trim(),
        image: data.image?.trim() || "",
        category: data.category?.trim() || "Інше",
        category_en: data.category_en?.trim(),
        featured: data.featured ?? false,
      });
    } catch (err) {
      console.error(`Не вдалося розпарсити продукт: ${path}`, err);
    }
  }

  if (result.length === 0) {
    return staticProducts;
  }

  // Featured first, then by name
  return result.sort((a, b) => {
    const aFeat = a.featured ? 1 : 0;
    const bFeat = b.featured ? 1 : 0;
    if (bFeat !== aFeat) return bFeat - aFeat;
    return a.name.localeCompare(b.name, "uk");
  });
}

export const products = loadCMSProducts();
