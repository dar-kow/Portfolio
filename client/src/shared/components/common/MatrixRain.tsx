import { useEffect, useRef, useState, useCallback } from "react";

interface MatrixEffectProps {
  color?: string;
  bgOpacity?: number;
  immediate?: boolean;
  matrixColors?: string[];
  intensity?: "low" | "medium" | "high";
  isMobile?: boolean;
}

// Funkcja do throttlingu wywołań funkcji
const throttle = (callback: Function, delay: number) => {
  let lastCall = 0;
  return (...args: any[]) => {
    const now = Date.now();
    if (now - lastCall >= delay) {
      lastCall = now;
      callback(...args);
    }
  };
};

const MatrixEffect: React.FC<MatrixEffectProps> = ({
  color = "#22b455",
  bgOpacity = 0.05,
  immediate = false,
  matrixColors,
  intensity = "medium",
  isMobile = false,
}) => {
  const bgOpacityRef = useRef(bgOpacity);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const animationFrameRef = useRef<number>(0);
  const [isInitialized, setIsInitialized] = useState(false);

  // Mapowanie intensywności na parametry efektu
  const intensitySettings = {
    low: { density: 0.5, speed: 0.7, opacity: 0.03 },
    medium: { density: 1, speed: 1, opacity: bgOpacity },
    high: { density: 1.5, speed: 1.3, opacity: bgOpacity * 1.2 }
  };

  const settings = intensitySettings[intensity];
  const actualBgOpacity = isMobile ? settings.opacity * 0.7 : settings.opacity;

  // Pobieranie kolorów z CSS
  const getMatrixColors = useCallback(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    return [
      rootStyles.getPropertyValue("--matrix-dark").trim(),
      rootStyles.getPropertyValue("--matrix-primary").trim(),
      rootStyles.getPropertyValue("--matrix-light").trim(),
      rootStyles.getPropertyValue("--matrix-hover").trim(),
    ];
  }, []);

  useEffect(() => {
    bgOpacityRef.current = actualBgOpacity;
  }, [actualBgOpacity]);

  useEffect(() => {
    // Inicjalizacja canvas
    const canvas = document.getElementById("matrixCanvas") as HTMLCanvasElement;
    if (!canvas) return;

    canvasRef.current = canvas;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Optymalizacja dla różnych gęstości pikseli
    const dpr = window.devicePixelRatio || 1;
    canvas.width = window.innerWidth * dpr;
    canvas.height = window.innerHeight * dpr;
    ctx.scale(dpr, dpr);
    canvas.style.width = `${window.innerWidth}px`;
    canvas.style.height = `${window.innerHeight}px`;

    const katakana = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const latin = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nums = "0123456789";
    const letters = katakana + latin + nums;

    const fontSize = 20;
    const columns = Math.floor(window.innerWidth / fontSize);

    // Dynamiczne obliczenie ilości kropek dla różnych rozdzielczości
    const drops: number[] = immediate
      ? Array(columns).fill(0).map(() => Math.floor((Math.random() * window.innerHeight) / fontSize))
      : Array(columns).fill(1);

    // Zoptymalizowana funkcja rysowania
    const draw = () => {
      if (!canvasRef.current || !ctx) return;

      ctx.fillStyle = `rgba(0, 0, 0, ${bgOpacityRef.current})`;
      ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);

      const colors = matrixColors ?? getMatrixColors();

      // Skalowanie liczby kropek na podstawie intensywności
      const activeColumns = Math.floor(columns * settings.density);

      for (let i = 0; i < activeColumns; i++) {
        if (i >= drops.length) continue;

        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.font = `${fontSize}px monospace`;
        ctx.fillText(text, i * fontSize, drops[i] * fontSize);

        // Zwiększenie szybkości spadania znaków w zależności od intensywności
        if (drops[i] * fontSize > canvas.height / dpr && Math.random() > 0.975 / settings.speed) {
          drops[i] = 0;
        }
        drops[i] += settings.speed;
      }

      // Użycie requestAnimationFrame zamiast setInterval dla płynniejszej animacji
      animationFrameRef.current = requestAnimationFrame(draw);
    };

    // Throttlowana funkcja do obsługi zmiany rozmiaru okna
    const handleResize = throttle(() => {
      if (!canvasRef.current || !ctx) return;

      // Zapisz aktualny stan
      const tempImageData = ctx.getImageData(0, 0, canvas.width / dpr, canvas.height / dpr);

      // Aktualizuj wymiary
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;

      // Przywróć skalowanie
      ctx.scale(dpr, dpr);

      // Przywróć stan, jeśli to możliwe
      try {
        ctx.putImageData(tempImageData, 0, 0);
      } catch (e) {
        // W przypadku błędu (np. nowe wymiary są mniejsze) po prostu kontynuuj
      }

      // Zaktualizuj liczbę kolumn
      const newColumns = Math.floor(window.innerWidth / fontSize);

      // Dostosuj tablicę drops, zachowując istniejące wartości
      if (newColumns > drops.length) {
        const additionalDrops = Array(newColumns - drops.length).fill(0)
          .map(() => immediate ? Math.floor((Math.random() * window.innerHeight) / fontSize) : 1);
        drops.push(...additionalDrops);
      } else if (newColumns < drops.length) {
        drops.length = newColumns;
      }
    }, 200); // throttle co 200ms

    window.addEventListener("resize", handleResize);

    // Rozpocznij animację
    animationFrameRef.current = requestAnimationFrame(draw);
    setIsInitialized(true);

    // Cleanup
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
      window.removeEventListener("resize", handleResize);
    };
  }, [immediate, matrixColors, getMatrixColors, settings]); // Zależności effectu

  return (
    <canvas
      id="matrixCanvas"
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
      style={{ opacity: isInitialized ? 1 : 0, transition: "opacity 0.5s ease-in" }}
    />
  );
};

// Hook do wykrywania urządzeń mobilnych
export const useIsMobile = () => {
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const checkDevice = () => {
      setIsMobile(window.innerWidth < 768);
    };

    // Sprawdź na starcie
    checkDevice();

    // Nasłuchuj zmian rozmiaru okna
    window.addEventListener('resize', checkDevice);

    return () => {
      window.removeEventListener('resize', checkDevice);
    };
  }, []);

  return isMobile;
};

export default MatrixEffect;