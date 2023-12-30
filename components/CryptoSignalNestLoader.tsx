import { Center } from "@gluestack-ui/themed";
import LottieView from "lottie-react-native";
import { FC, useEffect, useRef } from "react";
import { colors } from "../config/colors";

type CryptoSignalNestLoaderPropsType = {
  backgroundColor?: string;
};

const CryptoSignalNestLoader: FC<CryptoSignalNestLoaderPropsType> = ({
  backgroundColor = colors.primaryBlack,
}) => {
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
          backgroundColor,
        }}
        source={require("../assets/lottie/loader.json")}
      />
    </Center>
  );
};

export default CryptoSignalNestLoader;
