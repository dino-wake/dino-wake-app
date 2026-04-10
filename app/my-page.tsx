import { Colors } from '@/constants/theme';
import { ChevronLeft, ChevronRight, LogOut, Pencil } from 'lucide-react-native';
import { Pressable, ScrollView, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';
import { router } from 'expo-router';

function Divider() {
  return <View style={{ height: 1, backgroundColor: Colors.light.border }} />;
}

export default function MyPageScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F4F1' }}>
      {/* 헤더 */}
      <HStack style={{ alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 }}>
        <Pressable
          onPress={() => router.back()}
          style={{
            width: 36,
            height: 36,
            borderRadius: 18,
            alignItems: 'center',
            justifyContent: 'center',
          }}
        >
          <ChevronLeft size={24} color={Colors.light.text} />
        </Pressable>
        <View style={{ flex: 1 }} />
        <Text style={{ fontSize: 17, fontFamily: 'Outfit_700Bold', color: Colors.light.text }}>
          마이페이지
        </Text>
        <View style={{ flex: 1 }} />
        <View style={{ width: 36 }} />
      </HStack>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* 프로필 카드 */}
        <Box style={{ paddingHorizontal: 20 }}>
          <Box
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              padding: 20,
              flexDirection: 'row',
              alignItems: 'center',
              gap: 16,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.04,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            <Box
              style={{
                width: 60,
                height: 60,
                borderRadius: 20,
                backgroundColor: '#DFF0E5',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Text style={{ fontSize: 36 }}>🦕</Text>
            </Box>
            <VStack style={{ flex: 1, gap: 4 }}>
              <Text style={{ fontSize: 17, fontFamily: 'Outfit_700Bold', color: Colors.light.text }}>
                공룡집사
              </Text>
              <Text style={{ fontSize: 13, fontFamily: 'Outfit_400Regular', color: Colors.light.icon }}>
                user@example.com
              </Text>
            </VStack>
            <Pressable
              style={{
                width: 34,
                height: 34,
                borderRadius: 10,
                backgroundColor: '#F5F4F1',
                alignItems: 'center',
                justifyContent: 'center',
              }}
            >
              <Pencil size={16} color={Colors.light.icon} />
            </Pressable>
          </Box>
        </Box>

        {/* 포인트 카드 */}
        <Box style={{ paddingHorizontal: 20, paddingTop: 16 }}>
          <Box
            style={{
              backgroundColor: '#3D8A5A',
              borderRadius: 20,
              padding: 20,
              flexDirection: 'row',
              justifyContent: 'space-between',
              alignItems: 'center',
              shadowColor: '#3D8A5A',
              shadowOffset: { width: 0, height: 4 },
              shadowOpacity: 0.19,
              shadowRadius: 16,
              elevation: 4,
            }}
          >
            <VStack style={{ gap: 4 }}>
              <Text style={{ fontSize: 12, fontFamily: 'Outfit_600SemiBold', color: '#FFFFFF99' }}>
                보유 포인트
              </Text>
              <Text style={{ fontSize: 26, fontFamily: 'Outfit_700Bold', color: '#FFFFFF' }}>
                1,240 P
              </Text>
            </VStack>
            <Pressable
              style={{
                backgroundColor: '#FFFFFF20',
                borderRadius: 100,
                paddingHorizontal: 14,
                paddingVertical: 8,
                flexDirection: 'row',
                alignItems: 'center',
                gap: 6,
              }}
            >
              <Text style={{ fontSize: 12, fontFamily: 'Outfit_600SemiBold', color: '#FFFFFF' }}>
                내역 보기
              </Text>
              <ChevronRight size={14} color="#FFFFFF" />
            </Pressable>
          </Box>
        </Box>

        {/* 계정 정보 */}
        <Box style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <Text style={{ fontSize: 12, fontFamily: 'Outfit_600SemiBold', color: Colors.light.icon, letterSpacing: 0.4, marginBottom: 8 }}>
            계정 정보
          </Text>
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
            <HStack style={{ paddingHorizontal: 20, paddingVertical: 16, justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 14, fontFamily: 'Outfit_600SemiBold', color: Colors.light.text }}>이메일</Text>
              <Text style={{ fontSize: 14, fontFamily: 'Outfit_400Regular', color: Colors.light.icon }}>user@example.com</Text>
            </HStack>
            <Divider />
            <HStack style={{ paddingHorizontal: 20, paddingVertical: 16, justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 14, fontFamily: 'Outfit_600SemiBold', color: Colors.light.text }}>가입일</Text>
              <Text style={{ fontSize: 14, fontFamily: 'Outfit_400Regular', color: Colors.light.icon }}>2024년 3월 5일</Text>
            </HStack>
          </Box>
        </Box>

        {/* 기타 */}
        <Box style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <Text style={{ fontSize: 12, fontFamily: 'Outfit_600SemiBold', color: Colors.light.icon, letterSpacing: 0.4, marginBottom: 8 }}>
            기타
          </Text>
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
            <Pressable onPress={() => router.push('/terms')}>
              <HStack style={{ paddingHorizontal: 20, paddingVertical: 16, justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 14, fontFamily: 'Outfit_600SemiBold', color: Colors.light.text }}>이용약관</Text>
                <ChevronRight size={18} color={Colors.light.icon} />
              </HStack>
            </Pressable>
            <Divider />
            <Pressable onPress={() => router.push('/privacy')}>
              <HStack style={{ paddingHorizontal: 20, paddingVertical: 16, justifyContent: 'space-between', alignItems: 'center' }}>
                <Text style={{ fontSize: 14, fontFamily: 'Outfit_600SemiBold', color: Colors.light.text }}>개인정보처리방침</Text>
                <ChevronRight size={18} color={Colors.light.icon} />
              </HStack>
            </Pressable>
            <Divider />
            <HStack style={{ paddingHorizontal: 20, paddingVertical: 16, justifyContent: 'space-between', alignItems: 'center' }}>
              <Text style={{ fontSize: 14, fontFamily: 'Outfit_600SemiBold', color: Colors.light.text }}>앱 버전</Text>
              <Text style={{ fontSize: 14, fontFamily: 'Outfit_400Regular', color: Colors.light.icon }}>v1.0.0</Text>
            </HStack>
          </Box>
        </Box>

        {/* 로그아웃 */}
        <Box style={{ paddingHorizontal: 20, paddingTop: 20 }}>
          <Pressable>
            <Box
              style={{
                backgroundColor: '#FFFFFF',
                borderRadius: 20,
                padding: 20,
                flexDirection: 'row',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.04,
                shadowRadius: 10,
                elevation: 2,
              }}
            >
              <LogOut size={18} color="#E05555" />
              <Text style={{ fontSize: 15, fontFamily: 'Outfit_700Bold', color: '#E05555' }}>
                로그아웃
              </Text>
            </Box>
          </Pressable>
        </Box>

        {/* 회원탈퇴 */}
        <Box style={{ alignItems: 'center', paddingTop: 12, paddingBottom: 32 }}>
          <Pressable>
            <Text style={{ fontSize: 13, fontFamily: 'Outfit_500Medium', color: Colors.light.icon }}>
              회원탈퇴
            </Text>
          </Pressable>
        </Box>

      </ScrollView>
    </SafeAreaView>
  );
}
