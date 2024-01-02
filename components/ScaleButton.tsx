import { Text, View } from "@gluestack-ui/themed";
import { FC } from "react";
import { TouchableOpacity } from "react-native";

type ScaleButtonPropsType = {
  borderColor: string;
  backgroundColor: string;
  textColor: string;
  text: string;
  onPress?: VoidFunction;
  isBold?: boolean;
  disabled?: boolean;
  w?: number;
  h?: number;
};

const ScaleButton: FC<ScaleButtonPropsType> = ({
  backgroundColor,
  borderColor,
  textColor,
  text,
  onPress,
  isBold,
  disabled,
  w = 40,
  h = 20,
}) => {
  return (
    <TouchableOpacity onPress={onPress} disabled={disabled}>
      <View
        w={w}
        h={h}
        borderWidth={1}
        borderColor={borderColor}
        backgroundColor={backgroundColor}
        borderRadius={isBold ? 10 : 5}
        alignItems="center"
        justifyContent="center"
      >
        <Text
          color={textColor}
          fontFamily={isBold ? "$extraBold" : "$body"}
          fontSize={isBold ? 14 : 10}
          lineHeight={isBold ? 17 : 12}
        >
          {text}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default ScaleButton;
