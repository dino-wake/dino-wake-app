import { Colors } from '@/constants/theme';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { router } from 'expo-router';

type ScreenItem = {
  label: string;
  route: string;
  desc?: string;
};

type Section = {
  title: string;
  emoji: string;
  items: ScreenItem[];
};

const SECTIONS: Section[] = [
  {
    title: '탭 화면',
    emoji: '🗂️',
    items: [
      { label: '알람 홈', route: '/(tabs)', desc: '알람 목록, 타임 디스플레이' },
      { label: '브리핑', route: '/(tabs)/briefing', desc: '날씨·운세·뉴스 브리핑' },
      { label: '스토어', route: '/(tabs)/store', desc: '다이노 스킨 & 사운드 구매' },
      { label: '설정', route: '/(tabs)/settings', desc: '앱 설정 전반' },
    ],
  },
  {
    title: '알람 플로우',
    emoji: '⏰',
    items: [
      { label: '알람 울림', route: '/alarm-ringing', desc: '알람 해제 / 스누즈 화면' },
    ],
  },
  {
    title: '인증',
    emoji: '🔐',
    items: [
      { label: '로그인', route: '/auth/login', desc: '' },
      { label: '회원가입', route: '/auth/signup', desc: '' },
      { label: '비밀번호 찾기', route: '/auth/forgot-password', desc: '' },
      { label: '비밀번호 재설정', route: '/auth/reset-password', desc: '' },
    ],
  },
  {
    title: '설정 하위',
    emoji: '⚙️',
    items: [
      { label: '마이페이지', route: '/my-page', desc: '프로필, 포인트, 계정 정보' },
      { label: '다이노 스킨', route: '/dino-skin', desc: '보유 스킨 관리' },
      { label: '이용약관', route: '/terms', desc: '' },
      { label: '개인정보처리방침', route: '/privacy', desc: '' },
      { label: '앱 정보', route: '/app-version', desc: '버전, 문의' },
    ],
  },
  {
    title: '브리핑 / 스토어 하위',
    emoji: '🌤',
    items: [
      { label: '날씨 상세', route: '/weather-detail', desc: '시간대별·주간 날씨' },
      { label: '감정 다이얼', route: '/emotion-dial', desc: '오늘의 기분 기록' },
      { label: '포인트 내역', route: '/point-history', desc: '적립·사용 내역' },
    ],
  },
];

function SectionCard({ section }: { section: Section }) {
  return (
    <VStack style={{ gap: 8 }}>
      <HStack style={{ alignItems: 'center', gap: 6, paddingHorizontal: 4 }}>
        <Text style={{ fontSize: 14 }}>{section.emoji}</Text>
        <Text
          style={{
            fontSize: 12,
            fontFamily: 'Outfit_600SemiBold',
            color: Colors.light.icon,
            letterSpacing: 0.4,
          }}
        >
          {section.title.toUpperCase()}
        </Text>
      </HStack>
      <Box
        style={{
          backgroundColor: '#FFFFFF',
          borderRadius: 20,
          overflow: 'hidden',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.04,
          shadowRadius: 10,
          elevation: 2,
        }}
      >
        {section.items.map((item, i) => (
          <View key={item.route}>
            <Pressable onPress={() => router.push(item.route as any)}>
              <HStack
                style={{
                  paddingHorizontal: 20,
                  paddingVertical: 14,
                  alignItems: 'center',
                }}
              >
                <VStack style={{ flex: 1, gap: 2 }}>
                  <Text
                    style={{
                      fontSize: 14,
                      fontFamily: 'Outfit_600SemiBold',
                      color: Colors.light.text,
                    }}
                  >
                    {item.label}
                  </Text>
                  {item.desc ? (
                    <Text
                      style={{
                        fontSize: 12,
                        fontFamily: 'Outfit_400Regular',
                        color: Colors.light.icon,
                      }}
                    >
                      {item.desc}
                    </Text>
                  ) : null}
                </VStack>
                <HStack style={{ alignItems: 'center', gap: 6 }}>
                  <Text
                    style={{
                      fontSize: 11,
                      fontFamily: 'Outfit_400Regular',
                      color: Colors.light.icon,
                    }}
                  >
                    {item.route}
                  </Text>
                  <ChevronRight size={14} color={Colors.light.icon} />
                </HStack>
              </HStack>
            </Pressable>
            {i < section.items.length - 1 && (
              <View style={{ height: 1, backgroundColor: Colors.light.border, marginHorizontal: 20 }} />
            )}
          </View>
        ))}
      </Box>
    </VStack>
  );
}

export default function SitemapScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.light.background }}>
      {/* Header */}
      <HStack style={{ alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 }}>
        <Pressable
          onPress={() => router.back()}
          style={{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}
        >
          <ChevronLeft size={24} color={Colors.light.text} />
        </Pressable>
        <View style={{ flex: 1 }} />
        <Text style={{ fontSize: 17, fontFamily: 'Outfit_700Bold', color: Colors.light.text }}>
          사이트맵
        </Text>
        <View style={{ flex: 1 }} />
        <Box
          style={{
            backgroundColor: '#FFF0E8',
            borderRadius: 8,
            paddingHorizontal: 8,
            paddingVertical: 3,
          }}
        >
          <Text style={{ fontSize: 11, fontFamily: 'Outfit_700Bold', color: '#E8A054', letterSpacing: 0.5 }}>
            DEV
          </Text>
        </Box>
      </HStack>

      <ScrollView showsVerticalScrollIndicator={false}>
        <VStack style={{ paddingHorizontal: 20, paddingTop: 4, paddingBottom: 40, gap: 20 }}>
          {SECTIONS.map((section) => (
            <SectionCard key={section.title} section={section} />
          ))}
        </VStack>
      </ScrollView>
    </SafeAreaView>
  );
}
