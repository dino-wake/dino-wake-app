import { Colors } from '@/constants/theme';
import { ChevronLeft } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { router } from 'expo-router';

const SECTIONS = [
  {
    title: '제1조 (목적)',
    body: '본 약관은 다이노 알람(이하 "서비스")의 이용과 관련하여 서비스 제공자와 이용자 간의 권리, 의무 및 책임사항, 기타 필요한 사항을 규정함을 목적으로 합니다.',
  },
  {
    title: '제2조 (서비스 이용)',
    body: '① 서비스는 회원가입 후 이용할 수 있으며, 일부 서비스는 비회원도 이용 가능합니다.\n② 서비스 이용 시간은 서비스 제공자의 업무상 또는 기술상 특별한 지장이 없는 한 연중무휴, 1일 24시간으로 합니다.',
  },
  {
    title: '제3조 (회원의 의무)',
    body: '① 회원은 서비스를 이용함에 있어 법령, 본 약관의 규정, 이용안내 및 주의사항 등 서비스가 공지하는 사항을 준수하여야 합니다.\n② 회원은 타인의 개인정보를 수집, 저장, 공개하거나 부정하게 이용하여서는 안 됩니다.',
  },
  {
    title: '제4조 (서비스 변경 및 중단)',
    body: '서비스 제공자는 서비스의 일부 또는 전부를 변경하거나 중단할 수 있으며, 이 경우 사전에 공지합니다. 단, 불가피한 사정이 있는 경우 사후에 공지할 수 있습니다.',
  },
];

export default function TermsScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F4F1' }}>
      <HStack style={{ alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 }}>
        <Pressable onPress={() => router.back()} style={{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={24} color={Colors.light.text} />
        </Pressable>
        <View style={{ flex: 1 }} />
        <Text style={{ fontSize: 17, fontFamily: 'Outfit_700Bold', color: Colors.light.text }}>이용약관</Text>
        <View style={{ flex: 1 }} />
        <View style={{ width: 36 }} />
      </HStack>

      <HStack style={{ paddingHorizontal: 24, paddingBottom: 16, justifyContent: 'space-between', alignItems: 'center' }}>
        <Text style={{ fontSize: 12, fontFamily: 'Outfit_400Regular', color: Colors.light.icon }}>최종 업데이트: 2025년 1월 1일</Text>
        <Text style={{ fontSize: 12, fontFamily: 'Outfit_400Regular', color: Colors.light.icon }}>v1.0</Text>
      </HStack>

      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack style={{ paddingHorizontal: 20, paddingBottom: 32, gap: 20 }}>
          {SECTIONS.map((s, i) => (
            <Box
              key={i}
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: 18,
                gap: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.03,
                shadowRadius: 8,
                elevation: 1,
              }}
            >
              <Text style={{ fontSize: 14, fontFamily: 'Outfit_700Bold', color: Colors.light.text }}>{s.title}</Text>
              <Text style={{ fontSize: 13, fontFamily: 'Outfit_400Regular', color: Colors.light.icon, lineHeight: 13 * 1.7 }}>{s.body}</Text>
            </Box>
          ))}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
