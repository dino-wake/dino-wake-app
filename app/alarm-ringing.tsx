import { Colors } from '@/constants/theme';
import { getAlarm, initAlarmDb } from '@/lib/db/alarms';
import { scheduleSnoozeNotification } from '@/lib/notifications';
import { formatDays, formatTime } from '@/types/alarm';
import { router, useLocalSearchParams } from 'expo-router';
import { AlarmClock, Bell, Hand } from 'lucide-react-native';
import { useEffect, useState } from 'react';
import { Image, Pressable } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

type AlarmInfo = {
  id: string;
  label: string;
  timeStr: string;
  daysStr: string;
  snoozeEnabled: boolean;
  snoozeCount: number;
};

function RippleCircle({ size }: { size: number }) {
  const opacity = useSharedValue(0.5);
  const scale = useSharedValue(0.7);

  useEffect(() => {
    opacity.value = withRepeat(
      withTiming(0, { duration: 2000, easing: Easing.out(Easing.ease) }),
      -1,
      false,
    );
    scale.value = withRepeat(
      withTiming(1, { duration: 2000, easing: Easing.out(Easing.ease) }),
      -1,
      false,
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

const MAX_SNOOZE = 3;

export default function AlarmRingingScreen() {
  const { alarmId } = useLocalSearchParams<{ alarmId?: string }>();
  const [alarm, setAlarm] = useState<AlarmInfo | null>(null);
  const [snoozeCount, setSnoozeCount] = useState(0);

  useEffect(() => {
    initAlarmDb();
    if (alarmId) {
      const found = getAlarm(alarmId);
      if (found) {
        setAlarm({
          id: found.id,
          label: found.label,
          timeStr: formatTime(found.hour, found.minute),
          daysStr: formatDays(found.days),
          snoozeEnabled: found.snooze,
          snoozeCount: 0,
        });
      }
    } else {
      // 사이트맵 등에서 직접 접근 시 기본값 표시
      setAlarm({
        id: '',
        label: '기상',
        timeStr: '07:00',
        daysStr: '주중',
        snoozeEnabled: true,
        snoozeCount: 0,
      });
    }
  }, [alarmId]);

  async function handleSnooze() {
    if (!alarm || snoozeCount >= MAX_SNOOZE) return;
    if (alarm.id) {
      const found = getAlarm(alarm.id);
      if (found) await scheduleSnoozeNotification(found);
    }
    setSnoozeCount((c) => c + 1);
    router.back();
  }

  function handleStartMission() {
    router.replace({
      pathname: '/emotion-dial',
      params: { alarmId: alarm?.id ?? '' },
    });
  }

  const canSnooze = alarm?.snoozeEnabled && snoozeCount < MAX_SNOOZE;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F5F4F1' }}>
      <VStack style={{ flex: 1, alignItems: 'center' }}>

        {/* 알람 메타 */}
        <VStack style={{ alignItems: 'center', gap: 6, paddingHorizontal: 24, paddingTop: 16, width: '100%' }}>
          <HStack
            style={{
              backgroundColor: '#E8F8F0',
              borderRadius: 100,
              paddingHorizontal: 14,
              paddingVertical: 6,
              alignItems: 'center',
              gap: 6,
            }}
          >
            <Bell size={13} color="#3D8A5A" />
            <Text style={{ fontSize: 12, fontFamily: 'Outfit_600SemiBold', color: '#3D8A5A' }}>
              {alarm?.label ?? '알람'}
            </Text>
          </HStack>

          <Text
            style={{
              fontSize: 86,
              fontFamily: 'Outfit_700Bold',
              color: Colors.light.text,
              letterSpacing: -3,
              lineHeight: 96,
            }}
          >
            {alarm?.timeStr ?? '--:--'}
          </Text>

          <Text
            style={{
              fontSize: 13,
              fontFamily: 'Outfit_500Medium',
              color: Colors.light.icon,
              letterSpacing: 1,
            }}
          >
            {alarm?.daysStr ?? ''}
          </Text>
        </VStack>

        {/* 알 + 리플 */}
        <Pressable onPress={handleStartMission}>
          <Box style={{ width: 300, height: 360, alignItems: 'center', justifyContent: 'center' }}>
            <RippleCircle size={290} />
            <RippleCircle size={244} />
            <RippleCircle size={196} />

            <Image
              source={require('@/assets/images/dino_egg.png')}
              style={{ position: 'absolute', top: 10, left: 55, width: 190, height: 246 }}
              resizeMode="contain"
            />

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
              <Box style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#B8E8D0' }} />
              <Box style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#B8E8D0' }} />
              <Box style={{ width: 5, height: 5, borderRadius: 2.5, backgroundColor: '#E8F8F0' }} />
              <Text style={{ fontSize: 13, fontFamily: 'Outfit_600SemiBold', color: Colors.light.text }}>
                알람이 울리고 있어요!
              </Text>
            </HStack>
          </Box>
        </Pressable>

        {/* 힌트 섹션 */}
        <VStack style={{ alignItems: 'center', gap: 16, paddingHorizontal: 24, width: '100%' }}>
          <Hand size={28} color="#B8E8D0" />
          <Text
            style={{
              fontSize: 24,
              fontFamily: 'Outfit_500Medium',
              color: '#6D6C6A',
              textAlign: 'center',
              lineHeight: 24 * 1.3,
            }}
          >
            알을 쓰다듬어서{'\n'}공룡을 깨워요!
          </Text>
        </VStack>

        {/* 스페이서 */}
        <Box style={{ flex: 1 }} />

        {/* 스누즈 버튼 */}
        {canSnooze ? (
          <Pressable
            onPress={handleSnooze}
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
              {snoozeCount > 0
                ? `5분 뒤 다시 알림 (${MAX_SNOOZE - snoozeCount}회 남음)`
                : '5분 뒤 다시 알림'}
            </Text>
          </Pressable>
        ) : (
          <Box style={{ paddingBottom: 40 }}>
            <Text style={{ fontSize: 13, fontFamily: 'Outfit_400Regular', color: Colors.light.icon }}>
              스누즈 횟수를 모두 사용했어요
            </Text>
          </Box>
        )}

      </VStack>
    </SafeAreaView>
  );
}
