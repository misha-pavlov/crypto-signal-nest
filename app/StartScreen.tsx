import { View, Text, Button } from "@gluestack-ui/themed";
import { Link } from "expo-router";
import { mmkvStorageKeys } from "../config/constants";
import { mmkvStorage } from "./mmkvStorage";
import { withStyledProvider } from "../hocs/withStyledProvider";
import { screens } from "../config/screens";

const StartScreen = () => {
  return (
    <View pt={80}>
      <Text>StartScreen</Text>

      <Link href={screens.LogIn} asChild replace>
        <Button
          onPress={() =>
            mmkvStorage.set(mmkvStorageKeys.wasStartScreenShown, true)
          }
        >
          <Text> SET TRUE</Text>
        </Button>
      </Link>
    </View>
  );
};

export default withStyledProvider(StartScreen);
