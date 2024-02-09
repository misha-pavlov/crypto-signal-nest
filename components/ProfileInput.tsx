import { FormControl, HStack, Text } from "@gluestack-ui/themed";
import { FC, useCallback, useState } from "react";
import { showMessage } from "react-native-flash-message";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../config/colors";
import { hexToRgba } from "../helpers";
import { updateUserData } from "../utils/actions/userActions";
import CSNInput from "./CSNInput";

type ProfileInputPropsType = {
  label: string;
  value: string;
  userId: string;
  isPassword?: boolean;
  onChangePassword?: VoidFunction;
};

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const ProfileInput: FC<ProfileInputPropsType> = ({
  label,
  value,
  userId,
  isPassword,
  onChangePassword,
}) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isDisabled, setIsDisabled] = useState(true);
  const [valueState, setValueState] = useState(value);

  const onPress = useCallback(async () => {
    if (isPassword && onChangePassword) {
      onChangePassword();
      return;
    }

    if (isDisabled) {
      setIsDisabled(false);
      return;
    }

    setIsLoading(true);
    await updateUserData(userId, { [label.toLowerCase()]: valueState });
    setIsLoading(false);

    setIsDisabled(true);
    showMessage({
      message: "Updated!",
      type: "success",
      titleStyle: { fontFamily: "Exo2-Bold" },
    });

    return;
  }, [isPassword, onChangePassword, valueState, isDisabled, userId]);

  return (
    <FormControl>
      <HStack justifyContent="space-between" alignItems="center" mb={4}>
        <Text
          color={hexToRgba(colors.white, isDisabled ? 0.5 : 1)}
          fontSize={14}
          lineHeight={17}
        >
          {label}
        </Text>

        {isLoading ? (
          <ShimmerPlaceholder
            width={58}
            height={17}
            style={{ borderRadius: 50 }}
            shimmerColors={[colors.primaryGreen, colors.red, colors.white]}
          />
        ) : (
          <Text
            color={isDisabled ? colors.primaryGreen : colors.red}
            fontSize={14}
            lineHeight={17}
            fontFamily="$bold"
            onPress={onPress}
          >
            {isDisabled ? "Change" : "Deselect"}
          </Text>
        )}
      </HStack>
      {!isPassword && (
        <CSNInput
          placeholder={value}
          onlyInput
          value={valueState}
          onChangeValue={(newValue) => setValueState(newValue)}
          isPassword={isPassword}
          isDisabled={isDisabled}
        />
      )}
    </FormControl>
  );
};

export default ProfileInput;
