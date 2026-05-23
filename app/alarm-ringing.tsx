import { Colors } from '@/constants/theme';
import { getAlarm, initAlarmDb } from '@/lib/db/alarms';
import { scheduleSnoozeNotification } from '@/lib/notifications';
import { formatDays, formatTime } from '@/types/alarm';
import { useAudioPlayer } from 'expo-audio';
import { activateKeepAwakeAsync, deactivateKeepAwake } from 'expo-keep-awake';
import { router, useLocalSearchParams } from 'expo-router';
import { AlarmClock, Bell } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Image, Vibration } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import { SafeAreaView } from 'react-native-safe-area-context';
import Animated, {
  Easing,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import { Box } from '@/components/ui/box';
import { HStack } from '@/components/ui/hstack';
import { Text } from '@/components/ui/text';
import { VStack } from '@/components/ui/vstack';

// ─── 상수 ─────────────────────────────────────────────────────────────────────

const MAX_SWIPE = 5;
const MAX_SNOOZE = 3;
const SWIPE_THRESHOLD = 40; // 유효 스와이프 최소 이동 거리(px)
const SHAKE_DURATION = 90;  // 각 구간 애니메이션 시간(ms)

// ─── RippleCircle ─────────────────────────────────────────────────────────────

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

// ─── SwipeDots ────────────────────────────────────────────────────────────────

function SwipeDots({ count }: { count: number }) {
  return (
    <HStack style={{ gap: 8, alignItems: 'center', justifyContent: 'center' }}>
      {Array.from({ length: MAX_SWIPE }).map((_, i) => (
        <Box
          key={i}
          style={{
            width: i < count ? 20 : 8,
            height: 8,
            borderRadius: 4,
            backgroundColor: i < count ? '#3D8A5A' : '#D9D9D4',
          }}
        />
      ))}
    </HStack>
  );
}

// ─── AlarmRingingScreen ───────────────────────────────────────────────────────

type AlarmInfo = {
  id: string;
  label: string;
  timeStr: string;
  daysStr: string;
  snoozeEnabled: boolean;
};

export default function AlarmRingingScreen() {
  const { alarmId } = useLocalSearchParams<{ alarmId?: string }>();
  const [alarm, setAlarm] = useState<AlarmInfo | null>(null);
  const [snoozeCount, setSnoozeCount] = useState(0);
  const [swipeCount, setSwipeCount] = useState(0);

  // 알람 사운드
  const player = useAudioPlayer(require('@/assets/sounds/alarm.wav'));
  const stoppedRef = useRef(false);

  // 알 기울기 애니메이션 (오뚜기)
  const eggRot = useSharedValue(0);
  const isAnimating = useRef(false);

  // ── 알람 시작 ────────────────────────────────────────────────────────────────

  useEffect(() => {
    player.loop = true;
    player.play();
    Vibration.vibrate([100, 500, 100, 500], true);
    activateKeepAwakeAsync();
    return () => { stopAlarm(); };
  }, []);

  function stopAlarm() {
    if (stoppedRef.current) return;
    stoppedRef.current = true;
    player.pause();
    Vibration.cancel();
    deactivateKeepAwake();
  }

  // ── 알람 데이터 로드 ─────────────────────────────────────────────────────────

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
        });
      }
    } else {
      setAlarm({
        id: '',
        label: '기상',
        timeStr: '07:00',
        daysStr: '주중',
        snoozeEnabled: true,
      });
    }
  }, [alarmId]);

  // ── 스와이프 처리 ────────────────────────────────────────────────────────────

  function onSwipeComplete(nextCount: number) {
    isAnimating.current = false;
    if (nextCount >= MAX_SWIPE) {
      handleStartMission();
    }
  }

  function handleSwipe(direction: 1 | -1) {
    if (isAnimating.current) return;
    isAnimating.current = true;

    const d = direction;
    const next = swipeCount + 1;
    setSwipeCount(next);

    // 오뚜기 기울기: 0 → +d*20° → -d*12° → +d*5° → 0°
    eggRot.value = withSequence(
      withTiming(d * 20, { duration: SHAKE_DURATION }),
      withTiming(-d * 12, { duration: SHAKE_DURATION }),
      withTiming(d * 5, { duration: SHAKE_DURATION }),
      withTiming(0, { duration: SHAKE_DURATION }, () => {
        runOnJS(onSwipeComplete)(next);
      }),
    );
  }

  const panGesture = Gesture.Pan()
    .onEnd((e) => {
      if (Math.abs(e.translationX) < SWIPE_THRESHOLD) return;
      const direction = e.translationX > 0 ? 1 : -1;
      runOnJS(handleSwipe)(direction);
    });

  // 알 하단 중앙 기준 회전 (오뚜기): translateY(+H/2) → rotate → translateY(-H/2)
  const EGG_HALF_H = 123; // height 246 / 2
  const eggStyle = useAnimatedStyle(() => ({
    transform: [
      { translateY: EGG_HALF_H },
      { rotate: `${eggRot.value}deg` },
      { translateY: -EGG_HALF_H },
    ],
  }));

  // ── 네비게이션 ───────────────────────────────────────────────────────────────

  async function handleSnooze() {
    if (!alarm || snoozeCount >= MAX_SNOOZE) return;
    if (alarm.id) {
      const found = getAlarm(alarm.id);
      if (found) await scheduleSnoozeNotification(found);
    }
    stopAlarm();
    setSnoozeCount((c) => c + 1);
    router.back();
  }

  function handleStartMission() {
    stopAlarm();
    router.replace({
      pathname: '/emotion-dial',
      params: { alarmId: alarm?.id ?? '' },
    });
  }

  const canSnooze = alarm?.snoozeEnabled && snoozeCount < MAX_SNOOZE;

  // ── 렌더 ─────────────────────────────────────────────────────────────────────

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

        {/* 알 + 리플 — 스와이프 제스처 영역 */}
        <GestureDetector gesture={panGesture}>
          <Box style={{ width: 300, height: 360, alignItems: 'center', justifyContent: 'center' }}>
            <RippleCircle size={290} />
            <RippleCircle size={244} />
            <RippleCircle size={196} />

            <Animated.Image
              source={require('@/assets/images/dino_egg.png')}
              style={[
                { position: 'absolute', top: 10, left: 55, width: 190, height: 246 },
                eggStyle,
              ]}
              resizeMode="contain"
            />

            {/* 진행 도트 */}
            <Box
              style={{
                position: 'absolute',
                bottom: 5,
                backgroundColor: '#FFFFFF',
                borderRadius: 100,
                paddingHorizontal: 18,
                paddingVertical: 10,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 3,
              }}
            >
              <SwipeDots count={swipeCount} />
            </Box>
          </Box>
        </GestureDetector>

        {/* 힌트 */}
        <VStack style={{ alignItems: 'center', gap: 10, paddingHorizontal: 24, width: '100%' }}>
          <Text
            style={{
              fontSize: 24,
              fontFamily: 'Outfit_500Medium',
              color: '#6D6C6A',
              textAlign: 'center',
              lineHeight: 24 * 1.3,
            }}
          >
            알을 좌우로 쓰다듬어서{'\n'}공룡을 깨워요!
          </Text>
          <Text style={{ fontSize: 13, fontFamily: 'Outfit_400Regular', color: '#B0AFA9' }}>
            {swipeCount < MAX_SWIPE ? `${MAX_SWIPE - swipeCount}번 더 쓰다듬으면 깨어나요` : ''}
          </Text>
        </VStack>

        <Box style={{ flex: 1 }} />

        {/* 스누즈 버튼 */}
        {canSnooze ? (
          <Animated.View
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
            <Text
              onPress={handleSnooze}
              style={{ fontSize: 14, fontFamily: 'Outfit_500Medium', color: Colors.light.icon }}
            >
              {snoozeCount > 0
                ? `5분 뒤 다시 알림 (${MAX_SNOOZE - snoozeCount}회 남음)`
                : '5분 뒤 다시 알림'}
            </Text>
          </Animated.View>
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
