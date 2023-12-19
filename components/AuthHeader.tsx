import { FC } from "react";
import { FontAwesome } from "@expo/vector-icons";
import { Divider, HStack, VStack, Text } from "@gluestack-ui/themed";
import { colors } from "../config/colors";
import { hexToRgba } from "../helpers";

type AuthHeaderPropsType = {
  title: string;
  subTitle: string;
};

const AuthHeader: FC<AuthHeaderPropsType> = ({ title, subTitle }) => {
  return (
    <VStack space="lg" overflow="hidden">
      <HStack space="4xl" alignItems="center">
        <FontAwesome name="btc" size={38} color={colors.primaryGreen} />
        <Divider h={1} backgroundColor={hexToRgba(colors.white, 0.5)} />
      </HStack>
      <VStack space="sm">
        <Text fontSize={20} color={colors.white} lineHeight={24}>
          {title}
        </Text>
        <Text
          fontSize={13}
          color={hexToRgba(colors.white, 0.5)}
          lineHeight={16}
        >
          {subTitle}
        </Text>
      </VStack>
    </VStack>
  );
};

export default AuthHeader;
