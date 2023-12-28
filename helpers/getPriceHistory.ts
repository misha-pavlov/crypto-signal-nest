const getPriceHistory = (chartHistory: number[][]) =>
  chartHistory.map((ch) => ({
    date: new Date(ch[0]),
    value: ch[1],
  }));

export default getPriceHistory;
