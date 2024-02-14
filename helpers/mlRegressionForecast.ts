const SLR = require("ml-regression").SLR;

const mlRegressionForecast = (
  timeAndPriceData: number[][],
  newTimestamp: number
) => {
  const timestamps = timeAndPriceData.map(([timestamp, price]) => timestamp);
  const prices = timeAndPriceData.map(([timestamp, price]) => price);

  const model = new SLR(timestamps, prices);

  return Math.ceil(model.predict(newTimestamp));
};

export default mlRegressionForecast;
