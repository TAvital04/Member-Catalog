/**
 * Converts graduation date string into a chronological floating-point value for sorting.
 */
export function getGradValue(dateStr: string): number {
  if (!dateStr) return 0;

  const cleanStr = dateStr.trim().toLowerCase();
  if (!cleanStr) return 0;

  const isoMatch = cleanStr.match(/^(\d{4})-(\d{2})(?:-\d{2})?$/);
  if (isoMatch) {
    const year = parseInt(isoMatch[1]);
    const month = parseInt(isoMatch[2]);
    return year + month / 12;
  }

  if (/^\d{4}$/.test(cleanStr)) {
    return parseInt(cleanStr) + 0.5;
  }

  const yearMatch = cleanStr.match(/\b(\d{4})\b/);
  if (yearMatch) {
    const year = parseInt(yearMatch[1]);

    let monthVal = 0.5;
    if (cleanStr.includes("dec") || cleanStr.includes("fall") || cleanStr.includes("winter")) {
      monthVal = 0.9;
    } else if (cleanStr.includes("summer") || cleanStr.includes("aug")) {
      monthVal = 0.75;
    } else if (cleanStr.includes("jan") || cleanStr.includes("spring")) {
      monthVal = 0.33;
    } else {
      const months = ["jan", "feb", "mar", "apr", "may", "jun", "jul", "aug", "sep", "oct", "nov", "dec"];
      for (let i = 0; i < months.length; i++) {
        if (cleanStr.includes(months[i])) {
          monthVal = (i + 1) / 12;
          break;
        }
      }
    }
    return year + monthVal;
  }

  const fallbackNum = parseFloat(cleanStr);
  return isNaN(fallbackNum) ? 0 : fallbackNum;
}
