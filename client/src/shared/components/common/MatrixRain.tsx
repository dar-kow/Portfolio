import { useEffect, useRef } from "react";

interface MatrixEffectProps {
  color?: string;
  bgOpacity?: number;
  immediate?: boolean;
  matrixColors?: string[];
}

const MatrixEffect: React.FC<MatrixEffectProps> = ({
  color = "#22b455",
  bgOpacity = 0.05,
  immediate = false,
  matrixColors, // opcjonalna tablica kolorów
}) => {
  const bgOpacityRef = useRef(bgOpacity);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  const getMatrixColors = () => {
    const rootStyles = getComputedStyle(document.documentElement);
    return [
      rootStyles.getPropertyValue("--matrix-dark").trim(),
      rootStyles.getPropertyValue("--matrix-primary").trim(),
      rootStyles.getPropertyValue("--matrix-light").trim(),
      rootStyles.getPropertyValue("--matrix-hover").trim(),
    ];
  };

  useEffect(() => {
    bgOpacityRef.current = bgOpacity;
  }, [bgOpacity]);

  useEffect(() => {
    const canvas = document.getElementById("matrixCanvas") as HTMLCanvasElement;
    if (!canvas) return;
    canvasRef.current = canvas;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const katakana =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const latin = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nums = "0123456789";
    const letters = katakana + latin + nums;

    let columns = Math.floor(window.innerWidth / 20);
    const drops: number[] = immediate
      ? Array(columns)
          .fill(0)
          .map(() => Math.floor((Math.random() * window.innerHeight) / 20))
      : Array(columns).fill(1);

    const setCanvasSize = () => {
      if (canvasRef.current) {
        canvasRef.current.width = window.innerWidth;
        canvasRef.current.height = window.innerHeight;
        columns = Math.floor(canvasRef.current.width / 20);
        for (let i = 0; i < columns; i++) {
          drops[i] = immediate ? Math.floor((Math.random() * canvasRef.current.height) / 20) : 1;
        }
      }
    };

    setCanvasSize();

    const draw = () => {
      if (!canvasRef.current || !ctx) return;
      ctx.fillStyle = `rgba(0, 0, 0, ${bgOpacityRef.current})`;
      ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);

      // Jeśli matrixColors został przekazany, używamy go, w przeciwnym razie getMatrixColors()
      const colors = matrixColors ?? getMatrixColors();

      drops.forEach((y, i) => {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.font = "20px monospace";
        ctx.fillText(text, i * 20, y * 20);

        if (y * 20 > canvasRef.current!.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      });
    };

    const handleResize = () => {
      setCanvasSize();
    };

    window.addEventListener("resize", handleResize);
    const intervalId = setInterval(draw, 50);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("resize", handleResize);
    };
  }, [immediate, matrixColors]);

  return (
    <canvas
      id="matrixCanvas"
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
    />
  );
};

export default MatrixEffect;
