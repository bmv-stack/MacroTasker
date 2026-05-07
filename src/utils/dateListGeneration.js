export const generateDateList = () => {
  const dates = [];
  for (let i = -30; i < 355; i++) {
    const d = new Date();
    d.setDate(d.getDate() + i);
    dates.push({
      fullDate: d.toISOString().split('T')[0],
      dayNumber: d.getDate().toString(),
      dayName: d
        .toLocaleDateString('en-GB', { month: 'short', weekday: 'short' })
        .toUpperCase(),
    });
  }
  return dates;
};
