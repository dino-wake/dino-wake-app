import { Image, Text, View } from 'react-native';

export function DinoEggSection() {
  return (
    <View className="items-center gap-3">
      <Image
        source={require('@/assets/images/dino_egg.png')}
        style={{ width: 127, height: 134 }}
        resizeMode="contain"
      />
      <View className="rounded-full bg-[#E0F5EC] px-4 py-1.5">
        <Text
          className="text-[12px] font-semibold text-[#7DCBA4]"
          style={{ letterSpacing: 2 }}
        >
          DREAMING...
        </Text>
      </View>
    </View>
  );
}
