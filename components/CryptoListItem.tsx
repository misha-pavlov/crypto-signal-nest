import { HStack, View, Text } from "@gluestack-ui/themed";
import FastImage from "react-native-fast-image";
import { FC, memo, useEffect, useState } from "react";
import { LineGraph } from "react-native-graph";
import { Octicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { customEvent } from "vexo-analytics";
import { showMessage } from "react-native-flash-message";
import { colors } from "../config/colors";
import {
  getPriceHistory,
  getTimePrices,
  hexToRgba,
  trainAndPredict,
  getPercentAndColor,
  mlRegressionForcast,
} from "../helpers";
import { Crypto, ForecastType } from "../types/Crypto.types";

type CryptoListItemPropsType = {
  crypto: Crypto;
  showRecommendation?: boolean;
  isSelectionList?: boolean;
  left?: boolean;
  right?: boolean;
  isSelected?: boolean;
  onLongPress?: VoidFunction;
  onLeftSelect?: VoidFunction;
  onRightSelect?: VoidFunction;
  onRowPress?: (forecast: ForecastType) => void;
};

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const CryptoListItem: FC<CryptoListItemPropsType> = ({
  showRecommendation,
  isSelectionList,
  left,
  right,
  isSelected,
  crypto,
  onLongPress,
  onLeftSelect,
  onRightSelect,
  onRowPress,
}) => {
  const [forecast, setForecast] = useState({
    buyPercentage: 0,
    sellPercentage: 0,
    holdPercentage: 0,
  });
  const [isRecommendationLoading, setIsRecommendationLoading] = useState(true);
  const [chart, setChart] = useState([]);

  useEffect(() => {
    if (showRecommendation) {
      const abortController = new AbortController();

      const fetchData = async () => {
        try {
          const options: RequestInit = {
            method: "GET",
            // @ts-ignore - because headers should have X-API-KEY
            headers: {
              accept: "application/json",
              "X-API-KEY": process.env.EXPO_PUBLIC_COIN_STATS_API_KEY,
            },
            signal: abortController.signal,
          };

          fetch(
            `https://openapiv1.coinstats.app/coins/${crypto.id}/charts?period=24h`,
            options
          )
            .then((response) => response.json())
            .then(async (response) => {
              const timePrices = getTimePrices(response);
              const predictTime =
                new Date(+new Date() + 86400000).getTime() / 1000;
              await mlRegressionForcast(timePrices, predictTime);
              await mlRegressionForcast(
                timePrices,
                new Date(+new Date() + 2 * 86400000).getTime() / 1000
              );
              const result = await trainAndPredict(timePrices, predictTime);
              setChart(response);
              setForecast(result);
              setIsRecommendationLoading(false);
            })
            .catch((err) => console.error(err));
        } catch (error) {
          const message = "Error to fetch cryptocurrency data";
          console.error(message, error);
          customEvent(message, error);
          showMessage({
            message,
            type: "danger",
            titleStyle: { fontFamily: "Exo2-Bold" },
          });
        }
      };

      fetchData();

      return () => abortController.abort();
    }
  }, []);

  const recommendation = showRecommendation
    ? getPercentAndColor(forecast)
    : null;
  const chartColor = recommendation?.color || colors.primaryBlack;

  return (
    <TouchableOpacity
      onLongPress={onLongPress}
      disabled={!!!onRowPress || isRecommendationLoading}
      onPress={() =>
        onRowPress && !isRecommendationLoading && onRowPress(forecast)
      }
    >
      <HStack
        alignItems="center"
        justifyContent={isSelectionList && right ? "space-between" : undefined}
      >
        {isSelectionList && left && (
          <TouchableOpacity onPress={onLeftSelect}>
            <View
              borderWidth={1}
              borderColor={isSelected ? colors.primaryGreen : colors.white}
              backgroundColor={
                isSelected ? colors.primaryGreen : colors.primaryBlack
              }
              w={20}
              h={20}
              borderRadius="$full"
              mr={16}
              alignItems="center"
              justifyContent="center"
            >
              <Octicons name="check" size={14} color={colors.primaryBlack} />
            </View>
          </TouchableOpacity>
        )}

        <HStack alignItems="center" space="sm" w={100} mr="22%">
          <FastImage
            style={{ width: 28, height: 28 }}
            source={{
              uri: crypto.icon,
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />

          <View>
            <Text color={colors.white} fontSize={14} lineHeight={17}>
              {crypto.name}
            </Text>
            <Text
              color={hexToRgba(colors.white, 0.5)}
              fontSize={14}
              lineHeight={17}
            >
              {crypto.symbol}
            </Text>
          </View>
        </HStack>

        {showRecommendation && !isSelectionList && (
          <View mr="10%">
            {isRecommendationLoading ? (
              <ShimmerPlaceholder
                width={57}
                style={{ borderRadius: 50 }}
                shimmerColors={[colors.primaryGreen, colors.red, colors.white]}
              />
            ) : (
              <Text
                fontSize={14}
                lineHeight={17}
                fontFamily="$bold"
                color={recommendation?.color}
              >
                {recommendation?.percent}% {recommendation?.action}
              </Text>
            )}
          </View>
        )}

        {showRecommendation && !isSelectionList && (
          <View>
            {isRecommendationLoading ? (
              <ShimmerPlaceholder
                width={87}
                style={{ borderRadius: 50 }}
                shimmerColors={[colors.primaryGreen, colors.red, colors.white]}
              />
            ) : (
              <LineGraph
                points={getPriceHistory(chart)}
                color={chartColor}
                enableFadeInMask
                animated
                lineThickness={1}
                style={{ width: 87, height: 37 }}
                gradientFillColors={[
                  hexToRgba(chartColor, 0.2),
                  hexToRgba(chartColor, 0.1),
                  hexToRgba(chartColor, 0.1),
                ]}
              />
            )}
          </View>
        )}

        {isSelectionList && right && (
          <TouchableOpacity onPress={onRightSelect}>
            <View>
              <Octicons
                name={isSelected ? "check" : "plus"}
                size={20}
                color={colors.white}
              />
            </View>
          </TouchableOpacity>
        )}
      </HStack>
    </TouchableOpacity>
  );
};

export default memo(CryptoListItem);
