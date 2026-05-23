import { Colors } from '@/constants/theme';
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

// 디자인 토큰
const MINT = '#B8E8D0';
const TEXT_SECONDARY = '#6D6C6A';

// 다이얼 치수 (디자인: 270×270 ellipse, dialWrap 340×340)
const DIAL_SIZE = 340;
const CX = 170;
const CY = 170;
const OUTER_R = 135;       // 270 / 2
const INNER_R = 113;       // 135 × 0.84
const KNOB_R = (OUTER_R + INNER_R) / 2; // 링 중간선

type Emotion = {
  label: string;
  angle: number; // 0=위, CW 도(°)
};

const EMOTIONS: Emotion[] = [
  { label: '상쾌해요', angle: 0 },
  { label: '설레요', angle: 60 },
  { label: '불안해요', angle: 120 },
  { label: '졸려요', angle: 180 },
  { label: '피곤해요', angle: 240 },
  { label: '편안해요', angle: 300 },
];

// 디자인 텍스트 절대 좌표 (dialWrap 340×340 기준)
const LABEL_OFFSETS: { x: number; y: number }[] = [
  { x: 150, y: 6 },   // 상쾌해요
  { x: 292, y: 76 },  // 설레요
  { x: 292, y: 238 }, // 불안해요
  { x: 151, y: 308 }, // 졸려요
  { x: 5, y: 234 },   // 피곤해요
  { x: 5, y: 81 },    // 편안해요
];

// ─── worklet 함수 ─────────────────────────────────────
function toRad(deg: number): number {
  'worklet';
  return ((deg - 90) * Math.PI) / 180;
}

function polarPt(r: number, angle: number): { x: number; y: number } {
  'worklet';
  const rad = toRad(angle);
  return { x: CX + r * Math.cos(rad), y: CY + r * Math.sin(rad) };
}

// 0°(12시)에서 angle까지 가변 길이 아크
function buildVariableArc(angle: number): string {
  'worklet';
  // 클램프: 음수 방지, 360° 초과 시 359.9°로 (SVG 완전원 처리)
  const a = angle < 0.5 ? 0 : angle > 359.5 ? 359.9 : angle;
  if (a < 0.5) return ''; // 상쾌해요 초기(0°) 상태
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
// ──────────────────────────────────────────────────────

// 배경 링 (정적, 한 번만 계산) — 359.9° 도넛 경로
function buildBgPath(): string {
  const sRad = (0 - 90) * Math.PI / 180;     // 0° CW-from-top
  const eRad = (359.9 - 90) * Math.PI / 180; // 거의 완전한 원
  const s1 = { x: CX + OUTER_R * Math.cos(sRad), y: CY + OUTER_R * Math.sin(sRad) };
  const e1 = { x: CX + OUTER_R * Math.cos(eRad), y: CY + OUTER_R * Math.sin(eRad) };
  const e2 = { x: CX + INNER_R * Math.cos(eRad), y: CY + INNER_R * Math.sin(eRad) };
  const s2 = { x: CX + INNER_R * Math.cos(sRad), y: CY + INNER_R * Math.sin(sRad) };
  // sweepAngle 359.9° > 180° → large-arc-flag = 1
  return (
    `M ${s1.x} ${s1.y} A ${OUTER_R} ${OUTER_R} 0 1 1 ${e1.x} ${e1.y} ` +
    `L ${e2.x} ${e2.y} A ${INNER_R} ${INNER_R} 0 1 0 ${s2.x} ${s2.y} Z`
  );
}
const BG_PATH = buildBgPath();
const AnimatedPath = Animated.createAnimatedComponent(Path);

export default function EmotionDialScreen() {
  const { alarmId } = useLocalSearchParams<{ alarmId?: string }>();

  // selectedIdx: React 상태 (라벨 렌더링용)
  // selectedIdxRef: PanResponder 클로저에서 최신값 참조용
  const selectedIdxRef = useRef(0);
  const [selectedIdx, setSelectedIdx] = useState(0);

  // 각도 애니메이션 (Reanimated shared value)
  const angleValue = useSharedValue(0); // 12시(0°)에서 시작

  // 아크 SVG path 애니메이션 (0°에서 현재 각도까지 가변)
  const arcAnimatedProps = useAnimatedProps(() => ({
    d: buildVariableArc(angleValue.value),
  }));

  // 노브 위치 애니메이션
  const knobAnimStyle = useAnimatedStyle(() => {
    const pos = polarPt(KNOB_R, angleValue.value);
    return {
      position: 'absolute' as const,
      left: pos.x - 17,
      top: pos.y - 17,
    };
  });

  // 다이얼 화면 좌표 (터치 각도 계산용)
  const dialRef = useRef<View>(null);
  const dialPagePos = useRef({ x: 0, y: 0 });

  // ─── 감정 선택 ──────────────────────────────────────
  // ref 패턴: PanResponder가 최신 함수를 참조하도록
  const selectEmotionRef = useRef<(idx: number) => void>(() => {});
  selectEmotionRef.current = (idx: number) => {
    if (idx === selectedIdxRef.current) return;
    selectedIdxRef.current = idx;
    setSelectedIdx(idx);

    // 상쾌해요(0°)로 이동 시 현재 위치가 높으면 360으로 (시계방향 완주)
    const target = idx === 0 && angleValue.value > 180 ? 360 : EMOTIONS[idx].angle;
    // damping 30 = 임계감쇠(바운스 없음)
    angleValue.value = withSpring(target, { damping: 30, stiffness: 200 });

    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
  };

  // ─── 터치 각도 계산 ─────────────────────────────────
  const handleTouchRef = useRef<(pageX: number, pageY: number) => void>(() => {});
  handleTouchRef.current = (pageX: number, pageY: number) => {
    const dx = pageX - (dialPagePos.current.x + CX);
    const dy = pageY - (dialPagePos.current.y + CY);
    // CW-from-top 각도
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

  // PanResponder (한 번만 생성)
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

  // ─── 확인 ───────────────────────────────────────────
  function handleConfirm() {
    if (alarmId) {
      router.replace({
        pathname: '/wake-complete' as any,
        params: { mood: EMOTIONS[selectedIdx].label, alarmId },
      });
    } else {
      router.back();
    }
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* ── 상단: 공룡 + 말풍선 ── */}
      <VStack style={{ alignItems: 'center', paddingHorizontal: 24, paddingTop: 15, paddingBottom: 16 }}>
        <View style={{ width: 280, height: 260, position: 'relative' }}>
          {/* 말풍선 */}
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

{/* 공룡 이미지 */}
          <Image
            source={require('@/assets/images/dino_character.png')}
            style={{ position: 'absolute', bottom: 0, left: (280 - 160) / 2, width: 160, height: 180 }}
            resizeMode="contain"
          />
        </View>
      </VStack>

      {/* ── 다이얼 섹션 ── */}
      <VStack style={{ paddingHorizontal: 24, gap: 20 }}>
        {/* 선택된 감정 텍스트 */}
        <Text
          style={{
            fontSize: 20,
            fontFamily: 'Outfit_700Bold',
            color: Colors.light.text,
            letterSpacing: -0.3,
            textAlign: 'center',
          }}
        >
          {EMOTIONS[selectedIdx].label}
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
            {/* SVG 링 */}
            <Svg
              width={DIAL_SIZE}
              height={DIAL_SIZE}
              style={{ position: 'absolute', top: 0, left: 0 }}
            >
              {/* 배경 링 */}
              <Path d={BG_PATH} fill="#E8E8E4" />
              {/* 진행 아크 (애니메이션) */}
              <AnimatedPath animatedProps={arcAnimatedProps} fill={MINT} />
              {/* 내부 흰 원 */}
              <Circle cx={CX} cy={CY} r={INNER_R - 2} fill="#FFFFFF" />
              {/* 중심 점 */}
              <Circle cx={CX} cy={CY} r={3} fill="#D0D0CC" />
            </Svg>

            {/* 노브 (애니메이션) */}
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

            {/* 감정 레이블 */}
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

        {/* 버튼: 알람 플로우면 wake-complete, 아니면 뒤로 */}
        <Pressable
          onPress={handleConfirm}
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
