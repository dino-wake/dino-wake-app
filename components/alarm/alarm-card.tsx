import { Trash2 } from 'lucide-react-native';
import { Switch, Text, TouchableOpacity, View } from 'react-native';

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
    <View
      className="rounded-2xl bg-white p-4"
      style={{
        shadowColor: '#1A1918',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.03,
        shadowRadius: 8,
        elevation: 2,
      }}
    >
      <View className="flex-row items-center gap-2">
        <Text
          className="text-[32px] font-bold text-dino-text-primary"
          style={{ letterSpacing: -1 }}
        >
          {time}
        </Text>
        <View className="rounded-full bg-[#FFF0E8] px-2.5 py-1">
          <Text className="text-[12px] font-medium text-[#D9893A]">{label}</Text>
        </View>
        <View className="flex-1" />
        <Switch
          value={enabled}
          onValueChange={onToggle}
          trackColor={{ false: '#E5E4E1', true: '#7DCBA4' }}
          thumbColor="#FFFFFF"
        />
        <TouchableOpacity onPress={onDelete} hitSlop={8}>
          <Trash2 size={18} color="#9C9B99" />
        </TouchableOpacity>
      </View>
      <Text className="mt-1 text-[11px] text-dino-text-tertiary">{days}</Text>
    </View>
  );
}
