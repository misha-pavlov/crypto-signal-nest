import { Avatar, AvatarImage, View } from "@gluestack-ui/themed";
import { FontAwesome5, Feather } from "@expo/vector-icons";
import { FC, useCallback, useState } from "react";
import { TouchableOpacity } from "react-native";
import { customEvent } from "vexo-analytics";
import { showMessage } from "react-native-flash-message";
import { colors } from "../config/colors";
import { launchImagePicker, uploadImage } from "../helpers/imagePickerHelpers";
import { updateUserData } from "../utils/actions/userActions";
import CryptoSignalNestLoader from "./CryptoSignalNestLoader";

type UserAvatarPropsType = {
  userId?: string;
  bigSize?: boolean;
  showEditIcon?: boolean;
  uri?: string | null;
};

const UserAvatar: FC<UserAvatarPropsType> = ({
  userId,
  bigSize,
  showEditIcon,
  uri,
}) => {
  const [image, setImage] = useState(uri);
  const [isLoading, setIsLoading] = useState(false);

  const pickImage = useCallback(async () => {
    try {
      const image = await launchImagePicker();

      if (!image) return;

      setIsLoading(true);
      const uploadedUri = await uploadImage(
        image.uri,
        image?.fileName ||
          image.uri.split("/")[image.uri.split("/").length - 1],
        "avatars"
      );
      setIsLoading(false);

      if (!uploadedUri) {
        throw new Error("Could not upload image");
      }

      if (userId) {
        await updateUserData(userId, { avatar: uploadedUri });
      }

      setImage(uploadedUri);
    } catch (error) {
      const message = "Something went wrong with uploading image";
      customEvent(message, error);
      showMessage({
        message,
        type: "danger",
        titleStyle: { fontFamily: "Exo2-Bold" },
      });
      setIsLoading(false);
    }
  }, [userId]);

  return (
    <Avatar
      bgColor={isLoading ? colors.primaryBlack : colors.primaryGreen}
      size={bigSize ? "lg" : "sm"}
    >
      {image && !isLoading ? (
        <AvatarImage
          size={bigSize ? "lg" : "sm"}
          borderRadius={50}
          source={{
            uri: image,
          }}
          alt="user image"
        />
      ) : (
        <View w={64} h={64} justifyContent="center" alignItems="center">
          {isLoading ? (
            <CryptoSignalNestLoader />
          ) : (
            <FontAwesome5
              name="user-alt"
              size={bigSize ? 40 : 16}
              color={colors.primaryBlack}
            />
          )}
        </View>
      )}

      {showEditIcon && (
        <View
          position="absolute"
          alignItems="center"
          justifyContent="center"
          backgroundColor={colors.grey}
          borderRadius={50}
          w={28}
          h={28}
          top={40}
          left={40}
        >
          <TouchableOpacity onPress={pickImage}>
            <Feather name="edit" size={16} color={colors.white} />
          </TouchableOpacity>
        </View>
      )}
    </Avatar>
  );
};

export default UserAvatar;
