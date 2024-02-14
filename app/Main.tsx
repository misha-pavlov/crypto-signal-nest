import {
  View,
  Text,
  HStack,
  Center,
  Divider,
  ScrollView,
} from "@gluestack-ui/themed";
import { useNavigation, useRouter } from "expo-router";
import { Fragment, useCallback, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Octicons, FontAwesome } from "@expo/vector-icons";
import { child, getDatabase, off, onValue, ref } from "firebase/database";
import { find } from "lodash";
// providers
import { withStyledProvider } from "../hocs/withStyledProvider";
// constants
import { colors } from "../config/colors";
import { screens } from "../config/screens";
import { membershipPlans } from "../config/constants";
// components
import { CryptoListItem, UserAvatar } from "../components";
import EmptySvg from "../assets/svg/EmptySvg";
// helpers
import { hexToRgba } from "../helpers";
import { getFirebaseApp } from "../helpers/firebaseHelpers";
// types
import { Crypto } from "../types/Crypto.types";
// hooks
import { useAppDispatch, useAppSelector } from "../store/store";
// store
import { setStoredUser } from "../store/userSlice";
// utils
import { updateUserData } from "../utils/actions/userActions";

const Main = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const userData = useAppSelector((state) => state.auth.userData);
  const storredUser = useAppSelector((state) => state.user.storredUser);
  const dispatch = useAppDispatch();

  const currentUser = storredUser || userData;
  const userCryptoList: Crypto[] = JSON.parse(currentUser?.cryptoList || "");
  const userId = currentUser?._id;
  const currentUserPlan =
    find(membershipPlans, ({ _id }) => _id === currentUser?.plan) ||
    membershipPlans[0];
  const isAdmin = currentUser?.isAdmin;
  const showAddCrypto =
    isAdmin || currentUserPlan?.limit > userCryptoList.length;

  const [isEdit, setIsEdit] = useState(false);
  const [selectedList, setSelectedList] = useState<string[]>([]);

  // user subscription
  useEffect(() => {
    console.log("Subscribe to user data");
    const app = getFirebaseApp();
    const dbRef = ref(getDatabase(app));
    const userChatsRef = child(dbRef, `users/${userData?._id}`);
    const refs = [userChatsRef];

    onValue(userChatsRef, (querySnapshot) => {
      dispatch(setStoredUser({ user: querySnapshot.val() }));
    });

    () => {
      console.log("Unsubscribe to user chats");
      refs.forEach((ref) => off(ref));
    };
  }, []);

  // header
  useEffect(() => {
    navigation.setOptions({
      headerLeft: withStyledProvider(() =>
        isEdit ? (
          <Text
            color={colors.red}
            onPress={() =>
              userId &&
              updateUserData(userId, {
                cryptoList: JSON.stringify(
                  userCryptoList.filter(
                    (userCrypto) => !selectedList.includes(userCrypto.id)
                  )
                ),
              })
            }
          >
            Delete({selectedList.length})
          </Text>
        ) : (
          <TouchableOpacity onPress={() => router.push(screens.Profile)}>
            <HStack alignItems="center" space="md">
              <UserAvatar uri={currentUser?.avatar} />
              <Text fontSize={12} lineHeight={14} color={colors.white}>
                Welcome {currentUser?.name}!
              </Text>
            </HStack>
          </TouchableOpacity>
        )
      ),
      headerRight: () =>
        isEdit ? (
          <Text
            color={colors.primaryGreen}
            onPress={() => {
              setIsEdit(false);
              setSelectedList([]);
            }}
          >
            Done
          </Text>
        ) : (
          <HStack alignItems="center" space="lg">
            {showAddCrypto && (
              <TouchableOpacity
                onPress={() => router.push(screens.AddNewCrypto)}
              >
                <Octicons name="plus" size={20} color={colors.white} />
              </TouchableOpacity>
            )}

            <TouchableOpacity onPress={() => setIsEdit(true)}>
              <FontAwesome name="edit" size={20} color={colors.white} />
            </TouchableOpacity>
          </HStack>
        ),
    });
  }, [navigation, isEdit, selectedList, currentUser, showAddCrypto]);

  const renderItem = useCallback(
    ({ item }: { item: Crypto }) => {
      const id = item.id;
      const isSelected = selectedList.includes(id);

      const onLeftSelect = () => {
        let newArray: string[] = [];

        if (isSelected) {
          newArray = selectedList.filter((sl) => sl !== id);
        } else {
          newArray = [...selectedList, id];
        }

        setSelectedList(newArray);
      };

      return (
        <CryptoListItem
          crypto={item}
          showRecommendation={!isEdit}
          isSelectionList={isEdit}
          left={isEdit}
          isSelected={isSelected}
          // onLongPress={drag}
          onLeftSelect={onLeftSelect}
          {...(!isEdit && {
            onRowPress: (forecast) =>
              router.push({
                pathname: screens.Crypto,
                params: {
                  crypto: JSON.stringify(item),
                  forecast: JSON.stringify(forecast),
                },
              }),
          })}
        />
      );
    },
    [isEdit, selectedList]
  );

  return (
    <View flex={1} backgroundColor={colors.primaryBlack} px={16}>
      <Text fontSize={16} lineHeight={19} color={colors.white} mt={20} mb={24}>
        Watchlist
      </Text>

      <HStack alignItems="center" mb={16}>
        <Text
          pr="35%"
          fontSize={12}
          lineHeight={14}
          color={hexToRgba(colors.white, 0.7)}
        >
          Crypto
        </Text>

        {!isEdit && (
          <>
            <Text
              pr="17%"
              fontSize={12}
              lineHeight={14}
              color={hexToRgba(colors.white, 0.7)}
            >
              Recommendation
            </Text>

            <Text
              fontSize={12}
              lineHeight={14}
              color={hexToRgba(colors.white, 0.7)}
            >
              24h %
            </Text>
          </>
        )}
      </HStack>

      {/* FIXME: FIX THE TROUBLE WITH DRAGABLE LIST = https://github.com/facebook/react-native/issues/34783 */}
      {/* <DraggableFlatList
        data={userCryptoList}
        onDragEnd={({ data }) =>
          userId && updateUserData(userId, { cryptoList: JSON.stringify(data) })
        }
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ItemSeparatorComponent={() => (
          <Divider h={1} backgroundColor={colors.grey} my={9} />
        )}
        ListFooterComponent={() =>
          !isEdit && showAddCrypto ? (
            <Center mt={32}>
              <TouchableOpacity
                onPress={() => router.push(screens.AddNewCrypto)}
              >
                <HStack alignItems="center">
                  <Octicons name="plus" size={20} color={colors.primaryGreen} />
                  <Text
                    fontSize={16}
                    lineHeight={18}
                    color={colors.primaryGreen}
                    pl={4}
                  >
                    Add crypto
                  </Text>
                </HStack>
              </TouchableOpacity>
            </Center>
          ) : null
        }
        ListEmptyComponent={
          <Center>
            <EmptySvg />
          </Center>
        }
      /> */}
      <ScrollView>
        {userCryptoList.length === 0 ? (
          <Center>
            <EmptySvg />
          </Center>
        ) : (
          userCryptoList.map((item, index, array) => {
            return (
              <Fragment key={item.id}>
                {renderItem({ item })}
                {index !== array.length - 1 && (
                  <Divider h={1} backgroundColor={colors.grey} my={9} />
                )}
                {index === array.length - 1 && !isEdit && showAddCrypto ? (
                  <Center mt={32}>
                    <TouchableOpacity
                      onPress={() => router.push(screens.AddNewCrypto)}
                    >
                      <HStack alignItems="center">
                        <Octicons
                          name="plus"
                          size={20}
                          color={colors.primaryGreen}
                        />
                        <Text
                          fontSize={16}
                          lineHeight={18}
                          color={colors.primaryGreen}
                          pl={4}
                        >
                          Add crypto
                        </Text>
                      </HStack>
                    </TouchableOpacity>
                  </Center>
                ) : null}
              </Fragment>
            );
          })
        )}
      </ScrollView>
    </View>
  );
};

export default Main;
