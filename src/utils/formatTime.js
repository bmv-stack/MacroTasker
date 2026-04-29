export const formatTime = timeString => {
  if (!timeString || !timeString.includes(':')) return timeString;

  const [hours24, m] = timeString.split(':');
  let hours = parseInt(hours24, 10);
  const meridiem = hours >= 12 ? 'PM' : 'AM';

  hours = hours % 12 || 12;
  return `${hours.toString().padStart(2, '0')}:${m} ${meridiem}`;
};
