import { colors } from "../config/colors";

type forecastType = {
  buyPercentage: number;
  sellPercentage: number;
  holdPercentage: number;
};

const getPercentAndColor = (forecast: forecastType) => {
  const { buyPercentage, sellPercentage, holdPercentage } = forecast;
  const maxPercentage = Math.max(...Object.values(forecast));
  let res = { color: colors.primaryBlack, percent: 0, action: "Hold" };

  switch (maxPercentage) {
    case buyPercentage: {
      res = { color: colors.green, percent: buyPercentage, action: "Buy" };
      break;
    }
    case sellPercentage: {
      res = { color: colors.red, percent: sellPercentage, action: "Sell" };
      break;
    }
    case holdPercentage: {
      res = {
        color: colors.white,
        percent: holdPercentage,
        action: "Hold",
      };
      break;
    }
    default:
      break;
  }

  return res;
};

export default getPercentAndColor;
