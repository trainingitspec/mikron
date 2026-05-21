export interface BlogPost {
  id: string;
  title: string;
  date: string;
  excerpt: string;
  image: string;
  featured?: boolean;
}

export const blogPosts: BlogPost[] = [
  {
    id: "ai-cybersecurity",
    title: "Як штучний інтелект змінює корпоративну кібербезпеку в 2026 році",
    date: "15 травня 2026",
    excerpt: "Нові моделі машинного навчання дозволяють виявляти загрози за мілісекунди. AI-алгоритми нового покоління здатні передбачати кібератаки ще до їх початку, аналізуючи поведінкові патерни та мережевий трафік у реальному часі.",
    image: "/images/blog-featured-ai.jpg",
    featured: true,
  },
  {
    id: "dataforge-30",
    title: "Mikron запускає DataForge 3.0 з підтримкою реального часу",
    date: "28 квітня 2026",
    excerpt: "Наймасштабніше оновлення нашої платформи аналітики. Тепер обробка потокових даних відбувається з затримкою менше 10 мілісекунд.",
    image: "/images/blog-dataforge.jpg",
  },
  {
    id: "zero-trust",
    title: "Чому Zero Trust — це новий стандарт корпоративної безпеки",
    date: "10 квітня 2026",
    excerpt: "Традиційні периметри більше не працюють. У світі розподілених команд та хмарних сервісів модель Zero Trust стає єдиною життєздатною стратегією.",
    image: "/images/blog-zerotrust.jpg",
  },
];
