export const commaNumber = (num: number | null): string => {
  if (num === null) return '0';
  return num.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',');
};
