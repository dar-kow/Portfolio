import { useEffect, useRef } from "react";

interface MatrixEffectProps {
  color?: string;
  bgOpacity?: number;
  immediate?: boolean;
  matrixColors?: string[];
  canvasId?: string;
}

const MatrixEffect: React.FC<MatrixEffectProps> = ({
  color = "#22b455",
  bgOpacity = 0.05,
  immediate = false,
  matrixColors,
  canvasId = "matrixCanvas",
}) => {
  const bgOpacityRef = useRef(bgOpacity);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const paletteRef = useRef<string[]>([]);

  const resolvePalette = () => {
    if (matrixColors && matrixColors.length > 0) return matrixColors;
    const rootStyles = getComputedStyle(document.documentElement);
    const cssPalette = [
      rootStyles.getPropertyValue("--matrix-dark").trim(),
      rootStyles.getPropertyValue("--matrix-primary").trim(),
      rootStyles.getPropertyValue("--matrix-light").trim(),
      rootStyles.getPropertyValue("--matrix-hover").trim(),
    ].filter(Boolean);

    const palette = color ? [color, ...cssPalette] : cssPalette;
    return palette.length ? palette : ["#22b455"];
  };

  useEffect(() => {
    bgOpacityRef.current = bgOpacity;
  }, [bgOpacity]);

  useEffect(() => {
    paletteRef.current = resolvePalette();
  }, [matrixColors, color]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const katakana =
      "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const latin = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nums = "0123456789";
    const letters = katakana + latin + nums;

    const fontSize = 20;
    let columns = 0;
    let drops: number[] = [];

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      columns = Math.floor(canvas.width / fontSize);
      drops = immediate
        ? Array(columns)
            .fill(0)
            .map(() => Math.floor((Math.random() * canvas.height) / fontSize))
        : Array(columns).fill(1);
    };

    setCanvasSize();

    const draw = () => {
      ctx.fillStyle = `rgba(0, 0, 0, ${bgOpacityRef.current})`;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const colors = paletteRef.current.length ? paletteRef.current : [color];
      ctx.font = `${fontSize}px monospace`;

      drops.forEach((y, i) => {
        const text = letters.charAt(Math.floor(Math.random() * letters.length));
        ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];
        ctx.fillText(text, i * fontSize, y * fontSize);

        if (y * fontSize > canvas.height && Math.random() > 0.975) {
          drops[i] = 0;
        }
        drops[i]++;
      });
    };

    const handleResize = () => {
      setCanvasSize();
    };

    window.addEventListener("resize", handleResize);
    let lastFrame = performance.now();
    const targetMs = 50; // ~20 FPS as before
    let animationId = requestAnimationFrame(function loop(now) {
      if (now - lastFrame >= targetMs) {
        draw();
        lastFrame = now;
      }
      animationId = requestAnimationFrame(loop);
    });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [immediate, matrixColors]);

  return (
    <canvas
      id={canvasId}
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
    />
  );
};

export default MatrixEffect;
