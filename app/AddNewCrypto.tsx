import {
  View,
  Text,
  HStack,
  Input,
  InputField,
  Center,
  Divider,
} from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import { useWindowDimensions } from "react-native";
import { useCallback, useEffect, useState } from "react";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { customEvent } from "vexo-analytics";
import { showMessage } from "react-native-flash-message";
import { colors } from "../config/colors";
import { CryptoListItem, CryptoSignalNestLoader } from "../components";
import { Crypto } from "../types/Crypto.types";
import { useCallbackOnUnmount } from "../hooks";

const AddNewCrypto = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [isLoading, setIsLoading] = useState(true);
  const [selectedList, setSelectedList] = useState<string[]>([]);
  const [cryptoArray, setCryptoArray] = useState<Crypto[]>([]);

  useEffect(() => {
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

        fetch("https://openapiv1.coinstats.app/coins?limit=50", options)
          .then((response) => response.json())
          .then((response) => setCryptoArray(response?.result || []))
          .catch((err) => console.error(err))
          .finally(() => setIsLoading(false));
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
  }, []);

  useCallbackOnUnmount(() => console.log('on unmount'));

  const renderItem = useCallback(
    ({ item }: RenderItemParams<Crypto>) => {
      const id = item.id;
      const isSelected = selectedList.includes(id);

      const onRightSelected = () => {
        let newArray: string[] = [];

        if (isSelected) {
          newArray = selectedList.filter((sl) => sl !== id);
        } else {
          newArray = [...selectedList, id];
        }

        setSelectedList(newArray);
      };

      return (
        <CryptoListItem
          crypto={item}
          isSelectionList
          right
          isSelected={isSelected}
          onRightSelect={onRightSelected}
        />
      );
    },
    [selectedList]
  );

  return (
    <View flex={1} backgroundColor={colors.grey} p={16}>
      <HStack space="lg" alignItems="center" mb={24}>
        <Input
          variant="outline"
          size="md"
          // 32 - padding container
          // 16 - gap
          // 35.3 - Text width
          w={width - 32 - 16 - 35.3}
          backgroundColor={colors.grey}
          borderColor={colors.white}
        >
          <InputField placeholder="Search" color={colors.white} />
        </Input>

        <Text
          onPress={() => router.back()}
          fontSize={14}
          lineHeight={17}
          color={colors.white}
        >
          Close
        </Text>
      </HStack>

      <View pb={60}>
        {isLoading ? (
          <Center>
            <CryptoSignalNestLoader backgroundColor={colors.grey} />
          </Center>
        ) : (
          <DraggableFlatList
            data={cryptoArray}
            renderItem={renderItem}
            ItemSeparatorComponent={() => (
              <Divider h={1} backgroundColor={colors.white} my={9} />
            )}
            keyExtractor={(item) => item.id}
          />
        )}
      </View>
    </View>
  );
};

export default AddNewCrypto;
