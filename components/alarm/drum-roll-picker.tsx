/**
 * 갤럭시 스타일 드럼롤 타임피커
 *
 * - Reanimated Animated.ScrollView + useAnimatedScrollHandler (UI 스레드)
 * - snapToInterval으로 아이템 단위 스냅
 * - 각 아이템: scrollOffset 거리 기반 opacity/scale 실시간 애니메이션
 * - 무한 스크롤 시뮬레이션: REPEAT 배 배열, 범위 벗어나면 조용히 재위치
 */

import { Colors } from '@/constants/theme';
import { Text } from '@/components/ui/text';
import { useCallback, useMemo } from 'react';
import { NativeSyntheticEvent, NativeScrollEvent, View } from 'react-native';
import Animated, {
  Extrapolation,
  interpolate,
  runOnUI,
  scrollTo,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useAnimatedStyle,
  useSharedValue,
  type SharedValue,
} from 'react-native-reanimated';

// ─── 상수 ─────────────────────────────────────────────────────────────────────

const ITEM_HEIGHT = 54;
const VISIBLE_COUNT = 5;
const PICKER_HEIGHT = ITEM_HEIGHT * VISIBLE_COUNT;
const REPEAT = 5; // 배열 반복 횟수 (총 아이템: hour×5=120, minute×5=300)

// ─── DrumItem ─────────────────────────────────────────────────────────────────

type DrumItemProps = {
  value: number;
  flatIndex: number;
  scrollOffset: SharedValue<number>;
};

function DrumItem({ value, flatIndex, scrollOffset }: DrumItemProps) {
  const animStyle = useAnimatedStyle(() => {
    const distance = Math.abs(flatIndex * ITEM_HEIGHT - scrollOffset.value);
    const opacity = interpolate(
      distance,
      [0, ITEM_HEIGHT, ITEM_HEIGHT * 2],
      [1, 0.4, 0.13],
      Extrapolation.CLAMP
    );
    const scale = interpolate(
      distance,
      [0, ITEM_HEIGHT, ITEM_HEIGHT * 2],
      [1, 0.76, 0.6],
      Extrapolation.CLAMP
    );
    return { opacity, transform: [{ scale }] };
  });

  return (
    <Animated.View
      style={[
        { height: ITEM_HEIGHT, justifyContent: 'center', alignItems: 'center' },
        animStyle,
      ]}
    >
      <Text
        style={{
          fontSize: 44,
          fontFamily: 'Outfit_700Bold',
          color: Colors.light.text,
          lineHeight: ITEM_HEIGHT,
        }}
      >
        {String(value).padStart(2, '0')}
      </Text>
    </Animated.View>
  );
}

// ─── DrumColumn ───────────────────────────────────────────────────────────────

type DrumColumnProps = {
  values: number[];
  value: number;
  onChange: (v: number) => void;
  width?: number;
};

function DrumColumn({ values, value, onChange, width = 120 }: DrumColumnProps) {
  const n = values.length;
  const midRepeat = Math.floor(REPEAT / 2);
  const valueIdx = Math.max(0, values.indexOf(value));
  const initialOffset = (midRepeat * n + valueIdx) * ITEM_HEIGHT;

  // scrollOffset을 initialOffset으로 초기화 → 첫 렌더부터 올바른 스타일
  const scrollOffset = useSharedValue(initialOffset);
  const aref = useAnimatedRef<Animated.ScrollView>();

  const scrollHandler = useAnimatedScrollHandler((event) => {
    scrollOffset.value = event.contentOffset.y;
  });

  const items = useMemo(() => {
    const arr: { key: string; value: number; flatIndex: number }[] = [];
    for (let r = 0; r < REPEAT; r++) {
      for (let i = 0; i < n; i++) {
        arr.push({ key: `${r}_${i}`, value: values[i], flatIndex: r * n + i });
      }
    }
    return arr;
  }, [values, n]);

  const handleScrollEnd = useCallback(
    (e: NativeSyntheticEvent<NativeScrollEvent>) => {
      const offset = e.nativeEvent.contentOffset.y;
      const nearestIdx = Math.round(offset / ITEM_HEIGHT);
      const newValue = values[((nearestIdx % n) + n) % n];
      onChange(newValue);

      // 1/4 ~ 3/4 범위 벗어나면 조용히 중앙으로 재위치
      const safeMin = Math.floor(REPEAT / 4) * n;
      const safeMax = Math.floor((3 * REPEAT) / 4) * n;
      if (nearestIdx < safeMin || nearestIdx > safeMax) {
        const centerIdx = midRepeat * n + (((nearestIdx % n) + n) % n);
        const newOffset = centerIdx * ITEM_HEIGHT;
        runOnUI(() => {
          'worklet';
          scrollTo(aref, 0, newOffset, false);
        })();
      }
    },
    [values, n, onChange, midRepeat, aref]
  );

  return (
    <View style={{ height: PICKER_HEIGHT, width, overflow: 'hidden' }}>
      {/* 중앙 선택 하이라이트 */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: ITEM_HEIGHT * 2,
          left: 4,
          right: 4,
          height: ITEM_HEIGHT,
          backgroundColor: '#F0F0EC',
          borderRadius: 14,
          zIndex: 0,
        }}
      />
      {/* 위쪽 페이드 마스크 */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          height: ITEM_HEIGHT * 2,
          backgroundColor: 'rgba(255,255,255,0.55)',
          zIndex: 2,
        }}
      />
      {/* 아래쪽 페이드 마스크 */}
      <View
        pointerEvents="none"
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          right: 0,
          height: ITEM_HEIGHT * 2,
          backgroundColor: 'rgba(255,255,255,0.55)',
          zIndex: 2,
        }}
      />

      <Animated.ScrollView
        ref={aref}
        onScroll={scrollHandler}
        scrollEventThrottle={16}
        contentOffset={{ x: 0, y: initialOffset }}
        snapToInterval={ITEM_HEIGHT}
        decelerationRate="fast"
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
        contentContainerStyle={{ paddingVertical: ITEM_HEIGHT * 2 }}
        onMomentumScrollEnd={handleScrollEnd}
        onScrollEndDrag={handleScrollEnd}
      >
        {items.map((item) => (
          <DrumItem
            key={item.key}
            value={item.value}
            flatIndex={item.flatIndex}
            scrollOffset={scrollOffset}
          />
        ))}
      </Animated.ScrollView>
    </View>
  );
}

// ─── 공개 컴포넌트 ──────────────────────────────────────────────────────────────

const HOURS = Array.from({ length: 24 }, (_, i) => i);
const MINUTES = Array.from({ length: 60 }, (_, i) => i);

export type DrumRollTimePickerProps = {
  hour: number;
  minute: number;
  onHourChange: (h: number) => void;
  onMinuteChange: (m: number) => void;
};

export function DrumRollTimePicker({
  hour,
  minute,
  onHourChange,
  onMinuteChange,
}: DrumRollTimePickerProps) {
  return (
    <View
      style={{
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <DrumColumn values={HOURS} value={hour} onChange={onHourChange} />
      <Text
        style={{
          fontSize: 44,
          fontFamily: 'Outfit_700Bold',
          color: Colors.light.icon,
          width: 28,
          textAlign: 'center',
          marginBottom: 4,
        }}
      >
        :
      </Text>
      <DrumColumn values={MINUTES} value={minute} onChange={onMinuteChange} />
    </View>
  );
}
