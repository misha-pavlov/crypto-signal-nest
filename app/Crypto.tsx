import { View, Text, Center, VStack, HStack } from "@gluestack-ui/themed";
import { useLocalSearchParams } from "expo-router";
import { Ionicons } from "@expo/vector-icons";
import FastImage from "react-native-fast-image";
import { LineGraph } from "react-native-graph";
import { Share, TouchableOpacity, useWindowDimensions } from "react-native";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import ViewShot from "react-native-view-shot";
import { customEvent } from "vexo-analytics";
import { showMessage } from "react-native-flash-message";
import { colors } from "../config/colors";
import { getPercentAndColor, getPriceHistory, hexToRgba } from "../helpers";
import { CryptoSignalNestLoader, ScaleButton } from "../components";
import { ForecastType, Crypto as CryptoType } from "../types/Crypto.types";
import { uploadImage } from "../helpers/imagePickerHelpers";

const timeFrames = ["24H", "1W", "1M", "3M", "6M", "1Y", "All"];

const Crypto = () => {
  const params = useLocalSearchParams<{
    crypto: string;
    forecast: string;
  }>();
  const { width } = useWindowDimensions();
  const viewShotRef = useRef<ViewShot>(null);

  const [selectedFrame, setSelectedFrame] = useState(timeFrames[0]);
  const [isLoading, setIsLoading] = useState(true);
  const [chart, setChart] = useState([]);

  const crypto = JSON.parse(params?.crypto || "") as CryptoType;
  const forecast = JSON.parse(params?.forecast || "") as ForecastType;
  const recommendation = getPercentAndColor(forecast);
  const chartColor = recommendation?.color || colors.grey;
  const chartWidth = width - 32;

  useEffect(() => {
    const abortController = new AbortController();

    const fetchData = async () => {
      try {
        if (!isLoading) {
          setIsLoading(true);
        }

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
          `https://openapiv1.coinstats.app/coins/${
            crypto.id
          }/charts?period=${selectedFrame.toLowerCase()}`,
          options
        )
          .then((response) => response.json())
          .then(async (response) => {
            setChart(response);
            setIsLoading(false);
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
  }, [selectedFrame]);

  const captureAndShareScreenshot = useCallback(async () => {
    if (viewShotRef?.current) {
      const viewShot = viewShotRef.current;
      if (viewShot.capture) {
        const captureUri = await viewShot.capture();
        const captureUriSplit = captureUri.split("/");
        const fileName =
          captureUriSplit[captureUriSplit.length - 1].split(".")[0];
        const urlString = await uploadImage(captureUri, fileName, "viewShots");
        const options = {
          title: "CryptoSignalNest",
          message: `Share ${crypto.name} with friends`,
          url: urlString,
          type: "image/png",
        };
        Share.share(options)
          .then((res) => {
            console.log(res);
          })
          .catch((err) => {
            err && console.log(err);
            const message = "Something went wrong with sharing";
            customEvent(message, err);
            showMessage({
              message,
              type: "danger",
              titleStyle: { fontFamily: "Exo2-Bold" },
            });
          });
      }
    }
  }, [crypto]);

  const renderChart = useMemo(() => {
    const height = chartWidth - 64;

    if (isLoading) {
      return (
        <Center w={chartWidth} h={height}>
          <CryptoSignalNestLoader />
        </Center>
      );
    } else {
      return (
        <LineGraph
          points={getPriceHistory(chart)}
          color={chartColor}
          enableFadeInMask
          animated
          lineThickness={1}
          style={{ width: chartWidth, height }}
          gradientFillColors={[
            hexToRgba(chartColor, 0.2),
            hexToRgba(chartColor, 0.1),
            hexToRgba(chartColor, 0.1),
          ]}
        />
      );
    }
  }, [isLoading, chart]);

  return (
    <ViewShot
      ref={viewShotRef}
      options={{ format: "png", quality: 1.0 }}
      style={{ flex: 1 }}
    >
      <View flex={1} backgroundColor={colors.grey} p={16}>
        <Center>
          <View
            width={50}
            height={4}
            backgroundColor={hexToRgba(colors.white, 0.5)}
            mb={24}
          />
        </Center>

        <View>
          <TouchableOpacity onPress={captureAndShareScreenshot}>
            <Ionicons name="share-outline" size={20} color={colors.white} />
          </TouchableOpacity>
        </View>

        <Center>
          <VStack space="lg" alignItems="center" mb={32}>
            <FastImage
              style={{ width: 45, height: 45 }}
              source={{
                uri: crypto.icon,
                priority: FastImage.priority.high,
              }}
              resizeMode={FastImage.resizeMode.contain}
            />

            <Center>
              <Text
                fontFamily="$bold"
                fontSize={16}
                lineHeight={20}
                color={colors.white}
              >
                {crypto.name}
              </Text>
              <Text
                fontFamily="$bold"
                fontSize={14}
                lineHeight={17}
                color={hexToRgba(colors.white, 0.5)}
              >
                {crypto.symbol}
              </Text>
            </Center>

            <View>
              <Text
                fontFamily="$bold"
                fontSize={24}
                lineHeight={29}
                color={colors.white}
              >
                ${crypto.price.toFixed(2)}
              </Text>
            </View>
          </VStack>
        </Center>

        {renderChart}

        <HStack
          justifyContent="space-between"
          alignItems="center"
          mt={32}
          space="md"
        >
          {timeFrames.map((timeFrame) => (
            <ScaleButton
              key={timeFrame}
              borderColor={
                selectedFrame === timeFrame ? colors.primaryGreen : colors.white
              }
              backgroundColor={
                selectedFrame === timeFrame ? colors.primaryGreen : colors.grey
              }
              textColor={
                selectedFrame === timeFrame ? colors.grey : colors.white
              }
              text={timeFrame}
              onPress={() => setSelectedFrame(timeFrame)}
              disabled={timeFrame === selectedFrame}
            />
          ))}
        </HStack>

        <Center mt={32}>
          <Text
            textTransform="uppercase"
            color={hexToRgba(colors.white, 0.7)}
            fontSize={14}
            lineHeight={17}
          >
            Recommendations
          </Text>
        </Center>

        <HStack justifyContent="space-between" alignItems="center" mt={24}>
          <ScaleButton
            borderColor={colors.green}
            backgroundColor={colors.grey}
            textColor={colors.green}
            text={`${forecast.buyPercentage}% Buy`}
            disabled
            isBold
            w={100}
            h={50}
          />

          <ScaleButton
            borderColor={colors.white}
            backgroundColor={colors.grey}
            textColor={colors.white}
            text={`${forecast.holdPercentage}% Hold`}
            disabled
            isBold
            w={100}
            h={50}
          />

          <ScaleButton
            borderColor={colors.red}
            backgroundColor={colors.grey}
            textColor={colors.red}
            text={`${forecast.sellPercentage}% Sell`}
            disabled
            isBold
            w={100}
            h={50}
          />
        </HStack>
      </View>
    </ViewShot>
  );
};

export default Crypto;
