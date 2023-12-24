import { Text, Center, HStack } from "@gluestack-ui/themed";
import { FC } from "react";
import { Link } from "expo-router";
import { colors } from "../config/colors";
import { hexToRgba } from "../helpers";

type AuthBottomPropsType = {
  firstText: string;
  secondText: string;
  href: string;
  onPress?: VoidFunction;
};

const AuthBottom: FC<AuthBottomPropsType> = ({
  firstText,
  secondText,
  href,
  onPress,
}) => {
  return (
    <Center>
      <HStack>
        <Text
          fontSize={14}
          lineHeight={17}
          pr={5}
          color={hexToRgba(colors.white, 0.5)}
        >
          {firstText}
        </Text>

        {onPress ? (
          <Text
            fontSize={14}
            lineHeight={17}
            fontFamily="$bold"
            color={colors.white}
            onPress={onPress}
          >
            {secondText}
          </Text>
        ) : (
          <Link href={href} replace>
            <Text
              fontSize={14}
              lineHeight={17}
              fontFamily="$bold"
              color={colors.white}
            >
              {secondText}
            </Text>
          </Link>
        )}
      </HStack>
    </Center>
  );
};

export default AuthBottom;
