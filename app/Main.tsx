import { View, Text, HStack, Center } from "@gluestack-ui/themed";
import { useNavigation, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Octicons, FontAwesome } from "@expo/vector-icons";
import { withStyledProvider } from "../hocs/withStyledProvider";
import { colors } from "../config/colors";
import {
  CryptoListItem,
  CryptoSignalNestLoader,
  UserAvatar,
} from "../components";
import { screens } from "../config/screens";
import { hexToRgba } from "../helpers";

const Main = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const [isEdit, setIsEdit] = useState(false);

  useEffect(() => {
    navigation.setOptions({
      headerTitle: "",
      headerStyle: {
        backgroundColor: colors.primaryBlack,
      },
      headerLeft: withStyledProvider(() =>
        isEdit ? (
          <Text color={colors.red}>Delete({10})</Text>
        ) : (
          <TouchableOpacity onPress={() => router.push(screens.Profile)}>
            <HStack alignItems="center" space="md">
              <UserAvatar />
              <Text fontSize={12} lineHeight={14} color={colors.white}>
                Welcome [name]!
              </Text>
            </HStack>
          </TouchableOpacity>
        )
      ),
      headerRight: () =>
        isEdit ? (
          <Text color={colors.primaryGreen} onPress={() => setIsEdit(false)}>
            Done
          </Text>
        ) : (
          <HStack alignItems="center" space="lg">
            <TouchableOpacity onPress={() => router.push(screens.AddNewCrypto)}>
              <Octicons name="plus" size={20} color={colors.white} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsEdit(true)}>
              <FontAwesome name="edit" size={20} color={colors.white} />
            </TouchableOpacity>
          </HStack>
        ),
    });
  }, [navigation, isEdit]);

  return (
    <View flex={1} backgroundColor={colors.primaryBlack} px={16}>
      <Text fontSize={16} lineHeight={19} color={colors.white} mt={20} mb={24}>
        Watchlist
      </Text>

      <HStack alignItems="center" mb={16}>
        <Text
          pr="35%"
          fontSize={12}
          lineHeight={14}
          color={hexToRgba(colors.white, 0.7)}
        >
          Crypto
        </Text>

        <Text
          pr="17%"
          fontSize={12}
          lineHeight={14}
          color={hexToRgba(colors.white, 0.7)}
        >
          Recommendation
        </Text>

        <Text
          fontSize={12}
          lineHeight={14}
          color={hexToRgba(colors.white, 0.7)}
        >
          24h %
        </Text>
      </HStack>

      <CryptoListItem
        crypto={mockCryptoArray[0]}
        showRecommendation
        showChart
      />
      <CryptoListItem crypto={mockCryptoArray[1]} isSelectionList right />
      <CryptoListItem
        crypto={mockCryptoArray[2]}
        isSelectionList
        right
        isSelected
      />
      <CryptoListItem crypto={mockCryptoArray[3]} isSelectionList left />
      <CryptoListItem
        crypto={mockCryptoArray[4]}
        isSelectionList
        left
        isSelected
      />
      {/* <Center>
        <CryptoSignalNestLoader />
      </Center> */}
    </View>
  );
};

export default Main;

const mockCryptoArray = [
  {
    id: "bitcoin",
    icon: "https://static.coinstats.app/coins/1650455588819.png",
    name: "Bitcoin",
    symbol: "BTC",
  },
  {
    id: "ethereum",
    icon: "https://static.coinstats.app/coins/1650455629727.png",
    name: "Ethereum",
    symbol: "ETH",
  },
  {
    id: "tether",
    icon: "https://static.coinstats.app/coins/1650455771843.png",
    name: "Tether",
    symbol: "USDT",
  },
  {
    id: "solana",
    icon: "https://static.coinstats.app/coins/1701234596791.png",
    name: "Solana",
    symbol: "SOL",
  },
  {
    id: "binance-coin",
    icon: "https://static.coinstats.app/coins/1666608145347.png",
    name: "BNB",
    symbol: "BNB",
  },
];
