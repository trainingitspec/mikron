export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  image: string;
}

export const products: Product[] = [
  {
    id: "cloudos",
    name: "CloudOS",
    description: "Хмарна операційна система для корпоративної інфраструктури",
    price: 12500,
    category: "Операційні системи",
    image: "/images/product-cloudos.jpg",
  },
  {
    id: "dataforge",
    name: "DataForge",
    description: "Платформа для аналізу та візуалізації великих даних",
    price: 8900,
    category: "Аналітика",
    image: "/images/product-dataforge.jpg",
  },
  {
    id: "securelink",
    name: "SecureLink",
    description: "Корпоративний VPN з нульовим рівнем довіри",
    price: 4500,
    category: "Безпека",
    image: "/images/product-securelink.jpg",
  },
  {
    id: "devpulse",
    name: "DevPulse",
    description: "Система моніторингу CI/CD процесів у реальному часі",
    price: 6200,
    category: "DevOps",
    image: "/images/product-devpulse.jpg",
  },
];
