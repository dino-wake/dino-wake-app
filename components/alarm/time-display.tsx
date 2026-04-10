import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

type TimeDisplayProps = {
  time: string;
};

export function TimeDisplay({ time }: TimeDisplayProps) {
  return (
    <VStack className="items-center" space="xs">
      <Text
        className="font-outfit font-bold text-dino-text-primary"
        style={{ fontSize: 72, letterSpacing: -2 }}
      >
        {time}
      </Text>
      <Text
        className="font-semibold text-dino-accent-green"
        style={{ fontSize: 12, letterSpacing: 3 }}
      >
        TIME TO GROW TOGETHER
      </Text>
    </VStack>
  );
}
