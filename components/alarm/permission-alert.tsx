import { Colors } from '@/constants/theme';
import { Bell, ShieldCheck, Wifi } from 'lucide-react-native';
import { Modal, Pressable, View } from 'react-native';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';

type Props = {
  visible: boolean;
  onConfirm: () => void;
};

const PERMS = [
  { icon: Bell, label: '알림', desc: '알람을 정시에 울리기 위해 필요해요' },
  { icon: Wifi, label: '네트워크', desc: '날씨, 뉴스 등 브리핑 정보를 가져와요' },
];

export function PermissionAlert({ visible, onConfirm }: Props) {
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
          <VStack style={{ alignItems: 'center', paddingHorizontal: 24, paddingTop: 32 }}>
            <Box
              style={{
                width: 64,
                height: 64,
                borderRadius: 20,
                backgroundColor: '#DFF0E5',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <ShieldCheck size={32} color="#3D8A5A" />
            </Box>
          </VStack>

          {/* 타이틀 */}
          <VStack style={{ alignItems: 'center', gap: 8, paddingHorizontal: 28, paddingTop: 20, paddingBottom: 4 }}>
            <Text style={{ fontSize: 20, fontFamily: 'Outfit_700Bold', color: Colors.light.text, textAlign: 'center' }}>
              권한이 필요합니다!
            </Text>
            <Text style={{ fontSize: 14, fontFamily: 'Outfit_400Regular', color: Colors.light.icon, textAlign: 'center', lineHeight: 14 * 1.6 }}>
              {'다이노 알람이 제대로 작동하려면\n아래 권한이 필요해요.'}
            </Text>
          </VStack>

          {/* 권한 목록 */}
          <VStack style={{ paddingHorizontal: 20, paddingTop: 20, paddingBottom: 4, gap: 10 }}>
            {PERMS.map((perm) => (
              <HStack
                key={perm.label}
                style={{
                  backgroundColor: '#F5F4F1',
                  borderRadius: 16,
                  paddingHorizontal: 16,
                  paddingVertical: 14,
                  alignItems: 'center',
                  gap: 14,
                }}
              >
                <perm.icon size={20} color="#3D8A5A" />
                <VStack style={{ flex: 1, gap: 2 }}>
                  <Text style={{ fontSize: 14, fontFamily: 'Outfit_600SemiBold', color: Colors.light.text }}>
                    {perm.label}
                  </Text>
                  <Text style={{ fontSize: 12, fontFamily: 'Outfit_400Regular', color: Colors.light.icon }}>
                    {perm.desc}
                  </Text>
                </VStack>
              </HStack>
            ))}
          </VStack>

          {/* 확인 버튼 */}
          <Box style={{ paddingHorizontal: 20, paddingTop: 16, paddingBottom: 28 }}>
            <Pressable
              onPress={onConfirm}
              style={{
                height: 54,
                backgroundColor: '#3D8A5A',
                borderRadius: 16,
                alignItems: 'center',
                justifyContent: 'center',
                shadowColor: '#3D8A5A',
                shadowOffset: { width: 0, height: 4 },
                shadowOpacity: 0.19,
                shadowRadius: 14,
                elevation: 4,
              }}
            >
              <Text style={{ fontSize: 16, fontFamily: 'Outfit_700Bold', color: '#FFFFFF' }}>
                권한 허용하기
              </Text>
            </Pressable>
          </Box>
        </Box>
      </View>
    </Modal>
  );
}
