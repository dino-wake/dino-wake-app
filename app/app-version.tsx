import { Colors } from '@/constants/theme';
import { ChevronLeft, ChevronRight, MessageSquare, Star, Tag } from 'lucide-react-native';
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

function InfoRow({ label, value }: { label: string; value: string }) {
  return (
    <HStack style={{ paddingHorizontal: 20, paddingVertical: 16, justifyContent: 'space-between', alignItems: 'center' }}>
      <Text style={{ fontSize: 14, fontFamily: 'Outfit_600SemiBold', color: Colors.light.text }}>{label}</Text>
      <Text style={{ fontSize: 14, fontFamily: 'Outfit_400Regular', color: Colors.light.icon }}>{value}</Text>
    </HStack>
  );
}

export default function AppVersionScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F4F1' }}>
      <HStack style={{ alignItems: 'center', paddingHorizontal: 20, paddingVertical: 16 }}>
        <Pressable onPress={() => router.back()} style={{ width: 36, height: 36, borderRadius: 18, alignItems: 'center', justifyContent: 'center' }}>
          <ChevronLeft size={24} color={Colors.light.text} />
        </Pressable>
        <View style={{ flex: 1 }} />
        <Text style={{ fontSize: 17, fontFamily: 'Outfit_700Bold', color: Colors.light.text }}>앱 정보</Text>
        <View style={{ flex: 1 }} />
        <View style={{ width: 36 }} />
      </HStack>

      <ScrollView showsVerticalScrollIndicator={false}>

        {/* 히어로 */}
        <VStack style={{ alignItems: 'center', gap: 12, paddingHorizontal: 24, paddingTop: 32, paddingBottom: 28 }}>
          <Box style={{ width: 88, height: 88, borderRadius: 24, backgroundColor: '#DFF0E5', alignItems: 'center', justifyContent: 'center' }}>
            <Text style={{ fontSize: 56 }}>🦕</Text>
          </Box>
          <Text style={{ fontSize: 22, fontFamily: 'Outfit_700Bold', color: Colors.light.text, textAlign: 'center' }}>
            공룡알림
          </Text>
          <HStack
            style={{
              backgroundColor: '#DFF0E5',
              borderRadius: 100,
              paddingHorizontal: 14,
              paddingVertical: 6,
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Tag size={14} color="#3D8A5A" />
            <Text style={{ fontSize: 13, fontFamily: 'Outfit_700Bold', color: '#3D8A5A' }}>
              v1.0.0 (최신 버전)
            </Text>
          </HStack>
        </VStack>

        {/* 버전 정보 카드 */}
        <VStack style={{ paddingHorizontal: 20, gap: 8 }}>
          <Text style={{ fontSize: 12, fontFamily: 'Outfit_600SemiBold', color: Colors.light.icon, letterSpacing: 0.4 }}>
            버전 정보
          </Text>
          <Box style={{ backgroundColor: '#FFFFFF', borderRadius: 20, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 }}>
            <InfoRow label="현재 버전" value="1.0.0" />
            <Divider />
            <InfoRow label="출시일" value="2025년 1월 1일" />
            <Divider />
            <InfoRow label="마지막 업데이트" value="2025년 4월 10일" />
            <Divider />
            <InfoRow label="앱 크기" value="45.2 MB" />
          </Box>
        </VStack>

        {/* 문의 및 지원 */}
        <VStack style={{ paddingHorizontal: 20, paddingTop: 24, gap: 8 }}>
          <Text style={{ fontSize: 12, fontFamily: 'Outfit_600SemiBold', color: Colors.light.icon, letterSpacing: 0.4 }}>
            문의 및 지원
          </Text>
          <Box style={{ backgroundColor: '#FFFFFF', borderRadius: 20, overflow: 'hidden', shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.04, shadowRadius: 10, elevation: 2 }}>
            <Pressable>
              <HStack style={{ paddingHorizontal: 20, paddingVertical: 16, justifyContent: 'space-between', alignItems: 'center' }}>
                <HStack style={{ alignItems: 'center', gap: 12 }}>
                  <Star size={16} color="#3D8A5A" />
                  <Text style={{ fontSize: 14, fontFamily: 'Outfit_600SemiBold', color: Colors.light.text }}>앱 평가하기</Text>
                </HStack>
                <ChevronRight size={16} color={Colors.light.icon} />
              </HStack>
            </Pressable>
            <Divider />
            <Pressable>
              <HStack style={{ paddingHorizontal: 20, paddingVertical: 16, justifyContent: 'space-between', alignItems: 'center' }}>
                <HStack style={{ alignItems: 'center', gap: 12 }}>
                  <MessageSquare size={16} color="#3D8A5A" />
                  <Text style={{ fontSize: 14, fontFamily: 'Outfit_600SemiBold', color: Colors.light.text }}>문의하기</Text>
                </HStack>
                <ChevronRight size={16} color={Colors.light.icon} />
              </HStack>
            </Pressable>
          </Box>
        </VStack>

        {/* 푸터 */}
        <VStack style={{ alignItems: 'center', gap: 4, paddingTop: 32, paddingBottom: 40 }}>
          <Text style={{ fontSize: 11, fontFamily: 'Outfit_400Regular', color: Colors.light.icon, textAlign: 'center' }}>
            © 2025 Dino Alarm. All rights reserved.
          </Text>
          <Text style={{ fontSize: 11, fontFamily: 'Outfit_400Regular', color: Colors.light.icon, textAlign: 'center' }}>
            Made with 🦕 by Dino Team
          </Text>
        </VStack>

      </ScrollView>
    </SafeAreaView>
  );
}
