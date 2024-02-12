const SLR = require("ml-regression").SLR;

const mlRegressionForcast = (
  timeAndPriceData: number[][],
  newTimestamp: number
) => {
  const timestamps = timeAndPriceData.map(([timestamp, price]) => timestamp);
  const prices = timeAndPriceData.map(([timestamp, price]) => price);

  const model = new SLR(timestamps, prices);

  const predictedPrice = model.predict(newTimestamp);
  console.log("🚀 ~ predictedPrice:", predictedPrice);
};

export default mlRegressionForcast;
