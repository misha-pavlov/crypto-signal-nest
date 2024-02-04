import { View, Text, HStack, Center, Divider } from "@gluestack-ui/themed";
import { useNavigation, useRouter } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { TouchableOpacity } from "react-native";
import { Octicons, FontAwesome } from "@expo/vector-icons";
import DraggableFlatList, {
  RenderItemParams,
  ScaleDecorator,
} from "react-native-draggable-flatlist";
import { child, getDatabase, off, onValue, ref } from "firebase/database";
// providers
import { withStyledProvider } from "../hocs/withStyledProvider";
// constants
import { colors } from "../config/colors";
import { screens } from "../config/screens";
// components
import {
  CryptoListItem,
  CryptoSignalNestLoader,
  UserAvatar,
} from "../components";
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

const Main = () => {
  const router = useRouter();
  const navigation = useNavigation();
  const userData = useAppSelector((state) => state.auth.userData);
  const storredUser = useAppSelector((state) => state.user.storredUser);
  const currentUser = storredUser || userData;
  const dispatch = useAppDispatch();
  const [isEdit, setIsEdit] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [selectedList, setSelectedList] = useState<string[]>([]);
  const [cryptoArray, setCryptoArray] = useState<Crypto[]>([]);

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

  useEffect(() => {
    navigation.setOptions({
      headerLeft: withStyledProvider(() =>
        isEdit ? (
          <Text color={colors.red}>Delete({selectedList.length})</Text>
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
            <TouchableOpacity onPress={() => router.push(screens.AddNewCrypto)}>
              <Octicons name="plus" size={20} color={colors.white} />
            </TouchableOpacity>

            <TouchableOpacity onPress={() => setIsEdit(true)}>
              <FontAwesome name="edit" size={20} color={colors.white} />
            </TouchableOpacity>
          </HStack>
        ),
    });
  }, [navigation, isEdit, selectedList, currentUser]);

  const renderItem = useCallback(
    ({ item, drag }: RenderItemParams<Crypto>) => {
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
        <ScaleDecorator>
          <CryptoListItem
            crypto={item}
            showRecommendation={!isEdit}
            isSelectionList={isEdit}
            left={isEdit}
            isSelected={isSelected}
            onLongPress={drag}
            onLeftSelect={onLeftSelect}
            onRowPress={(forecast) =>
              !isEdit
                ? router.push({
                    pathname: screens.Crypto,
                    params: { id, forecast: JSON.stringify(forecast) },
                  })
                : undefined
            }
          />
        </ScaleDecorator>
      );
    },
    [isEdit, selectedList]
  );

  return (
    <View flex={1} backgroundColor={colors.primaryBlack} px={16}>
      <Text fontSize={16} lineHeight={19} color={colors.white} mt={20} mb={24}>
        Watchlist
      </Text>

      {isLoading ? (
        <Center>
          <CryptoSignalNestLoader />
        </Center>
      ) : (
        <>
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

          <DraggableFlatList
            data={cryptoArray}
            onDragEnd={({ data }) => setCryptoArray(data)}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            ItemSeparatorComponent={() => (
              <Divider h={1} backgroundColor={colors.grey} my={9} />
            )}
            ListFooterComponent={() =>
              !isEdit ? (
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
              ) : null
            }
            ListEmptyComponent={
              <Center>
                <EmptySvg />
              </Center>
            }
          />
        </>
      )}
    </View>
  );
};

export default Main;
