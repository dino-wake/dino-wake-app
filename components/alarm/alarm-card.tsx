import { Colors } from '@/constants/theme';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

type AlarmCardProps = {
  time: string;
  label: string;
  days: string;
  enabled: boolean;
  onToggle: (value: boolean) => void;
  onPress?: () => void;
};

export function AlarmCard({ time, label, days, enabled, onToggle, onPress }: AlarmCardProps) {
  return (
    <Pressable onPress={onPress}>
      <Box
        className="rounded-2xl bg-background-0 px-[18px] py-4"
        style={{
          shadowColor: Colors.light.shadow,
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.03,
          shadowRadius: 8,
          elevation: 2,
        }}
      >
        <VStack space="xs">
          <HStack className="items-center gap-2">
            <Text className="text-dino-alarm tracking-dino-time font-bold text-dino-text-primary flex-1">
              {time}
            </Text>
            <Box className="rounded-full bg-dino-accent-orange-soft px-2.5 py-1">
              <Text className="text-dino-label font-medium text-dino-accent-orange-dark">{label}</Text>
            </Box>
            <Switch
              value={enabled}
              onValueChange={onToggle}
              trackColor={{ false: Colors.light.border, true: Colors.light.accentGreenLight }}
              thumbColor="#FFFFFF"
            />
          </HStack>
          <Text className="text-dino-sub text-dino-text-tertiary">{days}</Text>
        </VStack>
      </Box>
    </Pressable>
  );
}
