import { View, Text, ScrollView, Center, VStack } from "@gluestack-ui/themed";
import { colors } from "../config/colors";
import { ProfileInput, UserAvatar } from "../components";

const Profile = () => {
  return (
    <ScrollView backgroundColor={colors.primaryBlack}>
      <View px={16}>
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
            showIfSelected={
              <ProfileInput label="Repeate password" selectedByDefault />
            }
          />
        </VStack>
      </View>
    </ScrollView>
  );
};

export default Profile;
