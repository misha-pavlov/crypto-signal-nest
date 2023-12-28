import { Avatar } from "@gluestack-ui/themed";
import { FontAwesome5 } from "@expo/vector-icons";
import { FC } from "react";
import { colors } from "../config/colors";

type UserAvatarPropsType = {
  bigSize?: boolean;
};

const UserAvatar: FC<UserAvatarPropsType> = ({ bigSize }) => {
  return (
    <Avatar bgColor={colors.primaryGreen} size="sm">
      <FontAwesome5 name="user-alt" size={16} color={colors.primaryBlack} />
    </Avatar>
  );
};

export default UserAvatar;
