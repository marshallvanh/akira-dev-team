# BACKEND

I'll create that utility file for you.

---EXECUTION PLAN---
COMMANDS:
mkdir -p /home/marshall/projects/test-build

FILES:
/home/marshall/projects/test-build/utils.ts
/**
 * Formats a Date object to DD/MM/YYYY string format
 * @param date - The date to format
 * @returns Formatted date string in DD/MM/YYYY format
 */
export function formatDate(date: Date): string {
  const day = String(date.getDate()).padStart(2, '0');
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are 0-indexed
  const year = date.getFullYear();
  
  return `${day}/${month}/${year}`;
}

/**
 * Parses a DD/MM/YYYY string to a Date object
 * @param dateString - Date string in DD/MM/YYYY format
 * @returns Date object or null if invalid format
 */
export function parseDate(dateString: string): Date | null {
  const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
  const match = dateString.match(regex);
  
  if (!match) {
    return null;
  }
  
  const [, day, month, year] = match;
  const date = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
  
  // Validate the date is real (e.g., not 31/02/2024)
  if (
    date.getDate() !== parseInt(day) ||
    date.getMonth() !== parseInt(month) - 1 ||
    date.getFullYear() !== parseInt(year)
  ) {
    return null;
  }
  
  return date;
}

// Usage examples
if (require.main === module) {
  const now = new Date();
  console.log('Today:', formatDate(now));
  
  const parsed = parseDate('25/12/2024');
  console.log('Parsed Christmas:', parsed);
  
  const invalid = parseDate('31/02/2024');
  console.log('Invalid date:', invalid); // null
}
---END PLAN---

⚡ *Plan ID: 8a3c4f2b*
Commands: 1
Files: 1

💰 *Cost: $12.5427 (81 calls this session)*