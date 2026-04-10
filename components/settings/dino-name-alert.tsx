import { Colors } from '@/constants/theme';
import { useState } from 'react';
import { Modal, Pressable, TextInput, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';

type Props = {
  visible: boolean;
  currentName?: string;
  onCancel: () => void;
  onConfirm: (name: string) => void;
};

export function DinoNameAlert({ visible, currentName = '', onCancel, onConfirm }: Props) {
  const [name, setName] = useState(currentName);

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
              <Text style={{ fontSize: 32 }}>🦕</Text>
            </Box>
          </VStack>

          {/* 타이틀 */}
          <VStack style={{ alignItems: 'center', gap: 6, paddingHorizontal: 28, paddingTop: 16, paddingBottom: 4 }}>
            <Text style={{ fontSize: 19, fontFamily: 'Outfit_700Bold', color: Colors.light.text, textAlign: 'center' }}>
              다이노 이름 설정
            </Text>
            <Text style={{ fontSize: 13, fontFamily: 'Outfit_400Regular', color: Colors.light.icon, textAlign: 'center', lineHeight: 13 * 1.5 }}>
              나만의 공룡에게 이름을 지어주세요!
            </Text>
          </VStack>

          {/* 입력 */}
          <VStack style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 4, gap: 6 }}>
            <Box
              style={{
                height: 52,
                backgroundColor: '#F5F4F1',
                borderRadius: 14,
                borderWidth: 1.5,
                borderColor: name.length > 0 ? '#3D8A5A' : Colors.light.border,
                paddingHorizontal: 16,
                justifyContent: 'center',
              }}
            >
              <TextInput
                value={name}
                onChangeText={(v) => setName(v.slice(0, 8))}
                placeholder="이름을 입력하세요"
                placeholderTextColor={Colors.light.icon}
                style={{ fontFamily: 'Outfit_400Regular', fontSize: 14, color: Colors.light.text }}
                maxLength={8}
              />
            </Box>
            <Text style={{ fontSize: 11, fontFamily: 'Outfit_400Regular', color: Colors.light.icon, letterSpacing: 0.1 }}>
              최대 8자까지 입력할 수 있어요
            </Text>
          </VStack>

          {/* 버튼 */}
          <HStack style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28, gap: 10 }}>
            <Pressable
              onPress={onCancel}
              style={{ flex: 1, height: 52, backgroundColor: '#F5F4F1', borderRadius: 14, alignItems: 'center', justifyContent: 'center' }}
            >
              <Text style={{ fontSize: 15, fontFamily: 'Outfit_600SemiBold', color: Colors.light.icon }}>취소</Text>
            </Pressable>
            <Pressable
              onPress={() => onConfirm(name)}
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
