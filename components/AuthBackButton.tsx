import {
  Icon,
  Text,
  Center,
  HStack,
  ArrowLeftIcon,
} from "@gluestack-ui/themed";
import { FC } from "react";
import { Link } from "expo-router";
import { TouchableOpacity } from "react-native";
import { colors } from "../config/colors";

type AuthBackButtonPropsType = {
  href: string;
  backText: string;
};

const AuthBackButton: FC<AuthBackButtonPropsType> = ({ href, backText }) => {
  return (
    <Center>
      <Link href={href} asChild replace>
        <TouchableOpacity>
          <HStack alignItems="center">
            <Icon as={ArrowLeftIcon} color={colors.white} />
            <Text
              fontFamily="$bold"
              fontSize={14}
              lineHeight={17}
              color={colors.white}
            >
              {backText}
            </Text>
          </HStack>
        </TouchableOpacity>
      </Link>
    </Center>
  );
};

export default AuthBackButton;
