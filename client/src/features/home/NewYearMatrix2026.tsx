import { useEffect, useRef, useCallback, memo } from "react";

interface NewYearMatrix2026Props {
  onComplete?: () => void;
}

interface DigitCell {
  char: string;
  filled: boolean;
  brightness: number;
  rowIndex: number;
  colOffset: number;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  char: string;
  color: string;
}

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  speed: number;
  color: string;
  exploded: boolean;
  particles: Particle[];
  char: string;
}

const NewYearMatrix2026: React.FC<NewYearMatrix2026Props> = ({ onComplete }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const onCompleteCalledRef = useRef(false);
  const digitCompletedRef = useRef(false);

  const getMatrixColors = useCallback(() => {
    const rootStyles = getComputedStyle(document.documentElement);
    return {
      dark: rootStyles.getPropertyValue("--matrix-dark").trim() || "#204829",
      primary: rootStyles.getPropertyValue("--matrix-primary").trim() || "#22b455",
      light: rootStyles.getPropertyValue("--matrix-light").trim() || "#80ce87",
      hover: rootStyles.getPropertyValue("--matrix-hover").trim() || "#92e5a1",
    };
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const colors = getMatrixColors();
    const fontSize = 20;
    const katakana = "アイウエオカキクケコサシスセソタチツテトナニヌネノハヒフヘホマミムメモヤユヨラリルレロワヲン";
    const latin = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    const nums = "0123456789";
    const letters = katakana + latin + nums;

    const fireworkColors = [
      "#FFD700", // gold
      "#FF6B6B", // red
      "#4ECDC4", // turquoise
      "#95E1D3", // mint
      "#F38181", // pink
      "#22b455", // matrix green
      "#80ce87", // light green
      "#FF9F43", // orange
    ];

    const getRandomChar = () => letters.charAt(Math.floor(Math.random() * letters.length));
    const getRandomColor = () => fireworkColors[Math.floor(Math.random() * fireworkColors.length)];

    // Pattern for "2026"
    const digitPatterns: Record<string, number[][]> = {
      '2': [
        [-2, -1, 0, 1, 2],
        [2],
        [2],
        [-2, -1, 0, 1, 2],
        [-2],
        [-2],
        [-2, -1, 0, 1, 2],
      ],
      '0': [
        [-1, 0, 1],
        [-2, 2],
        [-2, 2],
        [-2, 2],
        [-2, 2],
        [-2, 2],
        [-1, 0, 1],
      ],
      '6': [
        [-1, 0, 1, 2],
        [-2],
        [-2],
        [-2, -1, 0, 1],
        [-2, 2],
        [-2, 2],
        [-1, 0, 1],
      ],
    };

    // Build "2026" pattern
    const digitCells: DigitCell[] = [];
    const digitOrder = ['2', '0', '2', '6'];
    const digitWidth = 5;
    const digitSpacing = 2;
    const totalWidth = digitOrder.length * digitWidth + (digitOrder.length - 1) * digitSpacing;
    const startOffset = -Math.floor(totalWidth / 2);

    digitOrder.forEach((digit, digitIndex) => {
      const digitOffset = startOffset + digitIndex * (digitWidth + digitSpacing) + Math.floor(digitWidth / 2);
      const pattern = digitPatterns[digit];

      pattern.forEach((row, rowIndex) => {
        row.forEach((colOffset) => {
          digitCells.push({
            char: getRandomChar(),
            filled: false,
            brightness: 0,
            rowIndex,
            colOffset: colOffset + digitOffset,
          });
        });
      });
    });

    // Canvas setup
    let canvasWidth = window.innerWidth;
    let canvasHeight = window.innerHeight;

    const setCanvasSize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
      canvasWidth = canvas.width;
      canvasHeight = canvas.height;
    };
    setCanvasSize();

    const getDigitPosition = () => {
      const sidebarWidth = canvasWidth >= 768 ? 208 : 0; // w-52 = 208px
      const availableWidth = canvasWidth - sidebarWidth;
      const centerX = sidebarWidth + Math.floor(availableWidth / 2);
      const topY = Math.floor(canvasHeight * 0.15);
      return { centerX, topY };
    };

    const buildDigitMap = () => {
      const { centerX, topY } = getDigitPosition();
      const digitMap = new Map<number, Array<{ y: number; cell: DigitCell }>>();

      digitCells.forEach((cell) => {
        const x = centerX + cell.colOffset * fontSize;
        const y = topY + cell.rowIndex * fontSize;
        const colIndex = Math.floor(x / fontSize);

        if (!digitMap.has(colIndex)) {
          digitMap.set(colIndex, []);
        }
        digitMap.get(colIndex)!.push({ y, cell });
      });

      digitMap.forEach((arr) => arr.sort((a, b) => a.y - b.y));
      return digitMap;
    };

    let digitMap = buildDigitMap();

    // Matrix rain drops
    let columns = Math.floor(canvasWidth / fontSize);
    const drops: number[] = Array(columns).fill(0).map(() => Math.floor(Math.random() * -20));

    // Fireworks (rockets from falling letters)
    const rockets: Rocket[] = [];
    let lastRocketTime = 0;
    const rocketInterval = 350; // co 0.35 sekundy - dużo fajerwerków!
    let initialFireworksFired = false;

    const bgOpacity = 0.05;

    const handleResize = () => {
      setCanvasSize();
      const newColumns = Math.floor(canvasWidth / fontSize);
      if (newColumns > columns) {
        for (let i = columns; i < newColumns; i++) {
          drops.push(Math.floor(Math.random() * -10));
        }
      }
      columns = newColumns;
      drops.length = columns;
      digitMap = buildDigitMap();
    };
    window.addEventListener("resize", handleResize);

    const draw = (timestamp: number) => {
      if (!canvas || !ctx) return;

      const { centerX, topY } = getDigitPosition();

      // Clear with trail effect
      ctx.fillStyle = `rgba(0, 0, 0, ${bgOpacity})`;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      ctx.font = `${fontSize}px monospace`;
      const matrixColorArray = [colors.dark, colors.primary, colors.light, colors.hover];

      // Spawn rockets from falling letters (only after digit complete)
      if (digitCompletedRef.current) {
        const sidebarWidth = canvasWidth >= 768 ? 208 : 0; // w-52 = 208px
        const minCol = Math.floor(sidebarWidth / fontSize);
        const maxCol = columns - 1;

        // Initial burst of fireworks right after completion
        if (!initialFireworksFired) {
          initialFireworksFired = true;
          for (let i = 0; i < 5; i++) {
            const rocketCol = minCol + Math.floor(Math.random() * (maxCol - minCol));
            rockets.push({
              x: rocketCol * fontSize,
              y: canvasHeight * (0.7 + Math.random() * 0.2),
              targetY: canvasHeight * (0.08 + Math.random() * 0.2),
              speed: 12 + Math.random() * 6,
              color: getRandomColor(),
              exploded: false,
              particles: [],
              char: getRandomChar(),
            });
          }
        }

        // Continuous fireworks - spawn 1-2 at a time
        if (timestamp - lastRocketTime > rocketInterval) {
          const rocketsToSpawn = Math.random() > 0.5 ? 2 : 1;

          for (let i = 0; i < rocketsToSpawn; i++) {
            const rocketCol = minCol + Math.floor(Math.random() * (maxCol - minCol));
            const x = rocketCol * fontSize;

            rockets.push({
              x: x,
              y: canvasHeight * (0.75 + Math.random() * 0.2),
              targetY: canvasHeight * (0.05 + Math.random() * 0.25),
              speed: 10 + Math.random() * 8,
              color: getRandomColor(),
              exploded: false,
              particles: [],
              char: getRandomChar(),
            });
            // Reset this drop
            drops[rocketCol] = Math.floor(Math.random() * -15);
          }
          lastRocketTime = timestamp;
        }
      }

      // Draw and update rain drops
      drops.forEach((dropY, colIndex) => {
        const x = colIndex * fontSize;
        const y = dropY * fontSize;

        const columnCells = digitMap.get(colIndex);
        let caughtByDigit = false;

        // Check collision with digit (only before complete)
        if (!digitCompletedRef.current && columnCells) {
          for (const { y: cellY, cell } of columnCells) {
            if (!cell.filled && y >= cellY && y < cellY + fontSize) {
              cell.filled = true;
              cell.brightness = 1;
              cell.char = getRandomChar();
              caughtByDigit = true;

              const nextUnfilled = columnCells.find(c => !c.cell.filled);
              if (nextUnfilled) {
                drops[colIndex] = (nextUnfilled.y / fontSize) - 5 - Math.random() * 10;
              } else {
                drops[colIndex] = Math.floor(Math.random() * -10);
              }
              break;
            }
          }

          const firstUnfilled = columnCells.find(c => !c.cell.filled);
          if (!caughtByDigit && firstUnfilled && y < firstUnfilled.y - fontSize * 15) {
            drops[colIndex] = (firstUnfilled.y / fontSize) - 8 - Math.random() * 5;
          }
        }

        // Draw falling character
        if (!caughtByDigit && y > 0 && y < canvasHeight + fontSize) {
          const text = getRandomChar();
          const color = matrixColorArray[Math.floor(Math.random() * matrixColorArray.length)];

          ctx.globalAlpha = digitCompletedRef.current ? 0.7 : 1;
          ctx.fillStyle = color;
          ctx.fillText(text, x, y);
          ctx.globalAlpha = 1;
        }

        // Move drop
        const isDigitColumn = digitMap.has(colIndex);
        const unfilledInColumn = !digitCompletedRef.current && digitMap.get(colIndex)?.some(c => !c.cell.filled);
        drops[colIndex] += isDigitColumn && unfilledInColumn ? 2.5 : 1;

        if (y > canvasHeight && Math.random() > 0.975) {
          drops[colIndex] = Math.floor(Math.random() * -10);
        }
      });

      // Accelerate finishing (before complete)
      if (!digitCompletedRef.current) {
        const unfilledCells = digitCells.filter(c => !c.filled);
        const filledPercent = (digitCells.length - unfilledCells.length) / digitCells.length;

        if (unfilledCells.length > 0 && filledPercent >= 0.8) {
          const cellsToFill = Math.min(3, unfilledCells.length);
          for (let i = 0; i < cellsToFill; i++) {
            const cell = unfilledCells[i];
            cell.filled = true;
            cell.brightness = 1;
            cell.char = getRandomChar();
          }
        }
      }

      // Draw filled digit cells (always visible) - BRIGHT!
      digitCells.forEach((cell) => {
        if (cell.filled) {
          const cellX = centerX + cell.colOffset * fontSize;
          const cellY = topY + cell.rowIndex * fontSize;
          const pulse = 0.85 + 0.15 * Math.sin(timestamp / 300 + cellX * 0.1 + cellY * 0.1);

          ctx.save();
          ctx.fillStyle = "#FFFFFF"; // Pure white for maximum brightness
          ctx.shadowColor = colors.hover; // Brightest green for glow
          ctx.shadowBlur = 20 * pulse; // Stronger glow
          ctx.globalAlpha = Math.min(1, cell.brightness);
          ctx.fillText(cell.char, cellX, cellY);
          // Double draw for extra glow
          ctx.shadowBlur = 35 * pulse;
          ctx.shadowColor = colors.light;
          ctx.fillText(cell.char, cellX, cellY);
          ctx.restore();

          if (cell.brightness < 1) {
            cell.brightness = Math.min(1, cell.brightness + 0.1);
          }
        }
      });

      // Update and draw rockets/fireworks
      for (let i = rockets.length - 1; i >= 0; i--) {
        const rocket = rockets[i];

        if (!rocket.exploded) {
          // Draw rocket trail
          ctx.globalAlpha = 0.6;
          ctx.fillStyle = rocket.color;
          ctx.fillText(rocket.char, rocket.x, rocket.y + fontSize);
          ctx.fillText(rocket.char, rocket.x, rocket.y + fontSize * 2);

          // Draw rocket head
          ctx.globalAlpha = 1;
          ctx.fillStyle = "#FFFFFF";
          ctx.shadowColor = rocket.color;
          ctx.shadowBlur = 15;
          ctx.fillText(rocket.char, rocket.x, rocket.y);
          ctx.shadowBlur = 0;

          // Move up
          rocket.y -= rocket.speed;
          rocket.char = getRandomChar();

          // Explode at target
          if (rocket.y <= rocket.targetY) {
            rocket.exploded = true;
            const particleCount = 50 + Math.floor(Math.random() * 30);

            for (let j = 0; j < particleCount; j++) {
              const angle = (Math.PI * 2 * j) / particleCount + (Math.random() - 0.5) * 0.5;
              const speed = 2 + Math.random() * 5;

              rocket.particles.push({
                x: rocket.x,
                y: rocket.y,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1,
                char: getRandomChar(),
                color: Math.random() > 0.3 ? rocket.color : getRandomColor(),
              });
            }
          }
        } else {
          // Update and draw particles
          let allDead = true;

          for (const particle of rocket.particles) {
            if (particle.life <= 0) {
              continue;
            }
            allDead = false;

            // Physics
            particle.vy += 0.1; // gravity
            particle.x += particle.vx;
            particle.y += particle.vy;
            particle.life -= 0.018;
            particle.vx *= 0.98;

            if (Math.random() > 0.85) {
              particle.char = getRandomChar();
            }

            // Draw
            ctx.globalAlpha = Math.max(0, particle.life);
            ctx.fillStyle = particle.color;
            ctx.shadowColor = particle.color;
            ctx.shadowBlur = 8 * particle.life;
            ctx.fillText(particle.char, particle.x, particle.y);
          }

          ctx.shadowBlur = 0;

          if (allDead) {
            rockets.splice(i, 1);
          }
        }
      }

      ctx.globalAlpha = 1;

      // Check completion
      if (!digitCompletedRef.current && digitCells.every((cell) => cell.filled)) {
        digitCompletedRef.current = true;
        if (onComplete && !onCompleteCalledRef.current) {
          onCompleteCalledRef.current = true;
          setTimeout(() => onComplete(), 300);
        }
      }
    };

    let lastFrame = performance.now();
    const targetMs = 33; // ~30 FPS for smoother fireworks
    let animationId = requestAnimationFrame(function loop(now) {
      if (now - lastFrame >= targetMs) {
        draw(now);
        lastFrame = now;
      }
      animationId = requestAnimationFrame(loop);
    });

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener("resize", handleResize);
    };
  }, [getMatrixColors, onComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
      style={{ background: "#000" }}
    />
  );
};

export default memo(NewYearMatrix2026);
