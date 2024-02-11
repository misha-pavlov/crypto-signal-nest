import { View, Text, HStack } from "@gluestack-ui/themed";
import { FC } from "react";
import { Octicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { MembershipPlanType } from "../types/User.type";
import { colors } from "../config/colors";
import { hexToRgba } from "../helpers";
import { updateUserData } from "../utils/actions/userActions";

type MembershipPlanPropsType = {
  userId: string;
  membershipPlan: MembershipPlanType;
  isSelected?: boolean;
};

const MembershipPlan: FC<MembershipPlanPropsType> = ({
  userId,
  membershipPlan,
  isSelected,
}) => (
  <TouchableOpacity
    disabled={isSelected}
    onPress={() => updateUserData(userId, { plan: membershipPlan._id })}
  >
    <View
      borderWidth={2}
      borderColor={
        isSelected ? colors.primaryGreen : hexToRgba(colors.white, 0.5)
      }
      borderRadius={10}
      p={16}
      backgroundColor={
        isSelected
          ? hexToRgba(colors.primaryGreen, 0.1)
          : hexToRgba(colors.white, 0.1)
      }
    >
      <HStack justifyContent="space-between" alignItems="center">
        <View>
          <Text
            color={isSelected ? colors.primaryGreen : colors.white}
            fontFamily="$bold"
            fontSize={14}
            lineHeight={17}
          >
            {membershipPlan.name}
          </Text>

          <Text color={colors.white} fontSize={14} lineHeight={17} mt={8}>
            {membershipPlan.desc}
          </Text>

          <Text
            color={colors.white}
            fontFamily="$bold"
            fontSize={14}
            lineHeight={17}
            mt={4}
          >
            {membershipPlan.price}
          </Text>
        </View>

        <View alignItems="center">
          <View
            borderWidth={1}
            borderColor={
              isSelected ? colors.primaryGreen : hexToRgba(colors.white, 0.5)
            }
            backgroundColor={
              isSelected ? colors.primaryGreen : hexToRgba(colors.white, 0.1)
            }
            w={20}
            h={20}
            borderRadius="$full"
            alignItems="center"
            justifyContent="center"
          >
            <Octicons
              name="check"
              size={14}
              color={
                isSelected ? colors.primaryBlack : hexToRgba(colors.white, 0.1)
              }
            />
          </View>
        </View>
      </HStack>
    </View>
  </TouchableOpacity>
);

export default MembershipPlan;
