import { Text, View } from 'react-native';

type AdBannerProps = {
  title: string;
};

export function AdBanner({ title }: AdBannerProps) {
  return (
    <View className="h-[100px] overflow-hidden rounded-2xl bg-[#F5F0EA] flex-row items-center px-4">
      <View className="flex-1 gap-1">
        <View className="self-start rounded bg-[#8C8C8C] px-1.5 py-0.5">
          <Text className="text-[9px] font-bold text-white">AD</Text>
        </View>
        <Text
          className="text-[15px] font-semibold text-dino-text-primary"
          style={{ width: 200, lineHeight: 21 }}
          numberOfLines={3}
        >
          {title}
        </Text>
      </View>
      <Text style={{ fontSize: 48 }}>🦖</Text>
    </View>
  );
}
