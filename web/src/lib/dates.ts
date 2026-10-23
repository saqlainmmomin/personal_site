// Tenure helpers so durations on the page never go stale.

const WORDS = ['Zero', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten']

/** Parses "YYYY-MM" as the first of that month. */
export const parseMonth = (month: string) => {
  const [y, m] = month.split('-').map(Number)
  return new Date(y, m - 1, 1)
}

/** Whole years elapsed since a "YYYY-MM" start. */
export function fullYearsSince(month: string, now = new Date()) {
  const start = parseMonth(month)
  let years = now.getFullYear() - start.getFullYear()
  if (now.getMonth() < start.getMonth()) years--
  return years
}

export const yearsInWords = (n: number) => WORDS[n] ?? String(n)
