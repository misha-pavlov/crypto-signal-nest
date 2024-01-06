import {
  FormControl,
  FormControlLabel,
  FormControlLabelText,
  Icon,
  Input,
  InputField,
  InputSlot,
  MailIcon,
} from "@gluestack-ui/themed";
import { FC } from "react";
import { colors } from "../config/colors";
import { hexToRgba } from "../helpers";

type CSNInputPropsType = {
  placeholder: string;
  label?: string;
  leftIcon?: typeof MailIcon;
  isRequired?: boolean;
  isPassword?: boolean;
  onlyInput?: boolean;
  type?: "password";
  isDisabled?: boolean;
};

const CSNInput: FC<CSNInputPropsType> = ({
  label,
  placeholder,
  isPassword,
  leftIcon,
  isRequired,
  onlyInput,
  isDisabled,
}) => (
  <FormControl isRequired={isRequired}>
    {!onlyInput && (
      <FormControlLabel mb="$1">
        <FormControlLabelText color={colors.white} fontSize={14}>
          {label}
        </FormControlLabelText>
      </FormControlLabel>
    )}
    <Input
      variant="outline"
      size="md"
      isRequired={isRequired}
      backgroundColor={colors.grey}
      borderColor={colors.grey}
      isDisabled={isDisabled}
    >
      {leftIcon && (
        <InputSlot>
          <Icon
            as={leftIcon}
            w={20}
            h={20}
            ml={8}
            color={hexToRgba(colors.white, 0.5)}
          />
        </InputSlot>
      )}
      <InputField
        placeholder={placeholder}
        color={colors.white}
        type={isPassword ? "password" : undefined}
      />
    </Input>
  </FormControl>
);

export default CSNInput;
