import { Colors } from '@/constants/theme';
import { AlarmClock, Minus, Plus } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';

type Props = {
  visible: boolean;
  onCancel: () => void;
  onConfirm: (minutes: number, count: number) => void;
};

const OPTIONS = [5, 10, 15, 30];

export function SnoozeAlert({ visible, onCancel, onConfirm }: Props) {
  const [selected, setSelected] = useState(5);
  const [count, setCount] = useState(3);

  return (
    <Modal visible={visible} transparent animationType="fade">
      <View
        style={{
          flex: 1,
          backgroundColor: '#1A191880',
          alignItems: 'center',
          justifyContent: 'center',
          paddingHorizontal: 31,
        }}
      >
        <Box
          style={{
            backgroundColor: '#FFFFFF',
            borderRadius: 28,
            width: '100%',
            maxWidth: 340,
          }}
        >
          {/* 아이콘 */}
          <VStack style={{ alignItems: 'center', paddingHorizontal: 24, paddingTop: 28 }}>
            <Box
              style={{
                width: 60,
                height: 60,
                borderRadius: 18,
                backgroundColor: '#DFF0E5',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <AlarmClock size={28} color="#3D8A5A" />
            </Box>
          </VStack>

          {/* 타이틀 */}
          <VStack style={{ alignItems: 'center', gap: 6, paddingHorizontal: 28, paddingTop: 16, paddingBottom: 4 }}>
            <Text style={{ fontSize: 19, fontFamily: 'Outfit_700Bold', color: Colors.light.text, textAlign: 'center' }}>
              다시 알림 설정
            </Text>
            <Text style={{ fontSize: 13, fontFamily: 'Outfit_400Regular', color: Colors.light.icon, textAlign: 'center', lineHeight: 13 * 1.5 }}>
              알람이 울린 후 몇 분 뒤에 다시 알려드릴까요?
            </Text>
          </VStack>

          {/* 옵션 */}
          <Box style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4 }}>
            <HStack style={{ gap: 8, flexWrap: 'wrap' }}>
              {OPTIONS.map((opt) => (
                <Pressable
                  key={opt}
                  onPress={() => setSelected(opt)}
                  style={{ flex: 1 }}
                >
                  <Box
                    style={{
                      height: 52,
                      borderRadius: 14,
                      backgroundColor: selected === opt ? '#3D8A5A' : '#F5F4F1',
                      alignItems: 'center',
                      justifyContent: 'center',
                      shadowColor: selected === opt ? '#3D8A5A' : 'transparent',
                      shadowOffset: { width: 0, height: 3 },
                      shadowOpacity: 0.19,
                      shadowRadius: 10,
                      elevation: selected === opt ? 3 : 0,
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 15,
                        fontFamily: 'Outfit_600SemiBold',
                        color: selected === opt ? '#FFFFFF' : Colors.light.text,
                      }}
                    >
                      {opt}분
                    </Text>
                  </Box>
                </Pressable>
              ))}
            </HStack>
          </Box>

          {/* 최대 반복 횟수 */}
          <HStack style={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 4, alignItems: 'center', gap: 8 }}>
            <Text style={{ flex: 1, fontSize: 13, fontFamily: 'Outfit_600SemiBold', color: Colors.light.icon }}>
              최대 반복 횟수
            </Text>
            <HStack style={{ alignItems: 'center', gap: 20, height: 52 }}>
              <Pressable onPress={() => setCount(Math.max(1, count - 1))}>
                <Box
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: '#F5F4F1',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Minus size={14} color={Colors.light.icon} />
                </Box>
              </Pressable>
              <Text style={{ fontSize: 18, fontFamily: 'Outfit_700Bold', color: Colors.light.text, minWidth: 24, textAlign: 'center' }}>
                {count}
              </Text>
              <Pressable onPress={() => setCount(Math.min(10, count + 1))}>
                <Box
                  style={{
                    width: 32,
                    height: 32,
                    borderRadius: 16,
                    backgroundColor: '#DFF0E5',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}
                >
                  <Plus size={14} color="#3D8A5A" />
                </Box>
              </Pressable>
            </HStack>
          </HStack>

          {/* 버튼 */}
          <HStack style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28, gap: 10 }}>
            <Pressable
              onPress={onCancel}
              style={{ flex: 1, height: 52, backgroundColor: '#F5F4F1', borderRadius: 14, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ fontSize: 15, fontFamily: 'Outfit_600SemiBold', color: Colors.light.icon }}>취소</Text>
            </Pressable>
            <Pressable
              onPress={() => onConfirm(selected, count)}
              style={{
                flex: 1,
                height: 52,
                backgroundColor: '#3D8A5A',
                borderRadius: 14,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#3D8A5A',
                shadowOffset: { width: 0, height: 3 },
                shadowOpacity: 0.19,
                shadowRadius: 10,
                elevation: 3,
              }}
            >
              <Text style={{ fontSize: 15, fontFamily: 'Outfit_700Bold', color: '#FFFFFF' }}>확인</Text>
            </Pressable>
          </HStack>
        </Box>
      </View>
    </Modal>
  );
}
