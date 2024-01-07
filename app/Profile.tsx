import { View, Text, ScrollView, Center, VStack } from "@gluestack-ui/themed";
import { useMemo } from "react";
import { colors } from "../config/colors";
import { MembershipPlan, ProfileInput, UserAvatar } from "../components";
import { membershipPlans } from "../config/constants";

const Profile = () => {
  const membershipPlansMemo = useMemo(
    () =>
      membershipPlans.map((membershipPlan) => (
        <MembershipPlan
          key={membershipPlan._id}
          isSelected={membershipPlan._id === "basic"}
          membershipPlan={membershipPlan}
        />
      )),
    []
  );

  return (
    <ScrollView backgroundColor={colors.primaryBlack}>
      <View px={16}>
        {/* HEADER */}
        <Center>
          <UserAvatar bigSize showEditIcon />
          <Text
            mt={16}
            fontFamily="$bold"
            color={colors.white}
            fontSize={16}
            lineHeight={19}
          >
            User Name
          </Text>
        </Center>

        {/* FORM */}
        <Text
          mt={32}
          mb={16}
          fontFamily="$bold"
          color={colors.white}
          fontSize={14}
          lineHeight={17}
        >
          Profile Info
        </Text>

        <VStack space="lg">
          <ProfileInput label="Name" />
          <ProfileInput label="Email" />
          <ProfileInput
            label="Password"
            isPassword
            showIfSelected={
              <ProfileInput
                label="Repeate password"
                selectedByDefault
                isPassword
              />
            }
          />
        </VStack>

        {/* PLANS */}
        <Text
          mt={32}
          mb={16}
          fontFamily="$bold"
          color={colors.white}
          fontSize={14}
          lineHeight={17}
        >
          Membership
        </Text>

        <VStack space="lg">{membershipPlansMemo}</VStack>

        <View mt={32} mb={24}>
          <Text
            textAlign="center"
            fontSize={14}
            lineHeight={17}
            color={colors.white}
          >
            Next Payment due on 22/08/2022
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default Profile;
