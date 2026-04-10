import { Colors } from '@/constants/theme';
import { Cloud, ListChecks, Newspaper, Sparkles } from 'lucide-react-native';
import { useState } from 'react';
import { Modal, Pressable, Switch, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';

type BriefingItems = {
  weather: boolean;
  zodiacAnimal: boolean;
  horoscope: boolean;
  news: boolean;
};

type Props = {
  visible: boolean;
  items?: BriefingItems;
  onCancel: () => void;
  onConfirm: (items: BriefingItems) => void;
};

const ITEM_LIST = [
  { key: 'weather' as const, label: '날씨', icon: Cloud, color: '#3D8A5A', bgActive: '#DFF0E5' },
  { key: 'zodiacAnimal' as const, label: '띠별 운세', icon: Sparkles, color: '#E8A054', bgActive: '#FFF0E8' },
  { key: 'horoscope' as const, label: '별자리 운세', icon: Sparkles, color: '#8B6FD4', bgActive: '#EEE8FF' },
  { key: 'news' as const, label: '뉴스', icon: Newspaper, color: '#3D8A5A', bgActive: '#DFF0E5' },
];

export function BriefingItemsAlert({ visible, items, onCancel, onConfirm }: Props) {
  const [state, setState] = useState<BriefingItems>(
    items ?? { weather: true, zodiacAnimal: false, horoscope: false, news: true }
  );

  function toggle(key: keyof BriefingItems) {
    setState((prev) => ({ ...prev, [key]: !prev[key] }));
  }

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
              <ListChecks size={28} color="#3D8A5A" />
            </Box>
          </VStack>

          {/* 타이틀 */}
          <VStack style={{ alignItems: 'center', gap: 6, paddingHorizontal: 28, paddingTop: 16, paddingBottom: 4 }}>
            <Text style={{ fontSize: 19, fontFamily: 'Outfit_700Bold', color: Colors.light.text, textAlign: 'center' }}>
              브리핑 항목 설정
            </Text>
            <Text style={{ fontSize: 13, fontFamily: 'Outfit_400Regular', color: Colors.light.icon, textAlign: 'center', lineHeight: 13 * 1.5 }}>
              아침 브리핑에 포함할 항목을 선택하세요.
            </Text>
          </VStack>

          {/* 항목 목록 */}
          <VStack style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 4, gap: 6 }}>
            {ITEM_LIST.map((item) => {
              const active = state[item.key];
              return (
                <HStack
                  key={item.key}
                  style={{
                    height: 52,
                    backgroundColor: active ? item.bgActive : '#F5F4F1',
                    borderRadius: 14,
                    paddingHorizontal: 16,
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <HStack style={{ alignItems: 'center', gap: 12 }}>
                    <item.icon size={18} color={active ? item.color : Colors.light.icon} />
                    <Text style={{ fontSize: 14, fontFamily: 'Outfit_600SemiBold', color: active ? Colors.light.text : Colors.light.icon }}>
                      {item.label}
                    </Text>
                  </HStack>
                  <Switch
                    value={active}
                    onValueChange={() => toggle(item.key)}
                    trackColor={{ false: Colors.light.border, true: Colors.light.accentGreenLight }}
                    thumbColor="#FFFFFF"
                  />
                </HStack>
              );
            })}
          </VStack>

          {/* 버튼 */}
          <HStack style={{ paddingHorizontal: 20, paddingTop: 12, paddingBottom: 28, gap: 10 }}>
            <Pressable
              onPress={onCancel}
              style={{ flex: 1, height: 52, backgroundColor: '#F5F4F1', borderRadius: 14, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ fontSize: 15, fontFamily: 'Outfit_600SemiBold', color: Colors.light.icon }}>취소</Text>
            </Pressable>
            <Pressable
              onPress={() => onConfirm(state)}
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
              <Text style={{ fontSize: 15, fontFamily: 'Outfit_700Bold', color: '#FFFFFF' }}>저장</Text>
            </Pressable>
          </HStack>
        </Box>
      </View>
    </Modal>
  );
}
