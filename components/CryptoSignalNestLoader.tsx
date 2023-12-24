import { Center } from "@gluestack-ui/themed";
import LottieView from "lottie-react-native";
import { useEffect, useRef } from "react";
import { colors } from "../config/colors";

const CryptoSignalNestLoader = () => {
  const animation = useRef<LottieView>(null);

  useEffect(() => {
    animation.current?.play();
  }, []);

  return (
    <Center w={200} h={200}>
      <LottieView
        autoPlay
        ref={animation}
        resizeMode="cover"
        autoSize
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: colors.primaryBlack,
        }}
        source={require("../assets/lottie/loader.json")}
      />
    </Center>
  );
};

export default CryptoSignalNestLoader;
