import { Text, View } from 'react-native';

type TimeDisplayProps = {
  time: string;
};

export function TimeDisplay({ time }: TimeDisplayProps) {
  return (
    <View className="items-center gap-1">
      <Text
        className="font-outfit text-[72px] font-bold text-dino-text-primary"
        style={{ letterSpacing: -2 }}
      >
        {time}
      </Text>
      <Text
        className="text-[12px] font-semibold text-dino-accent-green"
        style={{ letterSpacing: 3 }}
      >
        TIME TO GROW TOGETHER
      </Text>
    </View>
  );
}
