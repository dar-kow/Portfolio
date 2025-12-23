/**
 * CHRISTMAS MODE TOGGLE
 *
 * Ustaw na `true` aby włączyć świąteczny motyw (choinka z matrix + życzenia)
 * Ustaw na `false` aby wrócić do normalnego portfolio
 *
 * Po świętach: zmień na false i gotowe!
 */
export const CHRISTMAS_MODE = true;

/**
 * Data automatycznego wyłączenia (opcjonalne)
 * Po tej dacie CHRISTMAS_MODE będzie ignorowany
 * Format: YYYY-MM-DD
 */
export const CHRISTMAS_END_DATE = "2026-01-07"; // Po Trzech Królach

/**
 * Sprawdza czy tryb świąteczny powinien być aktywny
 */
export const isChristmasActive = (): boolean => {
  if (!CHRISTMAS_MODE) return false;

  const now = new Date();
  const endDate = new Date(CHRISTMAS_END_DATE);

  return now <= endDate;
};
