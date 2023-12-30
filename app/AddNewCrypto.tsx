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
import { useCallback, useState } from "react";
import DraggableFlatList, {
  RenderItemParams,
} from "react-native-draggable-flatlist";
import { colors } from "../config/colors";
import { CryptoListItem, CryptoSignalNestLoader } from "../components";
import { Crypto } from "../types/Crypto.types";

const AddNewCrypto = () => {
  const router = useRouter();
  const { width } = useWindowDimensions();
  const [isLoading, setIsLoading] = useState(false);
  const [selectedList, setSelectedList] = useState<string[]>([]);

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

      <View>
        {isLoading ? (
          <Center>
            <CryptoSignalNestLoader backgroundColor={colors.grey} />
          </Center>
        ) : (
          <DraggableFlatList
            data={mockCryptoArray}
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
