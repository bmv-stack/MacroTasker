export const parseDate = dateString => {
  if (!dateString) return null;
  let day, month, year;
  if (dateString.includes('/')) {
    // DD/MM/YYYY
    [day, month, year] = dateString.split('/').map(Number);
  } else if (dateString.includes('-')) {
    // YYYY-MM-DD
    [year, month, day] = dateString.split('-').map(Number);
  } else {
    return null;
  }
  if (isNaN(day) || isNaN(month) || isNaN(year)) return null;
  const date = new Date(year, month - 1, day);
  return isNaN(date.getTime()) ? null : date;
};
