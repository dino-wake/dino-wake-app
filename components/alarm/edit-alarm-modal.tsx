import { Colors } from '@/constants/theme';
import { Alarm } from '@/types/alarm';
import { Trash2, X } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Modal, Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';
import {
  DaySelector,
  InputCard,
  TimePicker,
  ToggleRow,
} from './alarm-modal-shared';

type Props = {
  visible: boolean;
  alarm: Alarm | null;
  onClose: () => void;
  onSave: (alarm: Alarm) => void;
  onDelete: (id: string) => void;
};

export function EditAlarmModal({ visible, alarm, onClose, onSave, onDelete }: Props) {
  const [hour, setHour] = useState(7);
  const [minute, setMinute] = useState(0);
  const [days, setDays] = useState<number[]>([0, 1, 2, 3, 4]);
  const [label, setLabel] = useState('');
  const [memo, setMemo] = useState('');
  const [sound, setSound] = useState(true);
  const [snooze, setSnooze] = useState(false);

  useEffect(() => {
    if (alarm) {
      setHour(alarm.hour);
      setMinute(alarm.minute);
      setDays(alarm.days);
      setLabel(alarm.label);
      setMemo(alarm.memo);
      setSound(alarm.sound);
      setSnooze(alarm.snooze);
    }
  }, [alarm]);

  function handleSave() {
    if (!alarm) return;
    onSave({ ...alarm, hour, minute, days, label: label || '알람', memo, sound, snooze });
    onClose();
  }

  function handleDelete() {
    if (!alarm) return;
    onDelete(alarm.id);
    onClose();
  }

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent
      onRequestClose={onClose}
    >
      <View style={{ flex: 1, justifyContent: 'flex-end', backgroundColor: '#1A191840' }}>
        <SafeAreaView edges={['bottom']} style={{ backgroundColor: '#FFFFFF' }}>
          <Box
            style={{
              backgroundColor: '#FFFFFF',
              borderTopLeftRadius: 24,
              borderTopRightRadius: 24,
              maxHeight: '92%',
            }}
          >
            {/* 헤더 */}
            <HStack className="items-center px-6 pt-6 pb-4">
              <Text
                className="text-dino-text-primary font-bold"
                style={{ fontSize: 22, letterSpacing: -0.3, flex: 1 }}
              >
                알람 수정
              </Text>
              <Pressable
                onPress={onClose}
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  borderWidth: 1,
                  borderColor: Colors.light.border,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <X size={18} color={Colors.light.icon} />
              </Pressable>
            </HStack>

            {/* 콘텐츠 */}
            <ScrollView
              showsVerticalScrollIndicator={false}
              contentContainerStyle={{ paddingHorizontal: 24, paddingBottom: 24, gap: 20 }}
            >
              <TimePicker
                hour={hour}
                minute={minute}
                onHourChange={setHour}
                onMinuteChange={setMinute}
              />

              <DaySelector selectedDays={days} onChange={setDays} />

              <VStack space="sm">
                <InputCard
                  label="알람 이름"
                  placeholder="예: 아침 운동"
                  value={label}
                  onChangeText={setLabel}
                />
                <InputCard
                  label="준비물 및 일정 메모"
                  placeholder="내일 챙겨야 할 물건이나 중요한 일정을 적어주세요."
                  value={memo}
                  onChangeText={setMemo}
                  multiline
                />
              </VStack>

              <VStack space="xs">
                <ToggleRow label="알람 사운드" value={sound} onValueChange={setSound} />
                <ToggleRow label="다시 알림 (스누즈)" value={snooze} onValueChange={setSnooze} />
              </VStack>

              {/* 삭제 버튼 */}
              <Pressable
                onPress={handleDelete}
                style={{
                  height: 50,
                  borderRadius: 16,
                  borderWidth: 1,
                  borderColor: '#E8BFBF',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'center',
                  gap: 8,
                }}
              >
                <Trash2 size={16} color="#C75050" />
                <Text style={{ color: '#C75050', fontSize: 15, fontFamily: 'Outfit_600SemiBold' }}>
                  알람 삭제
                </Text>
              </Pressable>

              {/* 저장 버튼 */}
              <Pressable
                onPress={handleSave}
                style={{
                  backgroundColor: '#3D8A5A',
                  height: 50,
                  borderRadius: 16,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}
              >
                <Text style={{ color: '#FFFFFF', fontSize: 17, fontFamily: 'Outfit_700Bold' }}>
                  변경사항 저장
                </Text>
              </Pressable>
            </ScrollView>
          </Box>
        </SafeAreaView>
      </View>
    </Modal>
  );
}
