import {
  FormControl,
  HStack,
  Input,
  InputField,
  Text,
} from "@gluestack-ui/themed";
import { FC, useState } from "react";
import { colors } from "../config/colors";
import { hexToRgba } from "../helpers";
import CSNInput from "./CSNInput";

type ProfileInputPropsType = {
  label: string;
  value?: string;
  showIfSelected?: JSX.Element;
  selectedByDefault?: boolean;
};

const ProfileInput: FC<ProfileInputPropsType> = ({
  label,
  value,
  showIfSelected,
  selectedByDefault,
}) => {
  const [isDisabled, setIsDisabled] = useState(!selectedByDefault);

  return (
    <>
      <FormControl>
        <HStack justifyContent="space-between" alignItems="center" mb={4}>
          <Text
            color={hexToRgba(colors.white, isDisabled ? 0.5 : 1)}
            fontSize={14}
            lineHeight={17}
          >
            {label}
          </Text>
          {!selectedByDefault && (
            <Text
              color={isDisabled ? colors.primaryGreen : colors.red}
              fontSize={14}
              lineHeight={17}
              fontFamily="$bold"
              onPress={() => setIsDisabled((prevValue) => !prevValue)}
            >
              {isDisabled ? "Change" : "Deselect"}
            </Text>
          )}
        </HStack>
        <CSNInput placeholder={label} onlyInput isDisabled={isDisabled} />
      </FormControl>

      {!isDisabled && showIfSelected}
    </>
  );
};

export default ProfileInput;
