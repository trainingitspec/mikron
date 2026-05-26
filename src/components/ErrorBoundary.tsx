import { Component, type ErrorInfo, type ReactNode } from "react";

interface Props {
  children: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export default class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught error in ErrorBoundary:", error, errorInfo);
  }

  public render() {
    if (this.state.hasError) {
      return (
        <div className="min-h-screen bg-deep-black flex flex-col items-center justify-center p-6 text-center select-none">
          <div className="max-w-md w-full border border-white/10 bg-white/5 rounded-2xl p-8 backdrop-blur-md">
            <span className="text-gold uppercase tracking-[2px] font-sans text-[12px] font-semibold">
              Упс! Щось пішло не так
            </span>
            <h2 className="font-heading text-white text-2xl uppercase mt-4 mb-4">
              Помилка завантаження сторінки
            </h2>
            <p className="text-soft font-sans text-sm leading-relaxed mb-6">
              Не вдалося відобразити цей розділ через технічну помилку. Спробуйте оновити сторінку або повернутися на головну.
            </p>
            <button
              onClick={() => window.location.reload()}
              className="px-6 py-3 rounded-lg bg-gold hover:bg-gold-light text-deep-black font-sans font-semibold text-sm transition-all duration-300 transform hover:scale-[1.02]"
            >
              Оновити сторінку
            </button>
            <button
              onClick={() => (window.location.href = "/")}
              className="mt-3 block w-full text-center text-soft hover:text-white font-sans text-[13px] transition-colors duration-300"
            >
              На головну
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
