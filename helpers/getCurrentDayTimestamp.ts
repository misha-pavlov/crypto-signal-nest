const getCurrentDayTimestamp = (numberOfNextDay: number = 1) =>
  new Date(+new Date() + numberOfNextDay * 86400000).getTime() / 1000;

export default getCurrentDayTimestamp;
