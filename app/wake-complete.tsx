import { Colors } from '@/constants/theme';
import { router, useLocalSearchParams } from 'expo-router';
import { Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

const MOOD_MESSAGES: Record<string, string> = {
  상쾌해요: '상쾌한 아침이네요! 오늘도 힘차게 시작해봐요 🌟',
  설레요: '설레는 하루의 시작이에요! 멋진 일이 기다리고 있을 거예요 💫',
  불안해요: '괜찮아요, 천천히 숨을 고르고 시작해봐요. 공룡이 응원해요 🫶',
  졸려요: '아직 졸린가요? 오늘은 일찍 자는 걸 추천해요 😴',
  피곤해요: '몸이 힘들면 오늘은 조금 여유롭게 보내봐요 🌿',
  편안해요: '편안한 마음으로 시작하는 하루, 최고예요 ☀️',
};

export default function WakeCompleteScreen() {
  const { mood, alarmId } = useLocalSearchParams<{ mood?: string; alarmId?: string }>();
  const moodLabel = mood ?? '기상';
  const message = MOOD_MESSAGES[moodLabel] ?? '오늘도 기상 성공! 공룡이 응원해요 🦕';

  function handleGoHome() {
    router.dismissAll();
    router.replace('/(tabs)');
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F4F1' }}>
      <VStack style={{ flex: 1, alignItems: 'center', justifyContent: 'center', paddingHorizontal: 24, gap: 32 }}>

        {/* 캐릭터 */}
        <Image
          source={require('@/assets/images/dino_character.png')}
          style={{ width: 160, height: 180 }}
          resizeMode="contain"
        />

        {/* 완료 메시지 */}
        <VStack style={{ alignItems: 'center', gap: 12 }}>
          <Text
            style={{
              fontSize: 28,
              fontFamily: 'Outfit_700Bold',
              color: Colors.light.text,
              letterSpacing: -0.5,
              textAlign: 'center',
            }}
          >
            기상 성공! 🎉
          </Text>
          <Text
            style={{
              fontSize: 15,
              fontFamily: 'Outfit_400Regular',
              color: Colors.light.icon,
              textAlign: 'center',
              lineHeight: 15 * 1.6,
            }}
          >
            {message}
          </Text>
        </VStack>

        {/* 오늘의 기분 카드 — mood가 있을 때만 표시 */}
        {!!moodLabel && moodLabel !== '기상' && (
          <Box
            style={{
              backgroundColor: '#FFFFFF',
              borderRadius: 20,
              paddingHorizontal: 28,
              paddingVertical: 20,
              width: '100%',
              shadowColor: Colors.light.shadow,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.06,
              shadowRadius: 12,
              elevation: 3,
            }}
          >
            <HStack style={{ alignItems: 'center', justifyContent: 'space-between' }}>
              <Text style={{ fontSize: 14, fontFamily: 'Outfit_500Medium', color: Colors.light.icon }}>
                오늘의 기분
              </Text>
              <Text style={{ fontSize: 14, fontFamily: 'Outfit_600SemiBold', color: Colors.light.text }}>
                {moodLabel}
              </Text>
            </HStack>
          </Box>
        )}

        {/* 홈으로 버튼 */}
        <Pressable
          onPress={handleGoHome}
          style={{
            backgroundColor: '#3D8A5A',
            height: 54,
            borderRadius: 18,
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
          }}
        >
          <Text style={{ color: '#FFFFFF', fontSize: 17, fontFamily: 'Outfit_700Bold' }}>
            홈으로 돌아가기
          </Text>
        </Pressable>

      </VStack>
    </SafeAreaView>
  );
}
