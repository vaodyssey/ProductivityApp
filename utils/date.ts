export const toDateString = (date: Date): string => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
};

export const getWeekDateTimes = (daysOfWeek: number[]): string[] => {
  // Start of the week (Sunday) for the reference date
  const { startOfWeek } = getWeekRange();

  return daysOfWeek.map((day) => {
    const date = new Date(startOfWeek);
    date.setDate(startOfWeek.getDate() + day);
    return toDateString(date);
  });
};

export const getWeekRange = () => {
  const today = new Date();
  const SATURDAY_DAY_ID = 6;
  const startOfWeek = new Date(today);
  const endOfWeek = new Date(today);
  const date = today.getDate();
  const weekday = today.getDay(); //i.e. number of steps away from Sunday
  const dateOfSunday = date - weekday;
  startOfWeek.setDate(dateOfSunday); //i.e. get the date of Sunday
  endOfWeek.setDate(dateOfSunday + SATURDAY_DAY_ID);
  return {
    startOfWeek,
    endOfWeek,
  };
};
