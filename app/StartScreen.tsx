import { View, Text, Button, Center, VStack } from "@gluestack-ui/themed";
import { Link } from "expo-router";
import FastImage from "react-native-fast-image";
import { mmkvStorageKeys } from "../config/constants";
import { mmkvStorage } from "./mmkvStorage";
import { withStyledProvider } from "../hocs/withStyledProvider";
import { screens } from "../config/screens";
import { colors } from "../config/colors";
import { hexToRGBA } from "../helpers/hexToRgba";

const StartScreen = () => {
  return (
    <VStack
      backgroundColor={colors.primaryBlack}
      px={16}
      flex={1}
      justifyContent="space-between"
      paddingBottom={56}
    >
      <Center>
        <View mt={100}>
          <FastImage
            style={{ width: 300, height: 300 }}
            source={require("../assets/images/logo.png")}
            resizeMode={FastImage.resizeMode.contain}
          />
        </View>

        <View alignSelf="flex-start" mt={32}>
          <Text fontSize={28} color={colors.white} lineHeight={34}>
            Get success in the
          </Text>
          <Text
            fontSize={28}
            fontFamily="$bold"
            color={colors.primaryGreen}
            lineHeight={34}
            textTransform="uppercase"
          >
            Crypto signal nest
          </Text>
        </View>

        <View alignSelf="flex-start" mt={24}>
          <Text
            fontSize={16}
            fontFamily="$bold"
            lineHeight={19}
            color={hexToRGBA(colors.white, 0.5)}
          >
            Best way to invest and save money for the future just by using your
            phone
          </Text>
        </View>
      </Center>

      <Link href={screens.LogIn} asChild replace>
        <Button
          backgroundColor={colors.primaryGreen}
          borderRadius={15}
          h={50}
          onPress={() =>
            mmkvStorage.set(mmkvStorageKeys.wasStartScreenShown, true)
          }
        >
          <Text color={colors.primaryBlack} fontFamily="$bold" fontSize={16}>
            Get started
          </Text>
        </Button>
      </Link>
    </VStack>
  );
};

export default withStyledProvider(StartScreen);
