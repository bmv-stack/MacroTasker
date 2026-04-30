export const getMinute = stringTime => {
  if (!stringTime) return 0;
  const [time, meridiem] = stringTime.split(' ');
  let [hours, minutes] = stringTime.split(':').map(Number);

  if (meridiem === 'PM' && hours !== 12) {
    hours += 12;
  }
  if (meridiem === 'AM' && hours === 12) {
    hours = 0;
  }
  return hours * 60 + minutes;
};
