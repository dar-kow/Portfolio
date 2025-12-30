/**
 * SEASONAL MODE CONFIG
 *
 * Automatyczne przełączanie między trybami:
 * - christmas: choinka (do 30.12)
 * - newYearEve: 2026 + "nadchodzi" + fajerwerki (31.12)
 * - newYear: życzenia noworoczne + fajerwerki (01.01 - 06.01)
 * - normal: standardowe portfolio (po 06.01)
 */

export type SeasonalMode = 'christmas' | 'newYearEve' | 'newYear' | 'normal';

/**
 * Główny przełącznik - ustaw false aby wyłączyć wszystkie efekty świąteczne
 */
export const SEASONAL_MODE_ENABLED = true;

/**
 * DEBUG: Wymuś konkretny tryb (ustaw null dla automatycznego)
 * Opcje: 'christmas' | 'newYearEve' | 'newYear' | 'normal' | null
 */
export const FORCE_MODE: SeasonalMode | null = null // <- zmień tu na 'newYear' żeby przetestować

/**
 * Określa aktualny tryb sezonowy na podstawie daty
 */
export const getSeasonalMode = (): SeasonalMode => {
  // Debug override
  if (FORCE_MODE) {
    return FORCE_MODE;
  }

  if (!SEASONAL_MODE_ENABLED) {
    return 'normal';
  }

  const now = new Date();
  const month = now.getMonth(); // 0-indexed (0 = January, 11 = December)
  const day = now.getDate();

  // Grudzień
  if (month === 11) {
    if (day <= 29) {
      return 'christmas'; // Do 30.12 - choinka
    }
    if (day === 30) {
      return 'newYearEve'; // 31.12 - sylwester
    }
  }

  // Styczeń
  if (month === 0) {
    if (day >= 1 && day <= 6) {
      return 'newYear'; // 01.01 - 06.01
    }
  }

  return 'normal';
};

/**
 * @deprecated Użyj getSeasonalMode() zamiast tego
 */
export const isChristmasActive = (): boolean => {
  const mode = getSeasonalMode();
  return mode !== 'normal';
};
