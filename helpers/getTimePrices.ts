const getTimePrices = (chartHistory: number[][]) =>
  chartHistory.map((ch) => [ch[0], ch[1]]);

export default getTimePrices;
