export const formatDate = dateString => {
  if (!dateString) return '';
  if (dateString.includes('/')) {
    return dateString;
  }
  const [year, month, day] = dateString.split('-');
  return `${day}/${month}/${year}`;
};
