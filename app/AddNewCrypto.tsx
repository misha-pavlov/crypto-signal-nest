import {
  View,
  Text,
  HStack,
  Input,
  InputField,
  Center,
  Divider,
  ScrollView,
} from "@gluestack-ui/themed";
import { useRouter } from "expo-router";
import { useWindowDimensions } from "react-native";
import React, {
  Fragment,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { customEvent } from "vexo-analytics";
import FlashMessage from "react-native-flash-message";
import { find, isEqual, map } from "lodash";
import { colors } from "../config/colors";
import { CryptoListItem, CryptoSignalNestLoader } from "../components";
import { Crypto } from "../types/Crypto.types";
import { useCallbackOnUnmount } from "../hooks";
import { updateUserData } from "../utils/actions/userActions";
import { useAppSelector } from "../store/store";
import { membershipPlans } from "../config/constants";

const AddNewCrypto = () => {
  const router = useRouter();
  const flashMessageRef = useRef<FlashMessage>(null);
  const { width } = useWindowDimensions();
  const storredUser = useAppSelector((state) => state.user.storredUser);

  const userId = storredUser?._id;
  const userCryptoList: Crypto[] = JSON.parse(storredUser?.cryptoList || "");
  const userCryptoListIds = map(userCryptoList, "id");
  const currentUserPlan =
    find(membershipPlans, ({ _id }) => _id === storredUser?.plan) ||
    membershipPlans[0];
  const isAdmin = storredUser?.isAdmin;

  const [isLoading, setIsLoading] = useState(true);
  const [selectedList, setSelectedList] = useState<Crypto[]>(userCryptoList);
  const [cryptoArray, setCryptoArray] = useState<Crypto[]>([]);

  const selectedListIds = map(selectedList, "id");
  const canAddMore = isAdmin || currentUserPlan?.limit > selectedListIds.length;

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

        if (flashMessageRef.current) {
          flashMessageRef.current.showMessage({
            message,
            type: "danger",
            titleStyle: { fontFamily: "Exo2-Bold" },
          });
        }
      }
    };

    fetchData();

    return () => abortController.abort();
  }, []);

  const onUnmount = useCallback(
    async () =>
      userId &&
      !isEqual(userCryptoListIds, selectedListIds) &&
      updateUserData(userId, { cryptoList: JSON.stringify(selectedList) }),
    [selectedList, userCryptoListIds, selectedListIds]
  );

  useCallbackOnUnmount(onUnmount);

  const renderItem = useCallback(
    ({ item }: { item: Crypto }) => {
      const id = item.id;
      const isSelected = !!selectedList.find((sl) => sl.id === id);

      const onRightSelected = () => {
        if (canAddMore) {
          let newArray: Crypto[] = [];

          if (isSelected) {
            newArray = selectedList.filter((sl) => sl.id !== id);
          } else {
            newArray = [...selectedList, item];
          }

          setSelectedList(newArray);
        } else {
          if (flashMessageRef.current) {
            flashMessageRef.current.showMessage({
              message: "You can not add more crytocurrencies in your list",
              type: "danger",
              titleStyle: { fontFamily: "Exo2-Bold" },
            });
          }
        }
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
            <CryptoSignalNestLoader />
          </Center>
        ) : (
          // <DraggableFlatList
          //   data={cryptoArray}
          //   renderItem={renderItem}
          //   ItemSeparatorComponent={() => (
          //     <Divider h={1} backgroundColor={colors.white} my={9} />
          //   )}
          //   keyExtractor={(item) => item.id}
          // />

          <ScrollView>
            {cryptoArray.map((item, index, array) => (
              <Fragment key={item.id}>
                {renderItem({ item })}
                {index !== array.length - 1 && (
                  <Divider h={1} backgroundColor={colors.grey} my={9} />
                )}
              </Fragment>
            ))}
          </ScrollView>
        )}
      </View>
      <FlashMessage ref={flashMessageRef} position="top" />
    </View>
  );
};

export default AddNewCrypto;
