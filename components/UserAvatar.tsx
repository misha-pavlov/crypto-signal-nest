import { Avatar, AvatarImage, View } from "@gluestack-ui/themed";
import { FontAwesome5, Feather } from "@expo/vector-icons";
import { FC } from "react";
import { TouchableOpacity } from "react-native";
import { colors } from "../config/colors";

type UserAvatarPropsType = {
  bigSize?: boolean;
  showEditIcon?: boolean;
  uri?: string;
};

const UserAvatar: FC<UserAvatarPropsType> = ({
  bigSize,
  showEditIcon,
  uri,
}) => {
  return (
    <Avatar bgColor={colors.primaryGreen} size={bigSize ? "lg" : "sm"}>
      {uri ? (
        <AvatarImage
          size={bigSize ? "lg" : "sm"}
          borderRadius={50}
          source={{
            uri,
          }}
          alt="user image"
        />
      ) : (
        <View w={64} h={64} justifyContent="center" alignItems="center">
          <FontAwesome5
            name="user-alt"
            size={bigSize ? 40 : 16}
            color={colors.primaryBlack}
          />
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
          <TouchableOpacity>
            <Feather name="edit" size={16} color={colors.white} />
          </TouchableOpacity>
        </View>
      )}
    </Avatar>
  );
};

export default UserAvatar;
