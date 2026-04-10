import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

type TimeDisplayProps = {
  time: string;
};

export function TimeDisplay({ time }: TimeDisplayProps) {
  return (
    <VStack className="items-center" space="xs">
      <Text className="text-dino-display tracking-dino-display font-outfit font-bold text-dino-text-primary">
        {time}
      </Text>
      <Text className="text-dino-label tracking-dino-wide font-semibold text-dino-accent-green">
        TIME TO GROW TOGETHER
      </Text>
    </VStack>
  );
}
