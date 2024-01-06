import { Avatar, AvatarBadge, AvatarImage } from "@gluestack-ui/themed";
import { FontAwesome5, FontAwesome } from "@expo/vector-icons";
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
        <FontAwesome5
          name="user-alt"
          size={bigSize ? 45 : 16}
          color={colors.primaryBlack}
        />
      )}

      {showEditIcon && (
        <AvatarBadge
          borderColor={colors.primaryBlack}
          alignItems="center"
          justifyContent="center"
          backgroundColor={colors.grey}
          w={25}
          h={25}
          top={43}
          left={45}
        >
          <TouchableOpacity>
            <FontAwesome name="edit" size={12} color={colors.white} />
          </TouchableOpacity>
        </AvatarBadge>
      )}
    </Avatar>
  );
};

export default UserAvatar;
