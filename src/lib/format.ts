// Small formatting helpers used across the UI to normalize display of
// recipe times, calories and servings. Kept minimal and deterministic.
export function formatPrepTime(value?: number | string | null): string | undefined {
  if (value === undefined || value === null) return undefined;

  // If it's already a number (minutes)
  if (typeof value === 'number') {
    const minutes = Math.max(0, Math.round(value));
    if (minutes >= 60) {
      const hours = Math.floor(minutes / 60);
      const mins = minutes % 60;
      return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
    }
    return `${minutes} min`;
  }

  // If it's a string, try to extract digits first
  const str = value.trim();
  if (!str) return undefined;

  // If already contains 'h' or 'min' or 'm', return as-is
  if (/[0-9]+\s*(h|hr|min|m)/i.test(str)) return str;

  const digits = str.match(/(\d+)/);
  if (digits) {
    const minutes = parseInt(digits[1], 10);
    return formatPrepTime(minutes);
  }

  return str; // fallback to original string
}

export function formatCalories(value?: number | null): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value !== 'number' || Number.isNaN(value)) return undefined;
  return `${Math.round(value)} cal`;
}

export function formatServings(value?: number | string | null): string | undefined {
  if (value === undefined || value === null) return undefined;
  if (typeof value === 'number') return `${value} porções`;
  const digits = String(value).match(/(\d+)/);
  if (digits) return `${digits[1]} porções`;
  return String(value);
}
