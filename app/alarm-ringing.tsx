import { Colors } from '@/constants/theme';
import { AlarmClock, Bell, Hand } from 'lucide-react-native';
import { useEffect } from 'react';
import { View, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
  Easing,
} from 'react-native-reanimated';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { VStack } from '@/components/ui/vstack';

function RippleCircle({ delay, size }: { delay: number; size: number }) {
  const opacity = useSharedValue(0.5);
  const scale = useSharedValue(0.7);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0, { duration: 2000, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );
    scale.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.out(Easing.ease) }),
      -1,
      false
    );
  }, []);

  const style = useAnimatedStyle(() => ({
    opacity: opacity.value,
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.View
      style={[
        {
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: '#B8E8D0',
          alignSelf: 'center',
        },
        style,
      ]}
    />
  );
}

export default function AlarmRingingScreen() {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F4F1' }}>
      <VStack style={{ flex: 1, alignItems: 'center' }}>

        {/* 알람 메타 */}
        <VStack style={{ alignItems: 'center', gap: 6, paddingHorizontal: 24, paddingTop: 16, width: '100%' }}>
          {/* 알람 배지 */}
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
            <Bell size={13} color="#3D8A5A" />
            <Text style={{ fontSize: 12, fontFamily: 'Outfit_600SemiBold', color: '#3D8A5A' }}>
              아침 기상
            </Text>
          </HStack>

          {/* 시간 */}
          <Text
            style={{
              fontSize: 86,
              fontFamily: 'Outfit_700Bold',
              color: Colors.light.text,
              letterSpacing: -3,
              lineHeight: 96,
            }}
          >
            07:00
          </Text>

          {/* 요일 */}
          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Outfit_500Medium',
              color: Colors.light.icon,
              letterSpacing: 1,
            }}
          >
            월  화  수  목  금
          </Text>
        </VStack>

        {/* 알 + 리플 */}
        <Box style={{ width: 300, height: 360, alignItems: 'center', justifyContent: 'center' }}>
          {/* 리플 원 */}
          <RippleCircle delay={0} size={290} />
          <RippleCircle delay={400} size={244} />
          <RippleCircle delay={800} size={196} />

          {/* 공룡 알 이미지 */}
          <Box
            style={{
              position: 'absolute',
              top: 10,
              width: 190,
              height: 246,
            }}
          >
            <Text style={{ fontSize: 120, textAlign: 'center', lineHeight: 246 }}>🥚</Text>
          </Box>

          {/* 흔들기 라벨 */}
          <HStack
            style={{
              position: 'absolute',
              bottom: 5,
              backgroundColor: '#FFFFFF',
              borderRadius: 100,
              paddingHorizontal: 18,
              paddingVertical: 8,
              alignItems: 'center',
              gap: 6,
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.1,
              shadowRadius: 8,
              elevation: 3,
            }}
          >
            <Box style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#B8DFBE' }} />
            <Box style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#B8DFBE' }} />
            <Box style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#DFF0E5' }} />
            <Text style={{ fontSize: 13, fontFamily: 'Outfit_600SemiBold', color: Colors.light.text }}>
              알람이 울리고 있어요!
            </Text>
          </HStack>
        </Box>

        {/* 힌트 */}
        <VStack style={{ alignItems: 'center', gap: 16, paddingHorizontal: 24, flex: 1, justifyContent: 'center' }}>
          <Hand size={28} color="#B8DFBE" />
          <Text
            style={{
              fontSize: 24,
              fontFamily: 'Outfit_500Medium',
              color: Colors.light.icon,
              lineHeight: 24 * 1.3,
              textAlign: 'center',
            }}
          >
            {'알을 쓰다듬어서\n공룡을 깨워요!'}
          </Text>
        </VStack>

        {/* 스누즈 버튼 */}
        <Pressable
          style={{
            flexDirection: 'row',
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
            paddingHorizontal: 24,
            paddingBottom: 40,
          }}
        >
          <AlarmClock size={14} color={Colors.light.icon} />
          <Text style={{ fontSize: 14, fontFamily: 'Outfit_500Medium', color: Colors.light.icon }}>
            5분 뒤 다시 알림
          </Text>
        </Pressable>

      </VStack>
    </SafeAreaView>
  );
}
