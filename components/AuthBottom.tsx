import { Text, Center, HStack } from "@gluestack-ui/themed";
import { FC } from "react";
import { Link } from "expo-router";
import {
  CountdownCircleTimer,
  ColorFormat,
} from "react-native-countdown-circle-timer";
import { colors } from "../config/colors";
import { hexToRgba } from "../helpers";

type AuthBottomPropsType = {
  firstText: string;
  secondText: string;
  href: string;
  disabled?: boolean;
  withTimer?: boolean;
  onPress?: VoidFunction;
  onCountdown?: VoidFunction;
};

const AuthBottom: FC<AuthBottomPropsType> = ({
  firstText,
  secondText,
  href,
  disabled,
  withTimer,
  onPress,
  onCountdown,
}) => (
  <Center>
    <HStack alignItems="center">
      <Text
        fontSize={14}
        lineHeight={17}
        pr={5}
        color={hexToRgba(colors.white, 0.5)}
      >
        {firstText}
      </Text>

      {onPress ? (
        <HStack alignItems="center" space="md">
          <Text
            fontSize={14}
            lineHeight={17}
            fontFamily="$bold"
            color={disabled ? hexToRgba(colors.white, 0.5) : colors.white}
            onPress={onPress}
            disabled={disabled}
          >
            {secondText}
          </Text>
          {withTimer && disabled && (
            <CountdownCircleTimer
              isPlaying
              size={60}
              duration={60}
              colors={colors.primaryGreen as ColorFormat}
              onComplete={() => {
                onCountdown && onCountdown();
                return { shouldRepeat: true, delay: 1.5 };
              }}
            >
              {({ remainingTime }) => (
                <Text fontFamily="$bold" color={colors.white}>
                  {remainingTime}
                </Text>
              )}
            </CountdownCircleTimer>
          )}
        </HStack>
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

export default AuthBottom;
