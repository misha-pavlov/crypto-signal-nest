import { HStack, View, Text } from "@gluestack-ui/themed";
import FastImage from "react-native-fast-image";
import { FC, memo, useEffect, useState } from "react";
import { LineGraph } from "react-native-graph";
import { Octicons } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native";
import { createShimmerPlaceholder } from "react-native-shimmer-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import { colors } from "../config/colors";
import {
  getPriceHistory,
  getTimePrices,
  hexToRgba,
  trainAndPredict,
  getPercentAndColor,
} from "../helpers";
import { Crypto } from "../types/Crypto.types";

type CryptoListItemPropsType = {
  crypto: Crypto;
  showRecommendation?: boolean;
  isSelectionList?: boolean;
  left?: boolean;
  right?: boolean;
  isSelected?: boolean;
  onLongPress?: VoidFunction;
  onLeftSelect?: VoidFunction;
  onRightSelect?: VoidFunction;
  onRowPress?: VoidFunction;
};

const ShimmerPlaceholder = createShimmerPlaceholder(LinearGradient);

const CryptoListItem: FC<CryptoListItemPropsType> = ({
  showRecommendation,
  isSelectionList,
  left,
  right,
  isSelected,
  crypto,
  onLongPress,
  onLeftSelect,
  onRightSelect,
  onRowPress,
}) => {
  const [forecast, setForecast] = useState({
    buyPercentage: 0,
    sellPercentage: 0,
    holdPercentage: 0,
  });
  const [isRecommendationLoading, setIsRecommendationLoading] = useState(true);

  useEffect(() => {
    if (showRecommendation) {
      const abortController = new AbortController();

      const forecast = async () => {
        const timePrices = getTimePrices(chartMock);
        const predictTime = new Date(+new Date() + 86400000).getTime() / 1000;
        const result = await trainAndPredict(timePrices, predictTime);
        setForecast(result);
        setIsRecommendationLoading(false);
      };

      forecast();

      () => abortController.abort();
    }
  }, [showRecommendation]);

  const recommendation = showRecommendation
    ? getPercentAndColor(forecast)
    : null;
  const chartColor = recommendation?.color || colors.primaryBlack;

  return (
    <TouchableOpacity onLongPress={onLongPress} disabled={!!!onRowPress}>
      <HStack
        alignItems="center"
        justifyContent={isSelectionList && right ? "space-between" : undefined}
      >
        {isSelectionList && left && (
          <TouchableOpacity onPress={onLeftSelect}>
            <View
              borderWidth={1}
              borderColor={isSelected ? colors.primaryGreen : colors.white}
              backgroundColor={
                isSelected ? colors.primaryGreen : colors.primaryBlack
              }
              w={20}
              h={20}
              borderRadius="$full"
              mr={16}
              alignItems="center"
              justifyContent="center"
            >
              <Octicons name="check" size={14} color={colors.primaryBlack} />
            </View>
          </TouchableOpacity>
        )}

        <HStack alignItems="center" space="sm" w={100} mr="22%">
          <FastImage
            style={{ width: 28, height: 28 }}
            source={{
              uri: crypto.icon,
              priority: FastImage.priority.high,
            }}
            resizeMode={FastImage.resizeMode.contain}
          />

          <View>
            <Text color={colors.white} fontSize={14} lineHeight={17}>
              {crypto.name}
            </Text>
            <Text
              color={hexToRgba(colors.white, 0.5)}
              fontSize={14}
              lineHeight={17}
            >
              {crypto.symbol}
            </Text>
          </View>
        </HStack>

        {showRecommendation && !isSelectionList && (
          <View mr="10%">
            {isRecommendationLoading ? (
              <ShimmerPlaceholder
                width={57}
                style={{ borderRadius: 50 }}
                shimmerColors={[colors.primaryGreen, colors.red, colors.white]}
              />
            ) : (
              <Text
                fontSize={14}
                lineHeight={17}
                fontFamily="$bold"
                color={recommendation?.color}
              >
                {recommendation?.percent}% {recommendation?.action}
              </Text>
            )}
          </View>
        )}

        {showRecommendation && !isSelectionList && (
          <View>
            {isRecommendationLoading ? (
              <ShimmerPlaceholder
                width={87}
                style={{ borderRadius: 50 }}
                shimmerColors={[colors.primaryGreen, colors.red, colors.white]}
              />
            ) : (
              <LineGraph
                points={getPriceHistory(chartMock)}
                color={chartColor}
                enableFadeInMask
                animated
                lineThickness={1}
                style={{ width: 87, height: 37 }}
                gradientFillColors={[
                  hexToRgba(chartColor, 0.2),
                  hexToRgba(chartColor, 0.1),
                  hexToRgba(chartColor, 0.1),
                ]}
              />
            )}
          </View>
        )}

        {isSelectionList && right && (
          <TouchableOpacity onPress={onRightSelect}>
            <View>
              <Octicons
                name={isSelected ? "check" : "plus"}
                size={20}
                color={colors.white}
              />
            </View>
          </TouchableOpacity>
        )}
      </HStack>
    </TouchableOpacity>
  );
};

export default memo(CryptoListItem);

const chartMock = [
  [1703892300, 41975.2257, 1, 18.2977],
  [1703892600, 41977.7576, 1, 18.2845],
  [1703892900, 41972.8818, 1, 18.2781],
  [1703893200, 41993.3699, 1, 18.2825],
  [1703893500, 42009.6595, 1, 18.2822],
  [1703893800, 42008.0507, 1, 18.2839],
  [1703894100, 42049.6752, 1, 18.2807],
  [1703894400, 42072.6223, 1, 18.2887],
  [1703894700, 42042.3715, 1, 18.298],
  [1703895000, 42081.8913, 1, 18.3015],
  [1703895300, 42097.893, 1, 18.3005],
  [1703895600, 42135.3458, 1, 18.2934],
  [1703895900, 42144.1997, 1, 18.2945],
  [1703896200, 42166.3831, 1, 18.2975],
  [1703896500, 42110.5949, 1, 18.3111],
  [1703896800, 42142.0075, 1, 18.3155],
  [1703897100, 42126.3499, 1, 18.3013],
  [1703897400, 42137.5303, 1, 18.2986],
  [1703897700, 42153.0733, 1, 18.2896],
  [1703898000, 42103.2488, 1, 18.2855],
  [1703898300, 42087.1046, 1, 18.278],
  [1703898600, 42100.0753, 1, 18.2768],
  [1703898900, 42094.5086, 1, 18.2701],
  [1703899200, 42115.1083, 1, 18.2648],
  [1703899500, 42122.0342, 1, 18.2598],
  [1703899800, 42131.413, 1, 18.2648],
  [1703900100, 42178.8955, 1, 18.2658],
  [1703900400, 42192.3978, 1, 18.287],
  [1703900700, 42183.4586, 1, 18.2884],
  [1703901000, 42195.0475, 1, 18.2839],
  [1703901300, 42173.4878, 1, 18.2734],
  [1703901600, 42162.5894, 1, 18.269],
  [1703901900, 42182.6356, 1, 18.2848],
  [1703902200, 42159.3137, 1, 18.2827],
  [1703902500, 42131.3527, 1, 18.2834],
  [1703902800, 42145.4939, 1, 18.2846],
  [1703903100, 42180.9914, 1, 18.2743],
  [1703903400, 42153.4652, 1, 18.2794],
  [1703903700, 42104.5143, 1, 18.2862],
  [1703904000, 42049.98, 1, 18.2853],
  [1703904300, 41973.726, 1, 18.2818],
  [1703904600, 41961.2669, 1, 18.276],
  [1703904900, 41901.1714, 1, 18.2695],
  [1703905200, 41905.3821, 1, 18.2625],
  [1703905500, 41976.9684, 1, 18.2624],
  [1703905800, 41999.0343, 1, 18.2546],
  [1703906100, 41978.7706, 1, 18.2639],
  [1703906400, 41885.6294, 1, 18.2605],
  [1703906700, 41856.6257, 1, 18.259],
  [1703907000, 41830.4894, 1, 18.2721],
  [1703907300, 41876.3057, 1, 18.2671],
  [1703907600, 41936.41, 1, 18.2685],
  [1703907900, 41942.3542, 1, 18.2678],
  [1703908200, 41949.8933, 1, 18.2556],
  [1703908500, 41970.957, 1, 18.2682],
  [1703908800, 41977.2157, 1, 18.2568],
  [1703909100, 41996.5369, 1, 18.2555],
  [1703909400, 42029.6387, 1, 18.2512],
  [1703909700, 42024.397, 1, 18.2688],
  [1703910000, 42031.1769, 1, 18.2701],
  [1703910300, 42013.0643, 1, 18.2562],
  [1703910600, 42008.8363, 1, 18.2541],
  [1703910900, 42006.3376, 1, 18.2535],
  [1703911200, 42030.3378, 1, 18.2363],
  [1703911500, 42034.9136, 1, 18.2364],
  [1703911800, 42010.4913, 1, 18.236],
  [1703912100, 41975.3412, 1, 18.234],
  [1703912400, 41993.6328, 1, 18.2346],
  [1703912700, 42050.3289, 1, 18.2406],
  [1703913000, 42048.9266, 1, 18.2527],
  [1703913300, 42033.948, 1, 18.2436],
  [1703913600, 42088.96, 1, 18.2326],
  [1703913900, 42072.1956, 1, 18.255],
  [1703914200, 42069.1963, 1, 18.2571],
  [1703914500, 42063.445, 1, 18.2544],
  [1703914800, 42069.9469, 1, 18.255],
  [1703915100, 42070.6045, 1, 18.235],
  [1703915400, 42084.6426, 1, 18.2383],
  [1703915700, 42099.9626, 1, 18.2437],
  [1703916000, 42095.0281, 1, 18.2391],
  [1703916300, 42104.053, 1, 18.2432],
  [1703916600, 42110.9804, 1, 18.2503],
  [1703916900, 42112.9873, 1, 18.2485],
  [1703917200, 42085.663, 1, 18.258],
  [1703917500, 42041.6156, 1, 18.2566],
  [1703917800, 42041.0728, 1, 18.253],
  [1703918100, 42045.5371, 1, 18.2476],
  [1703918400, 42053.1579, 1, 18.2607],
  [1703918700, 42060.4404, 1, 18.2574],
  [1703919000, 42086.6362, 1, 18.2556],
  [1703919300, 42064.2828, 1, 18.2476],
  [1703919600, 42041.6611, 1, 18.2465],
  [1703919900, 42048.863, 1, 18.2431],
  [1703920200, 42066.0558, 1, 18.2581],
  [1703920500, 42069.8995, 1, 18.2563],
  [1703920800, 42112.8212, 1, 18.2658],
  [1703921100, 42049.9005, 1, 18.2516],
  [1703921400, 42003.6429, 1, 18.248],
  [1703921700, 42002.5903, 1, 18.2505],
  [1703922000, 42000.4461, 1, 18.2623],
  [1703922300, 41979.1687, 1, 18.2576],
  [1703922600, 41963.1839, 1, 18.265],
  [1703922900, 41958.5105, 1, 18.2709],
  [1703923200, 41948.7756, 1, 18.2691],
  [1703923500, 41925.0796, 1, 18.2619],
  [1703923800, 41967.1223, 1, 18.2748],
  [1703924100, 41956.6432, 1, 18.2667],
  [1703924400, 41891.5294, 1, 18.3044],
  [1703924700, 41858.6048, 1, 18.3051],
  [1703925000, 41840.8093, 1, 18.3264],
  [1703925300, 41832.8703, 1, 18.2997],
  [1703925600, 41785.8756, 1, 18.3191],
  [1703925900, 41762.0463, 1, 18.3186],
  [1703926200, 41735.439, 1, 18.3111],
  [1703926500, 41640.142, 1, 18.3094],
  [1703926800, 41609.2111, 1, 18.2814],
  [1703927100, 41680.2251, 1, 18.2768],
  [1703927400, 41652.3396, 1, 18.2836],
  [1703927700, 41586.966, 1, 18.2705],
  [1703928000, 41616.4324, 1, 18.2675],
  [1703928300, 41633.6868, 1, 18.273],
  [1703928600, 41585.4154, 1, 18.2639],
  [1703928900, 41640.9917, 1, 18.2613],
  [1703929200, 41592.8542, 1, 18.2801],
  [1703929500, 41542.2166, 1, 18.2968],
  [1703929800, 41607.8605, 1, 18.2811],
  [1703930100, 41651.2853, 1, 18.2729],
  [1703930400, 41687.9173, 1, 18.2912],
  [1703930700, 41731.8217, 1, 18.284],
  [1703931000, 41711.5188, 1, 18.2847],
  [1703931300, 41721.0331, 1, 18.2831],
  [1703931600, 41677.6518, 1, 18.2814],
  [1703931900, 41697.045, 1, 18.2896],
  [1703932200, 41725.6559, 1, 18.2722],
  [1703932500, 41718.1872, 1, 18.2741],
  [1703932800, 41732.4015, 1, 18.259],
  [1703933100, 41767.7374, 1, 18.262],
  [1703933400, 41804.6304, 1, 18.2646],
  [1703933700, 41767.4867, 1, 18.2498],
  [1703934000, 41802.4495, 1, 18.2775],
  [1703934300, 41859.8222, 1, 18.28],
  [1703934600, 41887.0828, 1, 18.2909],
  [1703934900, 41933.3767, 1, 18.2893],
  [1703935200, 41902.5195, 1, 18.2966],
  [1703935500, 41920.4288, 1, 18.2904],
  [1703935800, 41882.311, 1, 18.3076],
  [1703936100, 41862.7982, 1, 18.3045],
  [1703936400, 41856.9178, 1, 18.3053],
  [1703936700, 41880.1335, 1, 18.3146],
  [1703937000, 41902.325, 1, 18.3038],
  [1703937300, 41904.5061, 1, 18.3081],
  [1703937600, 41896.4426, 1, 18.3128],
  [1703937900, 41908.215, 1, 18.2927],
  [1703938200, 41944.8943, 1, 18.2947],
  [1703938500, 42004.2411, 1, 18.3003],
  [1703938800, 42000.3977, 1, 18.2873],
  [1703939100, 41977.4933, 1, 18.3054],
  [1703939400, 42055.1714, 1, 18.3158],
  [1703939700, 42003.829, 1, 18.298],
  [1703940000, 41979.0015, 1, 18.3263],
  [1703940300, 41937.9429, 1, 18.3219],
  [1703940600, 41972.6784, 1, 18.32],
  [1703940900, 41979.0443, 1, 18.3044],
  [1703941200, 41979.5949, 1, 18.3152],
  [1703941500, 42014.4519, 1, 18.3177],
  [1703941800, 41997.0895, 1, 18.3339],
  [1703942100, 41951.9966, 1, 18.3352],
  [1703942400, 41902.8827, 1, 18.3299],
  [1703942700, 41920.3151, 1, 18.3387],
  [1703943000, 41937.9961, 1, 18.3282],
  [1703943300, 41946.54, 1, 18.3316],
  [1703943600, 41979.0536, 1, 18.2972],
  [1703943900, 41967.483, 1, 18.3025],
  [1703944200, 41949.0586, 1, 18.3053],
  [1703944500, 41950.8948, 1, 18.3206],
  [1703944800, 42009.9671, 1, 18.3147],
  [1703945100, 42131.6709, 1, 18.3368],
  [1703945400, 42168.1429, 1, 18.352],
  [1703945700, 42186.4206, 1, 18.3461],
  [1703946000, 42163.7785, 1, 18.3493],
  [1703946300, 42101.1, 1, 18.3703],
  [1703946600, 42096.933, 1, 18.3558],
  [1703946900, 42104.3287, 1, 18.3347],
  [1703947200, 42079.492, 1, 18.3475],
  [1703947500, 42127.4352, 1, 18.3557],
  [1703947800, 42189.5106, 1, 18.3458],
  [1703948100, 42185.9429, 1, 18.3608],
  [1703948400, 42224.9457, 1, 18.339],
  [1703948700, 42203.226, 1, 18.3496],
  [1703949000, 42278.4528, 1, 18.3426],
  [1703949300, 42263.1803, 1, 18.3514],
  [1703949600, 42222.8452, 1, 18.3521],
  [1703949900, 42188.0205, 1, 18.3509],
  [1703950200, 42209.3395, 1, 18.342],
  [1703950500, 42219.9082, 1, 18.3491],
  [1703950800, 42238.6916, 1, 18.3556],
  [1703951100, 42270.5325, 1, 18.3535],
  [1703951400, 42305.0637, 1, 18.3323],
  [1703951700, 42398.6554, 1, 18.3065],
  [1703952000, 42387.1043, 1, 18.315],
  [1703952300, 42434.3843, 1, 18.3064],
  [1703952600, 42454.4018, 1, 18.3212],
  [1703952900, 42557.6115, 1, 18.3526],
  [1703953200, 42549.5788, 1, 18.3186],
  [1703953500, 42550.1982, 1, 18.3334],
  [1703953800, 42488.2677, 1, 18.3385],
  [1703954100, 42533.8112, 1, 18.3542],
  [1703954400, 42520.7904, 1, 18.3486],
  [1703954700, 42467.0017, 1, 18.3406],
  [1703955000, 42431.5164, 1, 18.3435],
  [1703955300, 42448.0745, 1, 18.349],
  [1703955600, 42406.231, 1, 18.3546],
  [1703955900, 42423.2611, 1, 18.3465],
  [1703956200, 42374.2166, 1, 18.3609],
  [1703956500, 42286.6476, 1, 18.3581],
  [1703956800, 42308.3542, 1, 18.3715],
  [1703957100, 42427.9868, 1, 18.3774],
  [1703957400, 42554.9348, 1, 18.4067],
  [1703957700, 42568.1914, 1, 18.4128],
  [1703958000, 42545.7627, 1, 18.4311],
  [1703958300, 42474.3697, 1, 18.4146],
  [1703958600, 42460.0823, 1, 18.4125],
  [1703958900, 42490.7842, 1, 18.3973],
  [1703959200, 42494.4011, 1, 18.4057],
  [1703959500, 42481.1987, 1, 18.3893],
  [1703959800, 42417.9204, 1, 18.4005],
  [1703960100, 42406.9794, 1, 18.389],
  [1703960400, 42415.2835, 1, 18.4061],
  [1703960700, 42424.0244, 1, 18.4139],
  [1703961000, 42405.1127, 1, 18.4057],
  [1703961300, 42399.8382, 1, 18.4172],
  [1703961600, 42388.8419, 1, 18.4195],
  [1703961900, 42347.5339, 1, 18.4189],
  [1703962200, 42363.2033, 1, 18.4202],
  [1703962500, 42392.0718, 1, 18.4208],
  [1703962800, 42409.9877, 1, 18.4026],
  [1703963100, 42386.666, 1, 18.4091],
  [1703963400, 42346.4459, 1, 18.4111],
  [1703963700, 42358.3589, 1, 18.4131],
  [1703964000, 42366.8107, 1, 18.4255],
  [1703964300, 42404.0358, 1, 18.4189],
  [1703964600, 42411.4139, 1, 18.4206],
  [1703964900, 42435.4501, 1, 18.415],
  [1703965200, 42434.2734, 1, 18.4143],
  [1703965500, 42411.5339, 1, 18.432],
  [1703965800, 42432.8449, 1, 18.4143],
  [1703966100, 42377.9731, 1, 18.4028],
  [1703966400, 42361.0447, 1, 18.4172],
  [1703966700, 42376.8814, 1, 18.4207],
  [1703967000, 42374.5833, 1, 18.4033],
  [1703967300, 42377.0794, 1, 18.3958],
  [1703967600, 42368.4958, 1, 18.3773],
  [1703967900, 42359.2099, 1, 18.4026],
  [1703968200, 42378.9711, 1, 18.3942],
  [1703968500, 42282.8099, 1, 18.3851],
  [1703968800, 42264.2763, 1, 18.367],
  [1703969100, 42231.9839, 1, 18.3651],
  [1703969400, 42274.0991, 1, 18.3654],
  [1703969700, 42287.7685, 1, 18.377],
  [1703970000, 42292.3302, 1, 18.396],
  [1703970300, 42298.2032, 1, 18.3572],
  [1703970600, 42249.0243, 1, 18.3451],
  [1703970900, 42292.8175, 1, 18.355],
  [1703971200, 42284.7661, 1, 18.3597],
  [1703971500, 42287.4134, 1, 18.3716],
  [1703971800, 42309.5719, 1, 18.3611],
  [1703972100, 42279.4299, 1, 18.359],
  [1703972400, 42258.5483, 1, 18.3645],
  [1703972700, 42275.0433, 1, 18.3744],
  [1703973000, 42250.7143, 1, 18.3683],
  [1703973300, 42274.0015, 1, 18.3603],
  [1703973600, 42299.6067, 1, 18.3661],
  [1703973900, 42264.1319, 1, 18.3651],
  [1703974200, 42262.0612, 1, 18.3714],
  [1703974500, 42285.874, 1, 18.3639],
  [1703974800, 42296.5822, 1, 18.3714],
  [1703975100, 42256.5994, 1, 18.369],
  [1703975400, 42258.7591, 1, 18.3701],
  [1703975700, 42245.2602, 1, 18.3832],
  [1703976000, 42240.9604, 1, 18.384],
  [1703976300, 42237.186, 1, 18.3868],
  [1703976600, 42233.7837, 1, 18.3943],
  [1703976900, 42185.2634, 1, 18.4149],
  [1703977200, 42122.2127, 1, 18.4109],
  [1703977500, 42190.681, 1, 18.3946],
  [1703977800, 42218.4155, 1, 18.3842],
  [1703978100, 42225.7174, 1, 18.4171],
  [1703978400, 42270.1986, 1, 18.4209],
  [1703978413, 42271.811471007, 1, 18.4216061079377],
];
