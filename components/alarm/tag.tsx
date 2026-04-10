import { Text, View } from 'react-native';

type TagProps = {
  label: string;
};

export function TagActive({ label }: TagProps) {
  return (
    <View className="rounded-full bg-[#7DCBA4] px-3.5 py-1.5">
      <Text className="text-[13px] font-semibold text-[#2B7A4B]">{label}</Text>
    </View>
  );
}

export function TagInactive({ label }: TagProps) {
  return (
    <View className="rounded-full border border-dino-border px-3.5 py-1.5">
      <Text className="text-[13px] font-medium text-[#555555]">{label}</Text>
    </View>
  );
}
