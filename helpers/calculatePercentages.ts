const calculatePercentages = (
  predictionPrices: number[],
  currentPrice: number
) => {
  const currentPriceTenPercent = (currentPrice / 100) * 10;
  return predictionPrices.reduce(
    (prev, curr) => {
      if (
        curr >= currentPrice - currentPriceTenPercent &&
        curr <= currentPrice + currentPriceTenPercent
      ) {
        prev.holdPercentage += 20;
      }

      if (curr > currentPrice + currentPriceTenPercent) {
        prev.buyPercentage += 20;
      }

      if (curr < currentPrice - currentPriceTenPercent) {
        prev.sellPercentage += 20;
      }

      return prev;
    },
    {
      buyPercentage: 0,
      sellPercentage: 0,
      holdPercentage: 0,
    }
  );
};

export default calculatePercentages;
