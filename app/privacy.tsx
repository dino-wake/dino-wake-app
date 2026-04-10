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
    title: '수집하는 개인정보',
    body: '서비스는 다음의 개인정보를 수집합니다.\n\n• 필수 항목: 이메일 주소, 닉네임, 비밀번호\n• 자동 수집: 기기 정보, 앱 사용 기록, 알람 설정 데이터\n• 선택 항목: 프로필 이미지',
  },
  {
    title: '개인정보의 이용 목적',
    body: '수집한 개인정보는 다음 목적으로만 사용됩니다.\n\n• 회원 식별 및 서비스 제공\n• 알람 및 브리핑 기능 개인화\n• 포인트 적립 및 스토어 서비스 운영\n• 서비스 개선 및 통계 분석',
  },
  {
    title: '개인정보의 보유 및 파기',
    body: '회원 탈퇴 시 개인정보는 즉시 파기되며, 관련 법령에 따라 보존이 필요한 정보는 해당 기간 동안 안전하게 보관 후 파기됩니다.',
  },
  {
    title: '개인정보 보호 책임자',
    body: '개인정보 관련 문의는 아래 이메일로 연락해 주세요.\n\n📧 privacy@dinoalarm.com',
  },
];

export default function PrivacyScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F4F1' }}>
      <HStack style={{ alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 }}>
        <Pressable onPress={() => router.back()} style={{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={24} color={Colors.light.text} />
        </Pressable>
        <View style={{ flex: 1 }} />
        <Text style={{ fontSize: 17, fontFamily: 'Outfit_700Bold', color: Colors.light.text }}>개인정보처리방침</Text>
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
