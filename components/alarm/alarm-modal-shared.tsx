/**
 * 알람 모달에서 공유하는 UI 조각들
 */
import { Colors } from '@/constants/theme';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Pressable } from '@/components/ui/pressable';
import { Switch } from '@/components/ui/switch';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import { TextInput } from 'react-native';
import { DAY_LABELS } from '@/types/alarm';

// ─── 시간 피커 ────────────────────────────────────────────────────────────────

type TimePickerProps = {
  hour: number;
  minute: number;
  onHourChange: (h: number) => void;
  onMinuteChange: (m: number) => void;
};

function NumberBox({
  value,
  max,
  onChange,
}: {
  value: number;
  max: number;
  onChange: (v: number) => void;
}) {
  return (
    <Box
      className="items-center justify-center rounded-[20px]"
      style={{ width: 110, height: 90, backgroundColor: '#F2F2EF' }}
    >
      <HStack className="items-center gap-3">
        <Pressable
          onPress={() => onChange((value - 1 + max + 1) % (max + 1))}
          hitSlop={12}
          style={{ padding: 8 }}
        >
          <Text className="text-dino-text-tertiary" style={{ fontSize: 22, fontWeight: '300' }}>
            ‹
          </Text>
        </Pressable>
        <Text
          className="text-dino-text-primary font-bold"
          style={{ fontSize: 32, minWidth: 44, textAlign: 'center' }}
        >
          {String(value).padStart(2, '0')}
        </Text>
        <Pressable
          onPress={() => onChange((value + 1) % (max + 1))}
          hitSlop={12}
          style={{ padding: 8 }}
        >
          <Text className="text-dino-text-tertiary" style={{ fontSize: 22, fontWeight: '300' }}>
            ›
          </Text>
        </Pressable>
      </HStack>
    </Box>
  );
}

export function TimePicker({ hour, minute, onHourChange, onMinuteChange }: TimePickerProps) {
  return (
    <Box className="items-center py-5">
      <HStack className="items-center gap-3">
        <NumberBox value={hour} max={23} onChange={onHourChange} />
        <Text
          className="text-dino-text-tertiary font-semibold"
          style={{ fontSize: 40 }}
        >
          :
        </Text>
        <NumberBox value={minute} max={59} onChange={onMinuteChange} />
      </HStack>
    </Box>
  );
}

// ─── 요일 선택 ────────────────────────────────────────────────────────────────

type DaySelectorProps = {
  selectedDays: number[];
  onChange: (days: number[]) => void;
};

export function DaySelector({ selectedDays, onChange }: DaySelectorProps) {
  function toggle(idx: number) {
    if (selectedDays.includes(idx)) {
      onChange(selectedDays.filter((d) => d !== idx));
    } else {
      onChange([...selectedDays, idx]);
    }
  }

  return (
    <VStack space="sm">
      <Text className="text-dino-label font-semibold text-dino-text-secondary">반복 요일 설정</Text>
      <HStack className="gap-2">
        {DAY_LABELS.map((label, idx) => {
          const active = selectedDays.includes(idx);
          const isSunday = idx === 6;
          return (
            <Pressable key={idx} onPress={() => toggle(idx)}>
              <Box
                className="items-center justify-center"
                style={{
                  width: 38,
                  height: 38,
                  borderRadius: 19,
                  backgroundColor: active ? '#B8DFBE' : 'transparent',
                  borderWidth: active ? 0 : 1,
                  borderColor: Colors.light.border,
                }}
              >
                <Text
                  style={{
                    fontSize: 13,
                    fontFamily: 'Outfit_500Medium',
                    fontWeight: active ? '600' : '500',
                    color: active
                      ? '#3D8A5A'
                      : isSunday
                      ? '#E05555'
                      : Colors.light.icon,
                  }}
                >
                  {label}
                </Text>
              </Box>
            </Pressable>
          );
        })}
      </HStack>
    </VStack>
  );
}

// ─── 입력 카드 ────────────────────────────────────────────────────────────────

type InputCardProps = {
  label: string;
  placeholder: string;
  value: string;
  onChangeText: (v: string) => void;
  multiline?: boolean;
};

export function InputCard({ label, placeholder, value, onChangeText, multiline }: InputCardProps) {
  return (
    <Box
      className="rounded-2xl gap-1.5 px-[18px] py-[14px]"
      style={{ backgroundColor: '#F7F7F5' }}
    >
      <Text className="text-dino-label font-semibold text-dino-text-primary">{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={Colors.light.icon}
        multiline={multiline}
        style={{
          fontFamily: 'Outfit_400Regular',
          fontSize: 14,
          color: Colors.light.text,
          minHeight: multiline ? 48 : undefined,
          textAlignVertical: multiline ? 'top' : 'center',
        }}
      />
    </Box>
  );
}

// ─── 토글 행 ─────────────────────────────────────────────────────────────────

type ToggleRowProps = {
  label: string;
  value: boolean;
  onValueChange: (v: boolean) => void;
};

export function ToggleRow({ label, value, onValueChange }: ToggleRowProps) {
  return (
    <Box
      className="flex-row items-center rounded-2xl px-[18px] py-[14px]"
      style={{ backgroundColor: '#F7F7F5' }}
    >
      <Text className="flex-1 text-dino-body font-semibold text-dino-text-primary">{label}</Text>
      <Switch
        value={value}
        onValueChange={onValueChange}
        trackColor={{ false: Colors.light.border, true: Colors.light.accentGreenLight }}
        thumbColor="#FFFFFF"
      />
    </Box>
  );
}
