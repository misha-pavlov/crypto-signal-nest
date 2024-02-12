import * as tf from "@tensorflow/tfjs";
import "@tensorflow/tfjs-react-native";

const calculatePercentages = (
  predictedPrices: number[],
  currentPrice: number
) => {
  const buyThreshold = 0.8;
  const sellThreshold = 0.8;
  const result = predictedPrices.reduce(
    (acc, predictedPrice) => {
      const buyPercentage = Math.min(
        100,
        Math.max(0, (predictedPrice / (currentPrice * buyThreshold) - 1) * 100)
      );
      const sellPercentage = Math.min(
        100,
        Math.max(0, (1 - predictedPrice / (currentPrice * sellThreshold)) * 100)
      );
      const holdPercentage = 100 - buyPercentage - sellPercentage;

      if (!acc.buyPercentage || buyPercentage > acc.buyPercentage) {
        acc.buyPercentage = Math.round(buyPercentage);
      }

      if (!acc.sellPercentage || sellPercentage > acc.sellPercentage) {
        acc.sellPercentage = Math.round(sellPercentage);
      }

      if (!acc.holdPercentage || holdPercentage > acc.holdPercentage) {
        acc.holdPercentage = Math.round(holdPercentage);
      }

      return acc;
    },
    { buyPercentage: 0, sellPercentage: 0, holdPercentage: 0 }
  );

  return result;
};

const trainModel = async (X: tf.Tensor, y: tf.Tensor) => {
  const model = tf.sequential();
  model.add(
    tf.layers.dense({
      units: 1,
      activation: "relu",
      inputShape: [1],
      useBias: true,
    })
  );
  model.compile({
    optimizer: tf.train.adam(),
    loss: tf.losses.meanSquaredError,
    metrics: ["mse"],
  });

  // Train the model
  await model.fit(X, y, { epochs: 50, shuffle: true });

  return model;
};

const predictPrices = async (
  model: tf.Sequential,
  normalizedTimestamps: number[],
  minPrice: number,
  maxPrice: number
) => {
  const normalizedTimestampsTensor = tf.tensor2d([normalizedTimestamps]);
  const normalizedPredictedPrices = model.predict(
    normalizedTimestampsTensor
  ) as tf.Tensor<tf.Rank>;

  // Scale the predicted prices back to the original range
  const predictedPrices = normalizedPredictedPrices
    .mul(maxPrice - minPrice)
    .add(minPrice);

  // Extract the predicted price values
  const predictedPriceValues = predictedPrices.dataSync();

  return predictedPriceValues;
};

const trainAndPredict = async (
  timeAndPriceData: number[][],
  newTimestamp: number
) => {
  const timestamps = timeAndPriceData.map(([timestamp, price]) => timestamp);
  const prices = timeAndPriceData.map(([timestamp, price]) => price);

  const minTimestamp = Math.min(...timestamps);
  const maxTimestamp = Math.max(...timestamps);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);

  const normalizedTimestamps = timestamps.map(
    (ts) => (ts - minTimestamp) / (maxTimestamp - minTimestamp)
  );
  const normalizedPrices = prices.map(
    (price) => (price - minPrice) / (maxPrice - minPrice)
  );

  const X = tf.tensor1d(normalizedTimestamps);
  const y = tf.tensor1d(normalizedPrices);

  const model = await trainModel(X, y);

  const normalizedNewTimestamp =
    (newTimestamp - minTimestamp) / (maxTimestamp - minTimestamp);

  const predictedPriceValues = await predictPrices(
    model,
    [normalizedNewTimestamp],
    minPrice,
    maxPrice
  );

  const currentPrice = prices[prices.length - 1];

  const { buyPercentage, sellPercentage, holdPercentage } =
    calculatePercentages(
      predictedPriceValues as unknown as number[],
      currentPrice
    );

  return {
    buyPercentage,
    sellPercentage,
    holdPercentage,
  };
};

export default trainAndPredict;
