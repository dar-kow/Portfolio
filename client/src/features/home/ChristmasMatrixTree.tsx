import { useEffect, useRef, useCallback, memo } from "react";

interface ChristmasMatrixTreeProps {
  onTreeComplete?: () => void;
}

interface TreeCell {
  char: string;
  filled: boolean;
  brightness: number;
  rowIndex: number;
  colOffset: number;
}

const ChristmasMatrixTree: React.FC<ChristmasMatrixTreeProps> = ({
  onTreeComplete,
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const onCompleteCalledRef = useRef(false);
  const treeCompletedRef = useRef(false);

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

    // Tree pattern
    const treePattern = [
      [0], // Star (row 0)
      [0],
      [-1, 0, 1],
      [-2, -1, 0, 1, 2],
      [-3, -2, -1, 0, 1, 2, 3],
      [-4, -3, -2, -1, 0, 1, 2, 3, 4],
      [-2, -1, 0, 1, 2],
      [-3, -2, -1, 0, 1, 2, 3],
      [-4, -3, -2, -1, 0, 1, 2, 3, 4],
      [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5],
      [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6],
      [-3, -2, -1, 0, 1, 2, 3],
      [-4, -3, -2, -1, 0, 1, 2, 3, 4],
      [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5],
      [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6],
      [-7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7],
      [-8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8],
      [-4, -3, -2, -1, 0, 1, 2, 3, 4],
      [-5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5],
      [-6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6],
      [-7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7],
      [-8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8],
      [-9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9],
      [-10, -9, -8, -7, -6, -5, -4, -3, -2, -1, 0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10],
      [-1, 0, 1], // Trunk
      [-1, 0, 1],
      [-1, 0, 1],
    ];

    // Create tree cells
    const treeCells: TreeCell[] = [];
    treePattern.forEach((row, rowIndex) => {
      row.forEach((colOffset) => {
        treeCells.push({
          char: rowIndex === 0 ? "★" : letters.charAt(Math.floor(Math.random() * letters.length)),
          filled: false,
          brightness: 0,
          rowIndex,
          colOffset,
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

    // Helper to get tree position
    const getTreePosition = () => {
      const sidebarWidth = canvasWidth >= 768 ? 288 : 0;
      const availableWidth = canvasWidth - sidebarWidth;
      const treeCenterX = sidebarWidth + Math.floor(availableWidth / 2);
      const treeTopY = Math.floor(canvasHeight * 0.06);
      return { treeCenterX, treeTopY };
    };

    // Build a map of tree cell positions for collision detection
    // Key: "colIndex" -> array of {rowY, cell} sorted by Y
    const buildTreeMap = () => {
      const { treeCenterX, treeTopY } = getTreePosition();
      const treeMap = new Map<number, Array<{ y: number; cell: TreeCell }>>();

      treeCells.forEach((cell) => {
        if (cell.rowIndex === 0) return; // Skip star for now
        const x = treeCenterX + cell.colOffset * fontSize;
        const y = treeTopY + cell.rowIndex * fontSize;
        const colIndex = Math.floor(x / fontSize);

        if (!treeMap.has(colIndex)) {
          treeMap.set(colIndex, []);
        }
        treeMap.get(colIndex)!.push({ y, cell });
      });

      // Sort each column by Y (top to bottom)
      treeMap.forEach((arr) => arr.sort((a, b) => a.y - b.y));

      return treeMap;
    };

    let treeMap = buildTreeMap();

    // Matrix rain drops
    let columns = Math.floor(canvasWidth / fontSize);
    const drops: number[] = Array(columns).fill(0).map(() => Math.floor(Math.random() * -20)); // Start above screen

    let bgOpacity = 0.05;
    const targetBgOpacity = 0.075;
    let starAdded = false;
    let treeBodyComplete = false;

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
      treeMap = buildTreeMap(); // Rebuild map on resize
    };
    window.addEventListener("resize", handleResize);

    const draw = (timestamp: number) => {
      if (!canvas || !ctx) return;

      const { treeCenterX, treeTopY } = getTreePosition();

      // Darken background after tree completes
      if (treeCompletedRef.current && bgOpacity < targetBgOpacity) {
        bgOpacity = Math.min(targetBgOpacity, bgOpacity + 0.0003);
      }

      // Semi-transparent overlay
      ctx.fillStyle = `rgba(0, 0, 0, ${bgOpacity})`;
      ctx.fillRect(0, 0, canvasWidth, canvasHeight);

      ctx.font = `${fontSize}px monospace`;
      const matrixColorArray = [colors.dark, colors.primary, colors.light, colors.hover];

      // Draw and update rain drops
      drops.forEach((dropY, colIndex) => {
        const x = colIndex * fontSize;
        const y = dropY * fontSize;

        // Check if this drop hits an unfilled tree cell
        const columnCells = treeMap.get(colIndex);
        let caughtByTree = false;

        if (columnCells) {
          // Find first unfilled cell in this column
          const firstUnfilled = columnCells.find(c => !c.cell.filled);

          for (const { y: cellY, cell } of columnCells) {
            if (!cell.filled && y >= cellY && y < cellY + fontSize) {
              // Catch this drop!
              cell.filled = true;
              cell.brightness = 1;
              cell.char = letters.charAt(Math.floor(Math.random() * letters.length));
              caughtByTree = true;

              // Smart reset: start just above next unfilled cell (much faster!)
              const nextUnfilled = columnCells.find(c => !c.cell.filled);
              if (nextUnfilled) {
                // Start a bit above the next target
                drops[colIndex] = (nextUnfilled.y / fontSize) - 5 - Math.random() * 10;
              } else {
                // Column complete, reset normally
                drops[colIndex] = Math.floor(Math.random() * -10);
              }
              break;
            }
          }

          // If drop is way above first unfilled, jump closer (speed boost)
          if (!caughtByTree && firstUnfilled && y < firstUnfilled.y - fontSize * 15) {
            drops[colIndex] = (firstUnfilled.y / fontSize) - 8 - Math.random() * 5;
          }
        }

        // Draw falling character if not caught
        if (!caughtByTree && y > 0) {
          const text = letters.charAt(Math.floor(Math.random() * letters.length));
          const color = matrixColorArray[Math.floor(Math.random() * matrixColorArray.length)];

          if (treeCompletedRef.current) {
            ctx.globalAlpha = 0.5;
            ctx.fillStyle = colors.primary;
          } else {
            ctx.globalAlpha = 1;
            ctx.fillStyle = color;
          }

          ctx.fillText(text, x, y);
          ctx.globalAlpha = 1;
        }

        // Move drop down (much faster for tree columns to fill quicker)
        const isTreeColumn = treeMap.has(colIndex);
        drops[colIndex] += isTreeColumn && !treeBodyComplete ? 2.5 : 1;

        // Reset when off screen
        if (y > canvasHeight && Math.random() > 0.975) {
          drops[colIndex] = Math.floor(Math.random() * -10);
        }
      });

      // Check remaining unfilled cells (excluding star)
      const bodyCells = treeCells.filter(c => c.rowIndex !== 0);
      const unfilledCells = bodyCells.filter(c => !c.filled);
      const filledPercent = (bodyCells.length - unfilledCells.length) / bodyCells.length;

      // When ~80% filled, start filling remaining cells directly (no more waiting!)
      if (unfilledCells.length > 0 && filledPercent >= 0.8) {
        // Fill 2-3 cells per frame to finish quickly but still look natural
        const cellsToFill = Math.min(3, unfilledCells.length);
        for (let i = 0; i < cellsToFill; i++) {
          const cell = unfilledCells[i];
          cell.filled = true;
          cell.brightness = 1;
          cell.char = letters.charAt(Math.floor(Math.random() * letters.length));
        }
      }

      // Check if tree body is complete (all except star)
      const bodyComplete = unfilledCells.length === 0;
      if (bodyComplete && !treeBodyComplete) {
        treeBodyComplete = true;
      }

      // Add star after body is complete
      if (treeBodyComplete && !starAdded) {
        setTimeout(() => {
          const starCell = treeCells.find(c => c.rowIndex === 0);
          if (starCell) {
            starCell.filled = true;
            starCell.brightness = 1;
          }
        }, 400);
        starAdded = true;
      }

      // Draw filled tree cells
      treeCells.forEach((cell) => {
        if (cell.filled) {
          const cellX = treeCenterX + cell.colOffset * fontSize;
          const cellY = treeTopY + cell.rowIndex * fontSize;
          const pulse = 0.8 + 0.2 * Math.sin(timestamp / 400 + cellX * 0.1 + cellY * 0.1);
          const isStar = cell.char === "★";

          ctx.save();

          if (isStar) {
            ctx.fillStyle = "#FFD700";
            ctx.shadowColor = "#FFD700";
            ctx.shadowBlur = 20 * pulse;
          } else {
            ctx.fillStyle = colors.light;
            ctx.shadowColor = colors.primary;
            ctx.shadowBlur = 10 * pulse;
          }

          ctx.globalAlpha = Math.min(1, cell.brightness);
          ctx.fillText(cell.char, cellX, cellY);
          ctx.restore();

          if (cell.brightness < 1) {
            cell.brightness = Math.min(1, cell.brightness + 0.1);
          }
        }
      });

      // Check if fully complete
      if (!treeCompletedRef.current && treeCells.every((cell) => cell.filled)) {
        treeCompletedRef.current = true;
        if (onTreeComplete && !onCompleteCalledRef.current) {
          onCompleteCalledRef.current = true;
          setTimeout(() => onTreeComplete(), 300);
        }
      }
    };

    const intervalId = setInterval(() => {
      requestAnimationFrame(draw);
    }, 50);

    return () => {
      clearInterval(intervalId);
      window.removeEventListener("resize", handleResize);
    };
  }, [getMatrixColors, onTreeComplete]);

  return (
    <canvas
      ref={canvasRef}
      className="fixed top-0 left-0 w-full h-full z-0 pointer-events-none"
      style={{ background: "#000" }}
    />
  );
};

export default memo(ChristmasMatrixTree);
