import { load as parseYaml } from "js-yaml";

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image?: string;
  featured?: boolean;
}

// Static fallback products
const staticProducts: Product[] = [
  {
    id: "cloudos",
    name: "CloudOS",
    description: "Хмарна операційна система для корпоративної інфраструктури",
    price: 12500,
    category: "Операційні системи",
    image: "/images/product-cloudos.jpg",
    featured: true,
  },
  {
    id: "dataforge",
    name: "DataForge",
    description: "Платформа для аналізу та візуалізації великих даних",
    price: 8900,
    category: "Аналітика",
    featured: true,
  },
  {
    id: "securelink",
    name: "SecureLink",
    description: "Корпоративний VPN з нульовим рівнем довіри",
    price: 4500,
    category: "Безпека",
    featured: true,
  },
  {
    id: "devpulse",
    name: "DevPulse",
    description: "Система моніторингу CI/CD процесів у реальному часі",
    price: 6200,
    category: "DevOps",
    featured: false,
  },
];

interface CMSProductRaw {
  name?: string;
  price?: number;
  description?: string;
  image?: string;
  category?: string;
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
        price: typeof data.price === "number" ? data.price : 0,
        description: data.description?.trim() || "",
        image: data.image?.trim() || "",
        category: data.category?.trim() || "Інше",
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
