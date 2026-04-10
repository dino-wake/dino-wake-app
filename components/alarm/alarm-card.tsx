import { Trash2 } from 'lucide-react-native';

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
  onDelete: () => void;
};

export function AlarmCard({ time, label, days, enabled, onToggle, onDelete }: AlarmCardProps) {
  return (
    <Box
      className="rounded-2xl bg-background-0 p-4"
      style={{
        shadowColor: '#1A1918',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <VStack space="xs">
        <HStack className="items-center gap-2">
          <Text
            className="font-bold text-dino-text-primary"
            style={{ fontSize: 32, letterSpacing: -1 }}
          >
            {time}
          </Text>
          <Box className="rounded-full bg-[#FFF0E8] px-2.5 py-1">
            <Text className="text-[12px] font-medium text-[#D9893A]">{label}</Text>
          </Box>
          <Box className="flex-1" />
          <Switch
            value={enabled}
            onValueChange={onToggle}
            trackColor={{ false: '#E5E4E1', true: '#7DCBA4' }}
            thumbColor="#FFFFFF"
          />
          <Pressable onPress={onDelete} hitSlop={8}>
            <Trash2 size={18} color="#9C9B99" />
          </Pressable>
        </HStack>
        <Text className="text-[11px] text-dino-text-tertiary">{days}</Text>
      </VStack>
    </Box>
  );
}
