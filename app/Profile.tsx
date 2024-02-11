import {
  View,
  Text,
  ScrollView,
  Center,
  VStack,
  Button,
} from "@gluestack-ui/themed";
import { useCallback, useMemo } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useRouter } from "expo-router";
import { getAuth, sendPasswordResetEmail } from "firebase/auth";
import { showMessage } from "react-native-flash-message";
import { colors } from "../config/colors";
import {
  CryptoSignalNestLoader,
  MembershipPlan,
  ProfileInput,
  UserAvatar,
} from "../components";
import { membershipPlans } from "../config/constants";
import { useAppDispatch, useAppSelector } from "../store/store";
import { userLogout } from "../utils/actions/authActions";
import { screens } from "../config/screens";
import { getFirebaseApp } from "../helpers/firebaseHelpers";

const Profile = () => {
  const router = useRouter();
  const dispatch = useAppDispatch();
  const storredUser = useAppSelector((state) => state.user.storredUser);
  const userId = storredUser?._id;
  const email = storredUser?.email;

  const membershipPlansMemo = useMemo(
    () =>
      userId &&
      membershipPlans.map((membershipPlan) => (
        <MembershipPlan
          userId={userId}
          key={membershipPlan._id}
          isSelected={membershipPlan._id === storredUser?.plan}
          membershipPlan={membershipPlan}
        />
      )),
    [storredUser]
  );

  const onChangePassword = useCallback(async () => {
    const app = getFirebaseApp();
    const auth = getAuth(app);

    if (email) {
      await sendPasswordResetEmail(auth, email);

      showMessage({
        message: "We sent a mail with reseting password on your email",
        type: "info",
        titleStyle: { fontFamily: "Exo2-Bold" },
      });
    }
  }, [email]);

  if (!storredUser) {
    return (
      <Center flex={1} backgroundColor={colors.primaryBlack}>
        <CryptoSignalNestLoader />
      </Center>
    );
  }

  return (
    <ScrollView backgroundColor={colors.primaryBlack}>
      <View px={16}>
        {/* HEADER */}
        <Center>
          <UserAvatar
            bigSize
            showEditIcon
            uri={storredUser?.avatar}
            userId={storredUser._id}
          />
          <Text
            mt={16}
            fontFamily="$bold"
            color={colors.white}
            fontSize={16}
            lineHeight={19}
          >
            {storredUser.name}
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
          <ProfileInput
            label="Name"
            userId={storredUser._id}
            value={storredUser.name}
          />
          <ProfileInput
            label="Email"
            userId={storredUser._id}
            value={storredUser.email}
          />
          <ProfileInput
            label="Password"
            value="Password"
            isPassword
            userId={storredUser._id}
            onChangePassword={onChangePassword}
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

        <TouchableOpacity
          onPress={() => {
            dispatch(userLogout());
            router.replace(screens.StartScreen);
          }}
        >
          <Button backgroundColor={colors.red} mb={32}>
            <Text fontFamily="$bold" color={colors.white}>
              Log out
            </Text>
          </Button>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default Profile;
