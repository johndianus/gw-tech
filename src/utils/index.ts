export const getMinDateTime = () => {
  const now = new Date();
  const minDate = new Date();
  minDate.setHours(now.getHours() + 1);
  return minDate;
};