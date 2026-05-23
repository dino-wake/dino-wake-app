import { Colors } from '@/constants/theme';
import { getAlarm, initAlarmDb } from '@/lib/db/alarms';
import { insertWakeLog } from '@/lib/db/wake-logs';
import * as Haptics from 'expo-haptics';
import { Clock3 } from 'lucide-react-native';
import { useRef, useState } from 'react';
import { Image, PanResponder, Pressable, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Text } from '@/components/ui/text';
import { Box } from '@/components/ui/box';
import { VStack } from '@/components/ui/vstack';
import Svg, { Circle, Path } from 'react-native-svg';
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  useAnimatedProps,
  withSpring,
} from 'react-native-reanimated';
import { router, useLocalSearchParams } from 'expo-router';
import 'react-native-get-random-values';
import { v4 as uuidv4 } from 'uuid';

// ─── 디자인 토큰 ────────────────────────────────────────

const MINT = '#B8E8D0';
const TEXT_SECONDARY = '#6D6C6A';

// ─── 다이얼 치수 ────────────────────────────────────────

const DIAL_SIZE = 340;
const CX = 170;
const CY = 170;
const OUTER_R = 135;
const INNER_R = 113;
const KNOB_R = (OUTER_R + INNER_R) / 2;

// ─── 감정 정의 ──────────────────────────────────────────
// level: 감정 긍정도 (0=최저, 5=최고)
// 상쾌해요는 360° 완주 후에만 선택 가능 (angle=0/360)

type Emotion = {
  label: string;
  angle: number; // 0=12시, CW 도(°)
  level: number; // SQLite 저장값
};

const EMOTIONS: Emotion[] = [
  { label: '상쾌해요', angle: 0,   level: 5 },
  { label: '설레요',   angle: 60,  level: 4 },
  { label: '불안해요', angle: 120, level: 2 },
  { label: '졸려요',   angle: 180, level: 0 },
  { label: '피곤해요', angle: 240, level: 1 },
  { label: '편안해요', angle: 300, level: 3 },
];

// 감정 레이블 절대 좌표 (dialWrap 340×340 기준)
const LABEL_OFFSETS: { x: number; y: number }[] = [
  { x: 150, y: 6 },   // 상쾌해요
  { x: 292, y: 76 },  // 설레요
  { x: 292, y: 238 }, // 불안해요
  { x: 151, y: 308 }, // 졸려요
  { x: 5,   y: 234 }, // 피곤해요
  { x: 5,   y: 81 },  // 편안해요
];

// ─── Worklet 함수 ────────────────────────────────────────

function toRad(deg: number): number {
  'worklet';
  return ((deg - 90) * Math.PI) / 180;
}

function polarPt(r: number, angle: number): { x: number; y: number } {
  'worklet';
  const rad = toRad(angle);
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

function buildVariableArc(angle: number): string {
  'worklet';
  const a = angle < 0.5 ? 0 : angle > 359.5 ? 359.9 : angle;
  if (a < 0.5) return '';
  const s1 = polarPt(OUTER_R, 0);
  const e1 = polarPt(OUTER_R, a);
  const e2 = polarPt(INNER_R, a);
  const s2 = polarPt(INNER_R, 0);
  const large = a > 180 ? 1 : 0;
  return (
    `M ${s1.x} ${s1.y} ` +
    `A ${OUTER_R} ${OUTER_R} 0 ${large} 1 ${e1.x} ${e1.y} ` +
    `L ${e2.x} ${e2.y} ` +
    `A ${INNER_R} ${INNER_R} 0 ${large} 0 ${s2.x} ${s2.y} Z`
  );
}

// ─── 배경 링 (정적) ─────────────────────────────────────

function buildBgPath(): string {
  const sRad = (0 - 90) * Math.PI / 180;
  const eRad = (359.9 - 90) * Math.PI / 180;
  const s1 = { x: CX + OUTER_R * Math.cos(sRad), y: CY + OUTER_R * Math.sin(sRad) };
  const e1 = { x: CX + OUTER_R * Math.cos(eRad), y: CY + OUTER_R * Math.sin(eRad) };
  const e2 = { x: CX + INNER_R * Math.cos(eRad), y: CY + INNER_R * Math.sin(eRad) };
  const s2 = { x: CX + INNER_R * Math.cos(sRad), y: CY + INNER_R * Math.sin(sRad) };
  return (
    `M ${s1.x} ${s1.y} A ${OUTER_R} ${OUTER_R} 0 1 1 ${e1.x} ${e1.y} ` +
    `L ${e2.x} ${e2.y} A ${INNER_R} ${INNER_R} 0 1 0 ${s2.x} ${s2.y} Z`
  );
}
const BG_PATH = buildBgPath();
const AnimatedPath = Animated.createAnimatedComponent(Path);

// ─── 화면 ───────────────────────────────────────────────

export default function EmotionDialScreen() {
  const { alarmId } = useLocalSearchParams<{ alarmId?: string }>();

  // -1: 미선택 (다이얼 미조작), 0~5: 선택된 감정 인덱스
  const selectedIdxRef = useRef(-1);
  const [selectedIdx, setSelectedIdx] = useState(-1);

  // 다이얼을 한 번이라도 조작했는지
  const [hasMoved, setHasMoved] = useState(false);
  const hasMovedRef = useRef(false);

  const angleValue = useSharedValue(0);

  const arcAnimatedProps = useAnimatedProps(() => ({
    d: buildVariableArc(angleValue.value),
  }));

  const knobAnimStyle = useAnimatedStyle(() => {
    const pos = polarPt(KNOB_R, angleValue.value);
    return {
      position: 'absolute' as const,
      left: pos.x - 17,
      top: pos.y - 17,
    };
  });

  const dialRef = useRef<View>(null);
  const dialPagePos = useRef({ x: 0, y: 0 });

  // ── 감정 선택 ────────────────────────────────────────

  const selectEmotionRef = useRef<(idx: number) => void>(() => {});
  selectEmotionRef.current = (idx: number) => {
    if (idx === selectedIdxRef.current) return;
    selectedIdxRef.current = idx;
    setSelectedIdx(idx);

    const target = idx === 0 && angleValue.value > 180 ? 360 : EMOTIONS[idx].angle;
    angleValue.value = withSpring(target, { damping: 30, stiffness: 200 });

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // ── 터치 각도 계산 ──────────────────────────────────

  const handleTouchRef = useRef<(pageX: number, pageY: number) => void>(() => {});
  handleTouchRef.current = (pageX: number, pageY: number) => {
    // 첫 터치 시 hasMoved 활성화
    if (!hasMovedRef.current) {
      hasMovedRef.current = true;
      setHasMoved(true);
    }

    const dx = pageX - (dialPagePos.current.x + CX);
    const dy = pageY - (dialPagePos.current.y + CY);
    const angleDeg = (Math.atan2(dx, -dy) * 180) / Math.PI;
    const normalized = ((angleDeg % 360) + 360) % 360;

    let nearestIdx = 0;
    let minDiff = Infinity;
    for (let i = 0; i < EMOTIONS.length; i++) {
      const diff = Math.abs(((normalized - EMOTIONS[i].angle + 180 + 360) % 360) - 180);
      if (diff < minDiff) { minDiff = diff; nearestIdx = i; }
    }
    selectEmotionRef.current(nearestIdx);
  };

  const panResponder = useRef(
    PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onMoveShouldSetPanResponder: () => true,
      onPanResponderGrant: (e) =>
        handleTouchRef.current(e.nativeEvent.pageX, e.nativeEvent.pageY),
      onPanResponderMove: (e) =>
        handleTouchRef.current(e.nativeEvent.pageX, e.nativeEvent.pageY),
    })
  ).current;

  // ── 저장 후 일어나기 ─────────────────────────────────

  function handleSaveAndWake() {
    if (!hasMoved || selectedIdx === -1) return;

    initAlarmDb();

    const emotion = EMOTIONS[selectedIdx];
    const now = new Date();
    let alarmHour = now.getHours();
    let alarmMinute = now.getMinutes();

    if (alarmId) {
      const alarm = getAlarm(alarmId);
      if (alarm) {
        alarmHour = alarm.hour;
        alarmMinute = alarm.minute;
      }
    }

    insertWakeLog({
      id: uuidv4(),
      alarmId: alarmId ?? '',
      wokenAt: Date.now(),
      alarmHour,
      alarmMinute,
      emotionLevel: emotion.level,
    });

    router.replace({
      pathname: '/wake-complete' as any,
      params: { mood: emotion.label, alarmId: alarmId ?? '' },
    });
  }

  // ── 나중에 기록 (저장 없이 넘어감) ──────────────────

  function handleSkip() {
    if (alarmId) {
      router.replace({
        pathname: '/wake-complete' as any,
        params: { mood: '', alarmId },
      });
    } else {
      router.back();
    }
  }

  // ── 렌더 ─────────────────────────────────────────────

  const saveDisabled = !hasMoved || selectedIdx === -1;

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* 상단: 공룡 + 말풍선 */}
      <VStack style={{ alignItems: 'center', paddingHorizontal: 24, paddingTop: 15, paddingBottom: 16 }}>
        <View style={{ width: 280, height: 260, position: 'relative' }}>
          <Box
            style={{
              position: 'absolute',
              top: 34,
              right: 0,
              backgroundColor: '#F0F0ED',
              borderRadius: 16,
              paddingHorizontal: 16,
              paddingVertical: 10,
              width: 115,
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontFamily: 'Outfit_600SemiBold',
                color: TEXT_SECONDARY,
                textAlign: 'center',
                lineHeight: 14 * 1.4,
              }}
            >
              오늘 기분이{'\n'}어때요?
            </Text>
          </Box>

          <Image
            source={require('@/assets/images/dino_character.png')}
            style={{ position: 'absolute', bottom: 0, left: (280 - 160) / 2, width: 160, height: 180 }}
            resizeMode="contain"
          />
        </View>
      </VStack>

      {/* 다이얼 섹션 */}
      <VStack style={{ paddingHorizontal: 24, gap: 20 }}>
        {/* 선택된 감정 텍스트 — 미조작 시 invisible (공간 유지) */}
        <Text
          style={{
            fontSize: 20,
            fontFamily: 'Outfit_700Bold',
            color: Colors.light.text,
            letterSpacing: -0.3,
            textAlign: 'center',
            opacity: hasMoved && selectedIdx !== -1 ? 1 : 0,
          }}
        >
          {selectedIdx !== -1 ? EMOTIONS[selectedIdx].label : ' '}
        </Text>

        {/* 다이얼 */}
        <View style={{ alignItems: 'center' }}>
          <View
            ref={dialRef}
            onLayout={() => {
              dialRef.current?.measure((_x, _y, _w, _h, pageX, pageY) => {
                dialPagePos.current = { x: pageX, y: pageY };
              });
            }}
            style={{ width: DIAL_SIZE, height: DIAL_SIZE }}
            {...panResponder.panHandlers}
          >
            <Svg
              width={DIAL_SIZE}
              height={DIAL_SIZE}
              style={{ position: 'absolute', top: 0, left: 0 }}
            >
              <Path d={BG_PATH} fill="#E8E8E4" />
              <AnimatedPath animatedProps={arcAnimatedProps} fill={MINT} />
              <Circle cx={CX} cy={CY} r={INNER_R - 2} fill="#FFFFFF" />
              <Circle cx={CX} cy={CY} r={3} fill="#D0D0CC" />
            </Svg>

            <Animated.View
              style={[
                {
                  width: 34,
                  height: 34,
                  borderRadius: 17,
                  backgroundColor: '#FFFFFF',
                  borderWidth: 3,
                  borderColor: MINT,
                  shadowColor: '#000000',
                  shadowOffset: { width: 0, height: 3 },
                  shadowOpacity: 0.15,
                  shadowRadius: 10,
                  elevation: 4,
                },
                knobAnimStyle,
              ]}
            />

            {EMOTIONS.map((emotion, idx) => {
              const pos = LABEL_OFFSETS[idx];
              const isSelected = idx === selectedIdx;
              return (
                <Pressable
                  key={emotion.label}
                  onPress={() => selectEmotionRef.current(idx)}
                  hitSlop={10}
                  style={{ position: 'absolute', left: pos.x, top: pos.y - 10 }}
                >
                  <Text
                    style={{
                      fontSize: 13,
                      fontFamily: isSelected ? 'Outfit_700Bold' : 'Outfit_500Medium',
                      color: isSelected ? Colors.light.text : Colors.light.icon,
                    }}
                  >
                    {emotion.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>
        </View>

        {/* 기분 기록하고 일어나기 버튼 */}
        <Pressable
          onPress={handleSaveAndWake}
          disabled={saveDisabled}
          style={{
            height: 52,
            borderRadius: 16,
            backgroundColor: '#3D8A5A',
            alignItems: 'center',
            justifyContent: 'center',
            opacity: saveDisabled ? 0.35 : 1,
          }}
        >
          <Text style={{ fontSize: 16, fontFamily: 'Outfit_700Bold', color: '#FFFFFF' }}>
            기분을 기록하고 일어나기
          </Text>
        </Pressable>

        {/* 나중에 기록할래요 버튼 */}
        <Pressable
          onPress={handleSkip}
          style={{
            flexDirection: 'row',
            height: 48,
            borderRadius: 100,
            borderWidth: 1,
            borderColor: Colors.light.border,
            alignItems: 'center',
            justifyContent: 'center',
            gap: 6,
          }}
        >
          <Clock3 size={16} color={TEXT_SECONDARY} />
          <Text style={{ fontSize: 14, fontFamily: 'Outfit_500Medium', color: TEXT_SECONDARY }}>
            나중에 기록할래요
          </Text>
        </Pressable>
      </VStack>
    </SafeAreaView>
  );
}
