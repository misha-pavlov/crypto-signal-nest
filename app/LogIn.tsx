import { View, Text, Button } from "@gluestack-ui/themed";
import { Link } from "expo-router";
import { mmkvStorage } from "../config/mmkvStorage";
import { mmkvStorageKeys } from "../config/constants";
import { withStyledProvider } from "../hocs/withStyledProvider";
import { screens } from "../config/screens";

const Login = () => {
  return (
    <View>
      <Text>Login</Text>

      <Link href={screens.StartScreen} asChild replace>
        <Button
          onPress={() =>
            mmkvStorage.delete(mmkvStorageKeys.wasStartScreenShown)
          }
        >
          <Text> Remove TRUE</Text>
        </Button>
      </Link>
    </View>
  );
};

export default withStyledProvider(Login);
